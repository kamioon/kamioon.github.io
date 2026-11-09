import {useEffect, useId, useRef} from "react";
import {honk} from "./honk";

const TRUCK_WIDTH = 100; // width of the drawing; on phones it is shown smaller, see App.css
const WHEEL_RADIUS = 5;
// Points on a circle, for the hand holes and the hub nuts (rounded, so server and browser print the same markup).
const ring = (count, radius, offset = 0) => Array.from({length: count}, (_, i) => {
    const angle = offset + (i * 2 * Math.PI) / count;
    return [+(radius * Math.cos(angle)).toFixed(2), +(radius * Math.sin(angle)).toFixed(2)];
});
const HOLES = ring(8, 2.35, Math.PI / 8);
const NUTS = ring(8, 1, 0);
// Trailer tandem axle (silver rims), tractor drive axle and steer axle (red rims); the cab is on the right.
const WHEELS = [
    {cx: 9, cy: 35, rim: 'truck-rim truck-rim-trailer'},
    {cx: 21, cy: 35, rim: 'truck-rim truck-rim-trailer'},
    {cx: 54.5, cy: 35, rim: 'truck-rim'},
    {cx: 86.5, cy: 35, rim: 'truck-rim'},
];

const FOLLOW_GAIN = 2; // chase speed per px of distance to the mouse
const FOLLOW_RATE = 8; // how quickly the speed catches up; with the gain above it is critically damped (no overshoot)
const MAX_SPEED = 400; // px/s while chasing the mouse
const MAX_ACCEL = 600; // px/s², whatever the mode: a truck never jumps to speed...
const MAX_BRAKE = 1200; // ...and brakes a bit harder than it accelerates
const REVERSE_SPEED = 120; // px/s at most when backing up to a mouse that is just behind the truck
const LOOP_DISTANCE = 200; // mouse further behind than this (px): loop around off-screen instead of reversing
const LOOP_SPEED = 260; // px/s while driving out of the screen to turn around
const REACH = 80; // px around the road in which the mouse "calls" the truck
const ACCEL_RATE = 1.4; // idle: gentle acceleration, like a loaded truck
const BRAKE_RATE = 3.5; // idle: braking is stronger than accelerating

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const rand = (min, max) => min + Math.random() * (max - min);

// Crawling, cruising or flat out.
function randomSpeed() {
    const roll = Math.random();
    if (roll < 0.35) return rand(25, 50);
    if (roll < 0.75) return rand(60, 100);
    return rand(120, 200);
}

// A Volvo F12 style truck that wanders along a road and, when the mouse comes close to that road, drives to
// the mouse horizontally. Click it to honk. Purely decorative.
// The truck never turns around in view: it drives off one edge of the screen, turns where nobody can see it, and
// comes back in. It works in any positioned box (the lane): the size comes from the CSS variable --truck-w, and
// `children` (scenery, signs) are drawn behind the truck. With `parallax` the lane gets --truck-x (the truck's
// position in px) so CSS can shift background layers.
// The markup is static (SSR/hydration safe); all motion is applied imperatively from the effect.
export default function Truck({className = '', tagline = 'کامیون', parallax = false, afterHonk = null, label = 'Honk the horn', children}) {
    const laneRef = useRef(null);
    const goTimer = useRef(0);
    const truckRef = useRef(null);
    const svgRef = useRef(null);
    const liveryRef = useRef(null);
    const wheelRefs = useRef([]);
    const beamId = `${useId().replace(/:/g, '')}-beam`;

    useEffect(() => {
        const lane = laneRef.current;
        // Night (or a visitor who prefers dark mode) switches the headlights on; the road scene follows the light.
        const hour = new Date().getHours();
        const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        lane.dataset.phase = dark || hour >= 20 || hour < 6 ? 'night' : hour >= 18 || hour < 8 ? 'dusk' : 'day';

        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return undefined; // stay parked

        const truck = truckRef.current;
        const svg = svgRef.current;
        const livery = liveryRef.current;
        const wheels = wheelRefs.current;

        let x = 0; // left edge of the truck, relative to the lane; may be off-screen (< 0 or > maxX)
        let vx = 0;
        let facing = 1; // 1: cab on the right. Independent of the direction of travel, so it can reverse.
        let wheelAngle = 0;
        let maxX = 0;
        let k = 1; // a bigger truck drives (and reacts) proportionally faster and further
        let pointer = null; // last mouse position in client coordinates
        let wasFollowing = false;
        let plan = {mode: 'drive', speed: 60, time: 3};
        let last = 0;
        let raf = 0;

        // Only called while the truck is completely off-screen, so the flip is never seen.
        const turnAround = speed => {
            facing = -facing;
            svg.style.transform = `scaleX(${facing})`;
            livery.setAttribute('transform', facing < 0 ? 'translate(70 0) scale(-1 1)' : ''); // lettering is never mirrored
            vx = facing * speed; // comes back in at speed
        };

        // The idle behaviour: a random sequence of short plans (drive / stop / reverse), plus 'away' while it is
        // off-screen turning around.
        const nextPlan = previous => {
            if (previous === 'drive') {
                return Math.random() < 0.5
                    ? {mode: 'stop', time: rand(1, 3.5)}
                    : {mode: 'drive', speed: randomSpeed(), time: rand(2, 6)}; // speed up or slow down
            }
            if (previous === 'reverse') return {mode: 'stop', time: rand(0.5, 1.2)};

            const roomBehind = facing === 1 ? x : maxX - x;
            if (Math.random() < 0.2 && roomBehind > 90 * k) {
                return {mode: 'reverse', speed: rand(22, 40), time: rand(1.2, 2.4)};
            }
            return {mode: 'drive', speed: randomSpeed(), time: rand(2, 6)};
        };

        const onMove = event => {
            if (event.pointerType !== 'touch') pointer = {x: event.clientX, y: event.clientY};
        };
        const onLeave = () => {
            pointer = null;
        };

        const frame = now => {
            raf = requestAnimationFrame(frame);
            // React clears the refs when the truck leaves the page, a moment before this effect is cleaned up.
            if (!laneRef.current) {
                stop();
                return;
            }
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            const rect = lane.getBoundingClientRect();
            const truckWidth = truck.offsetWidth;
            const scale = truckWidth / TRUCK_WIDTH;
            k = Math.max(1, scale);
            maxX = Math.max(0, rect.width - truckWidth);
            const speedScale = clamp(maxX / 900, 0.45, 1) * k; // keep the pace sensible on a short road (phones)
            const following = pointer !== null && pointer.y > rect.top - REACH && pointer.y < rect.bottom + REACH;

            const outside = x < 0 || x > maxX; // at least partly over an edge of the screen
            const gone = facing === 1 ? x >= rect.width : x <= -truckWidth; // completely off the edge it is heading to

            let desired;
            let rate;
            if (following) {
                wasFollowing = true;
                if (gone) turnAround(LOOP_SPEED * k); // it was looping around to reach the mouse: now it is facing it
                const gap = clamp(pointer.x - rect.left - truckWidth / 2, 0, maxX) - x;
                const mouseBehind = Math.abs(gap) > 30 * k && Math.sign(gap) !== facing;
                if (mouseBehind && Math.abs(gap) > LOOP_DISTANCE * k) {
                    // Far behind: drive out of the screen, turn around out of sight, come back.
                    desired = facing * LOOP_SPEED * k;
                    rate = ACCEL_RATE * 2;
                } else if (mouseBehind) {
                    // Just behind: back up to it.
                    desired = clamp(gap * FOLLOW_GAIN, -REVERSE_SPEED * k, REVERSE_SPEED * k);
                    rate = FOLLOW_RATE;
                } else {
                    desired = Math.abs(gap) < 2 ? 0 : clamp(gap * FOLLOW_GAIN, -MAX_SPEED * k, MAX_SPEED * k);
                    rate = FOLLOW_RATE;
                }
            } else {
                if (wasFollowing) {
                    wasFollowing = false;
                    // Catch its breath, but never stop half way over the edge.
                    plan = outside ? {mode: 'drive', speed: rand(60, 100), time: 2} : {mode: 'stop', time: rand(1, 1.8)};
                }

                const roomBehind = facing === 1 ? x : maxX - x;
                if (plan.mode === 'drive' && gone) {
                    plan = {mode: 'away', time: rand(0.8, 2.2)}; // out of sight: turn around, then come back
                    vx = 0;
                } else if (plan.mode === 'reverse' && roomBehind < 24 * k) {
                    plan = {mode: 'stop', time: rand(0.5, 1)};
                }

                plan.time -= dt;
                if (plan.time <= 0) {
                    if (plan.mode === 'away') {
                        const speed = randomSpeed();
                        turnAround(speed * speedScale);
                        plan = {mode: 'drive', speed, time: rand(2, 6)};
                    } else if (outside) {
                        plan = {mode: 'drive', speed: rand(60, 100), time: 1.5}; // finish driving in (or out)
                    } else {
                        plan = nextPlan(plan.mode);
                    }
                }

                desired = plan.mode === 'drive' ? facing * plan.speed * speedScale
                    : plan.mode === 'reverse' ? -facing * plan.speed * speedScale : 0;
                rate = Math.abs(desired) > Math.abs(vx) && desired * vx >= 0 ? ACCEL_RATE : BRAKE_RATE;
            }

            // Ease towards the wanted speed, but never faster than the truck can accelerate or brake.
            const speedingUp = desired * vx >= 0 && Math.abs(desired) > Math.abs(vx);
            const limit = (speedingUp ? MAX_ACCEL : MAX_BRAKE) * k * dt;
            vx += clamp((desired - vx) * (1 - Math.exp(-rate * dt)), -limit, limit);
            x = clamp(x + vx * dt, -truckWidth, rect.width);

            // Wheels turn with the ground speed, backwards when reversing.
            wheelAngle = (wheelAngle + (vx * facing * dt / (WHEEL_RADIUS * scale)) * (180 / Math.PI)) % 360;
            WHEELS.forEach(({cx, cy}, i) => {
                if (wheels[i]) wheels[i].setAttribute('transform', `translate(${cx} ${cy}) rotate(${wheelAngle.toFixed(1)})`);
            });
            truck.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
            if (parallax) lane.style.setProperty('--truck-x', x.toFixed(1));
        };

        const start = () => {
            if (raf) return;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        // Only animate while the road is on screen.
        let observer = null;
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
            observer.observe(lane);
        } else {
            start();
        }

        window.addEventListener('pointermove', onMove, {passive: true});
        document.documentElement.addEventListener('mouseleave', onLeave);
        window.addEventListener('blur', onLeave);

        return () => {
            stop();
            if (observer) observer.disconnect();
            window.removeEventListener('pointermove', onMove);
            document.documentElement.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('blur', onLeave);
        };
    }, [parallax]);

    // Click (or Enter/Space when focused) to honk; the lights flash along with it.
    const onHonk = () => {
        honk();
        const lane = laneRef.current;
        lane.classList.remove('honking');
        void lane.offsetWidth; // restart the flash if it is already running
        lane.classList.add('honking');
        // Let the horn finish, then do what was asked (the footer truck takes you to the About page).
        if (afterHonk && !goTimer.current) goTimer.current = setTimeout(afterHonk, 1000);
    };

    useEffect(() => () => clearTimeout(goTimer.current), []);

    return (
        <div className={`truck-lane ${className}`.trim()} ref={laneRef}
             onAnimationEnd={event => event.currentTarget.classList.remove('honking')}>
            {children}
            <div className="truck-road" aria-hidden="true"/>
            <button type="button" className="truck" ref={truckRef} onClick={onHonk} aria-label={label}>
                <svg ref={svgRef} viewBox="0 0 100 40" width="100" height="40" focusable="false" aria-hidden="true">
                    {/* Headlight beam: only visible at dusk and night */}
                    <defs>
                        <linearGradient id={beamId} gradientUnits="userSpaceOnUse" x1="98.9" y1="0" x2="152" y2="0">
                            <stop offset="0" stopColor="#fff4b8" stopOpacity="0.6"/>
                            <stop offset="1" stopColor="#fff4b8" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    <path className="truck-beam" fill={`url(#${beamId})`} d="M98.9 23.4L152 14.5V39L98.9 26.6z"/>
                    {/* Curtain-sider semi-trailer */}
                    <rect className="truck-box" x="0.5" y="3" width="69" height="24" rx="1.6"/>
                    <path className="truck-ribs" d="M10 4.5v21M20 4.5v21M30 4.5v21M40 4.5v21M50 4.5v21M60 4.5v21"/>
                    <rect className="truck-stripe" x="0.5" y="21" width="69" height="2"/>
                    <rect className="truck-light-red" x="0" y="24" width="1.1" height="2.6" rx="0.4"/>
                    {/* Livery: the name, and a line that depends on where the truck is parked */}
                    <g ref={liveryRef}>
                        <text className="truck-livery-name" x="35" y="14.2" textAnchor="middle" textLength="46"
                              lengthAdjust="spacingAndGlyphs">KAMIOON</text>
                        <text className="truck-livery-line" x="35" y="19" textAnchor="middle">{tagline}</text>
                    </g>
                    {/* Trailer underside: floor frame, sub-frame beam, rear under-run bar, side guard rails, landing gear */}
                    <rect className="truck-frame" x="1.5" y="27" width="67.5" height="1.2"/>
                    <rect className="truck-frame" x="4" y="28.2" width="42" height="1.5"/>
                    <rect className="truck-frame" x="2.6" y="29.5" width="0.8" height="2"/>
                    <rect className="truck-frame" x="0.8" y="31" width="2.6" height="1.1" rx="0.4"/>
                    <rect className="truck-frame" x="28" y="31.2" width="15" height="0.8"/>
                    <rect className="truck-frame" x="28" y="33.6" width="15" height="0.8"/>
                    <rect className="truck-frame" x="28" y="29.7" width="0.7" height="4.7"/>
                    <rect className="truck-frame" x="42.3" y="29.7" width="0.7" height="4.7"/>
                    <rect className="truck-frame" x="35.6" y="29.7" width="1.5" height="5.6"/>
                    <rect className="truck-frame" x="33.6" y="35" width="5.5" height="0.9" rx="0.3"/>
                    {/* Trailer tandem axle: axle beam, hanger, spray guards, mud flap */}
                    <rect className="truck-frame" x="9" y="34.4" width="12" height="1.2"/>
                    <rect className="truck-frame" x="13.4" y="29.7" width="3.2" height="5.2" rx="0.4"/>
                    <path className="truck-guard" d="M3 35A6 6 0 0 1 15 35A6 6 0 0 1 27 35"/>
                    <rect className="truck-frame" x="2.4" y="29.7" width="1.1" height="7.4" rx="0.3"/>
                    {/* Tractor: frame rails, fifth wheel, air hoses, fuel tank, battery box */}
                    <rect className="truck-frame" x="44" y="29.3" width="38" height="2.3"/>
                    <rect className="truck-stack" x="49" y="28.2" width="12.5" height="1.2" rx="0.3"/>
                    <path className="truck-hose-yellow" d="M69.5 17C72 17 72 21 74.7 21S77 18.2 80.4 21"/>
                    <path className="truck-hose-red" d="M69.5 18.4C72 18.4 72 22.4 74.7 22.4S77 19.6 80.4 22.4"/>
                    <rect className="truck-tank" x="62" y="31.6" width="10" height="5.2" rx="2.3"/>
                    <path className="truck-strap" d="M65 31.6v5.2M69 31.6v5.2"/>
                    <rect className="truck-frame" x="73.2" y="31.6" width="5.4" height="3.9" rx="0.5"/>
                    {/* Drive axle: curved black fender and mud flap */}
                    <path className="truck-fender" d="M48.1 35.2A6.4 6.4 0 0 1 60.9 35.2H59.8A5.3 5.3 0 0 0 49.2 35.2z"/>
                    <rect className="truck-fender" x="47" y="30.6" width="1.2" height="6.8" rx="0.3"/>
                    {/* Volvo F12 cab-over: a short, tall cab with the lower front panel stepping out, and the
                        vertical exhaust stack with its box head up the back of the cab */}
                    <rect className="truck-stack" x="79.9" y="10.6" width="1.4" height="20.8" rx="0.4"/>
                    <rect className="truck-trim" x="79.9" y="8.6" width="3.6" height="2.4" rx="0.5"/>
                    <rect className="truck-fender" x="79.9" y="31.4" width="1.2" height="6.2" rx="0.3"/>
                    <path className="truck-cab"
                          d="M81.2 31.4V13Q81.2 11.8 82.4 11.8H95.6Q96.8 11.8 96.9 13L97.3 20.6L98.4 21.4V31.4z"/>
                    <rect className="truck-cab" x="89" y="10.9" width="5.6" height="1.1" rx="0.5"/>
                    <path className="truck-arch" d="M81.2 30.74A6.8 6.8 0 0 1 92.27 31.4H81.2z"/>
                    <path className="truck-seam"
                          d="M81.2 29.41A7.7 7.7 0 0 1 93.31 31.4M82 13.3H96.5M87.5 13.3V26.6M82.4 14.4H86.4V22.2H82.4zM82.4 23.4H86.4V26.4H82.4z"/>
                    <path className="truck-glass" d="M88.3 14.4H95.1L95.9 20.6H88.3z"/>
                    <path className="truck-glint" d="M91.3 14.4H93.5L90.9 20.6H88.7z"/>
                    <rect className="truck-trim" x="89.4" y="24.9" width="6" height="1.3" rx="0.4"/>
                    <rect className="truck-trim" x="96.1" y="13.2" width="1.7" height="6.2" rx="0.7"/>
                    <rect className="truck-light-amber" x="95.4" y="10.7" width="1.4" height="1" rx="0.3"/>
                    <rect className="truck-headlight" x="97.4" y="23.6" width="1.5" height="2.8" rx="0.7"/>
                    <rect className="truck-light-amber" x="97" y="27.4" width="1.5" height="2.6" rx="0.5"/>
                    <rect className="truck-bumper" x="96.2" y="31.6" width="3.7" height="3" rx="1"/>
                    {/* Wheels (rotated from the effect): black tyre, steel rim with hand holes, silver hub cap with nuts */}
                    {WHEELS.map(({cx, cy, rim}, i) => (
                        <g key={cx} ref={el => (wheelRefs.current[i] = el)} transform={`translate(${cx} ${cy})`}>
                            <circle className="truck-tire" r={WHEEL_RADIUS}/>
                            <circle className="truck-tread" r="4.1"/>
                            <circle className={rim} r="3.2"/>
                            {HOLES.map(([hx, hy]) => <circle key={hx + ',' + hy} className="truck-hole" cx={hx} cy={hy} r="0.45"/>)}
                            <circle className="truck-hub" r="1.5"/>
                            {NUTS.map(([nx, ny]) => <circle key={nx + ',' + ny} className="truck-lug" cx={nx} cy={ny} r="0.2"/>)}
                            <circle className="truck-lug" r="0.4"/>
                        </g>
                    ))}
                </svg>
            </button>
        </div>
    );
}
