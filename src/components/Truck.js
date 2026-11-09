import {useEffect, useId, useRef} from "react";
import {honk} from "./honk";
import {Wheel, TractorBody, TruckBeam, TRAILER_WHEELS, TRACTOR_WHEELS, WHEEL_RADIUS, spin} from "./truckArt";

const TRUCK_WIDTH = 100; // width of the drawing, shown smaller on phones (see App.css)
const WHEEL_XS = [...TRAILER_WHEELS, ...TRACTOR_WHEELS];

const FOLLOW_GAIN = 2; // chase speed per px of distance to the mouse
const FOLLOW_RATE = 8; // how fast the speed catches up
const MAX_SPEED = 400; // px/s while chasing the mouse
const MAX_ACCEL = 600; // px/s²
const MAX_BRAKE = 1200; // brakes harder than it accelerates
const REVERSE_SPEED = 120; // px/s when backing up to a mouse just behind the truck
const LOOP_DISTANCE = 200; // mouse further behind than this: loop around off-screen instead of reversing
const LOOP_SPEED = 260; // px/s while driving off-screen to turn around
const REACH = 80; // px around the road in which the mouse calls the truck
const ACCEL_RATE = 1.4; // idle: gentle acceleration
const BRAKE_RATE = 3.5; // idle: stronger braking

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const rand = (min, max) => min + Math.random() * (max - min);

function randomSpeed() {
    const roll = Math.random();
    if (roll < 0.35) return rand(25, 50);
    if (roll < 0.75) return rand(60, 100);
    return rand(120, 200);
}

// The footer truck. It wanders along the road, follows the mouse when it comes close, and honks when clicked.
// It never turns around in view: it drives off one edge, turns there and comes back.
// The size comes from the CSS variable --truck-w. Motion is applied from the effect, so the markup stays static.
export default function Truck({tagline = 'کامیون', afterHonk = null, label = 'Honk the horn'}) {
    const laneRef = useRef(null);
    const goTimer = useRef(0);
    const truckRef = useRef(null);
    const svgRef = useRef(null);
    const liveryRef = useRef(null);
    const wheelRefs = useRef([]);
    const beamId = `${useId().replace(/:/g, '')}-beam`;

    useEffect(() => {
        const lane = laneRef.current;
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return undefined;

        const truck = truckRef.current;
        const svg = svgRef.current;
        const livery = liveryRef.current;
        const wheels = wheelRefs.current;

        let x = 0; // left edge of the truck in the lane, can be off-screen
        let vx = 0;
        let facing = 1; // 1: cab on the right
        let wheelAngle = 0;
        let maxX = 0;
        let k = 1; // a bigger truck drives and reacts faster
        let pointer = null;
        let wasFollowing = false;
        let plan = {mode: 'drive', speed: 60, time: 3};
        let last = 0;
        let raf = 0;

        // Only called while the truck is off-screen, so nobody sees the flip.
        const turnAround = speed => {
            facing = -facing;
            svg.style.transform = `scaleX(${facing})`;
            livery.setAttribute('transform', facing < 0 ? 'translate(70 0) scale(-1 1)' : ''); // keep the text readable
            vx = facing * speed;
        };

        const nextPlan = previous => {
            if (previous === 'drive') {
                return Math.random() < 0.5
                    ? {mode: 'stop', time: rand(1, 3.5)}
                    : {mode: 'drive', speed: randomSpeed(), time: rand(2, 6)};
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
            // After a redirect React clears the refs before this effect is cleaned up.
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
            const speedScale = clamp(maxX / 900, 0.45, 1) * k; // slower on a short road (phones)
            const following = pointer !== null && pointer.y > rect.top - REACH && pointer.y < rect.bottom + REACH;

            const outside = x < 0 || x > maxX; // partly over an edge
            const gone = facing === 1 ? x >= rect.width : x <= -truckWidth; // completely off the edge it is heading to

            let desired;
            let rate;
            if (following) {
                wasFollowing = true;
                if (gone) turnAround(LOOP_SPEED * k);
                const gap = clamp(pointer.x - rect.left - truckWidth / 2, 0, maxX) - x;
                const mouseBehind = Math.abs(gap) > 30 * k && Math.sign(gap) !== facing;
                if (mouseBehind && Math.abs(gap) > LOOP_DISTANCE * k) {
                    // far behind: drive off-screen, turn around, come back
                    desired = facing * LOOP_SPEED * k;
                    rate = ACCEL_RATE * 2;
                } else if (mouseBehind) {
                    desired = clamp(gap * FOLLOW_GAIN, -REVERSE_SPEED * k, REVERSE_SPEED * k);
                    rate = FOLLOW_RATE;
                } else {
                    desired = Math.abs(gap) < 2 ? 0 : clamp(gap * FOLLOW_GAIN, -MAX_SPEED * k, MAX_SPEED * k);
                    rate = FOLLOW_RATE;
                }
            } else {
                if (wasFollowing) {
                    wasFollowing = false;
                    // never stop half way over the edge
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
                        plan = {mode: 'drive', speed: rand(60, 100), time: 1.5}; // finish driving in or out
                    } else {
                        plan = nextPlan(plan.mode);
                    }
                }

                desired = plan.mode === 'drive' ? facing * plan.speed * speedScale
                    : plan.mode === 'reverse' ? -facing * plan.speed * speedScale : 0;
                rate = Math.abs(desired) > Math.abs(vx) && desired * vx >= 0 ? ACCEL_RATE : BRAKE_RATE;
            }

            // ease towards the wanted speed, within what the truck can accelerate or brake
            const speedingUp = desired * vx >= 0 && Math.abs(desired) > Math.abs(vx);
            const limit = (speedingUp ? MAX_ACCEL : MAX_BRAKE) * k * dt;
            vx += clamp((desired - vx) * (1 - Math.exp(-rate * dt)), -limit, limit);
            x = clamp(x + vx * dt, -truckWidth, rect.width);

            wheelAngle = (wheelAngle + (vx * facing * dt / (WHEEL_RADIUS * scale)) * (180 / Math.PI)) % 360;
            WHEEL_XS.forEach((cx, i) => {
                if (wheels[i]) wheels[i].setAttribute('transform', spin(cx, wheelAngle));
            });
            truck.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
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

        // only animate while the road is on screen
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
    }, []);

    useEffect(() => () => clearTimeout(goTimer.current), []);

    const onHonk = () => {
        honk();
        const lane = laneRef.current;
        lane.classList.remove('honking');
        void lane.offsetWidth; // restart the flash if it is already running
        lane.classList.add('honking');
        // let the horn finish first
        if (afterHonk && !goTimer.current) goTimer.current = setTimeout(afterHonk, 1000);
    };

    return (
        <div className="truck-lane" ref={laneRef}
             onAnimationEnd={event => event.currentTarget.classList.remove('honking')}>
            <div className="truck-road" aria-hidden="true"/>
            <button type="button" className="truck" ref={truckRef} onClick={onHonk} aria-label={label}>
                <svg ref={svgRef} viewBox="0 0 100 40" width="100" height="40" focusable="false" aria-hidden="true">
                    <TruckBeam id={beamId}/>
                    {/* curtain-sider trailer */}
                    <rect className="truck-box" x="0.5" y="3" width="69" height="24" rx="1.6"/>
                    <path className="truck-ribs" d="M10 4.5v21M20 4.5v21M30 4.5v21M40 4.5v21M50 4.5v21M60 4.5v21"/>
                    <rect className="truck-stripe" x="0.5" y="21" width="69" height="2"/>
                    <rect className="truck-light-red" x="0" y="24" width="1.1" height="2.6" rx="0.4"/>
                    <g ref={liveryRef}>
                        <text className="truck-livery-name" x="35" y="14.2" textAnchor="middle" textLength="46"
                              lengthAdjust="spacingAndGlyphs">KAMIOON</text>
                        <text className="truck-livery-line" x="35" y="19" textAnchor="middle">{tagline}</text>
                    </g>
                    {/* trailer underside and tandem axle */}
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
                    <rect className="truck-frame" x="9" y="34.4" width="12" height="1.2"/>
                    <rect className="truck-frame" x="13.4" y="29.7" width="3.2" height="5.2" rx="0.4"/>
                    <path className="truck-guard" d="M3 35A6 6 0 0 1 15 35A6 6 0 0 1 27 35"/>
                    <rect className="truck-frame" x="2.4" y="29.7" width="1.1" height="7.4" rx="0.3"/>
                    {/* air hoses between trailer and cab */}
                    <path className="truck-hose-yellow" d="M69.5 17C72 17 72 21 74.7 21S77 18.2 80.4 21"/>
                    <path className="truck-hose-red" d="M69.5 18.4C72 18.4 72 22.4 74.7 22.4S77 19.6 80.4 22.4"/>
                    <TractorBody/>
                    {WHEEL_XS.map((cx, i) => (
                        <Wheel key={cx} cx={cx} rim={i < 2 ? 'truck-rim truck-rim-trailer' : 'truck-rim'}
                               wheelRef={el => (wheelRefs.current[i] = el)}/>
                    ))}
                </svg>
            </button>
        </div>
    );
}
