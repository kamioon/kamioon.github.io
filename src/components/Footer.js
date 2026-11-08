import {useEffect, useRef} from "react";
import {honk} from "./honk";

const TRUCK_WIDTH = 100; // width of the drawing; on phones it is shown smaller, see App.css
const WHEEL_RADIUS = 5;
// Trailer tandem axle, tractor drive axle, tractor steer axle (the cab is on the right).
const WHEELS = [{cx: 9, cy: 35}, {cx: 21, cy: 35}, {cx: 57, cy: 35}, {cx: 90, cy: 35}];
// Five lug nuts around each hub, so the spinning is visible.
const LUGS = [[0, -1.7], [1.62, -0.53], [1, 1.38], [-1, 1.38], [-1.62, -0.53]];

const FOLLOW_GAIN = 2; // chase speed per px of distance to the mouse
const FOLLOW_RATE = 8; // how quickly the speed catches up; with the gain above it is critically damped (no overshoot)
const MAX_SPEED = 400; // px/s while chasing the mouse
const MAX_ACCEL = 600; // px/s², whatever the mode: a truck never jumps to speed...
const MAX_BRAKE = 1200; // ...and brakes a bit harder than it accelerates
const REVERSE_SPEED = 120; // px/s at most when backing up to a mouse that is just behind the truck
const LOOP_DISTANCE = 200; // mouse further behind than this (px): loop around off-screen instead of reversing
const LOOP_SPEED = 260; // px/s while driving out of the screen to turn around
const REACH = 80; // px above the footer in which the mouse "calls" the truck
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

// A tiny Volvo F12 style truck that wanders along the bottom of the page and, when the mouse
// comes close to the footer, drives to the mouse horizontally. Purely decorative.
// The truck never turns around in view: it drives off one edge of the screen, turns where nobody
// can see it, and comes back in.
// The markup is static (SSR/hydration safe); all motion is applied imperatively from the effect.
export default function Footer() {
    const footerRef = useRef(null);
    const truckRef = useRef(null);
    const svgRef = useRef(null);
    const wheelRefs = useRef([]);

    useEffect(() => {
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return undefined; // stay parked

        const footer = footerRef.current;
        const truck = truckRef.current;
        const svg = svgRef.current;
        const wheels = wheelRefs.current;

        let x = 0; // left edge of the truck, relative to the footer; may be off-screen (< 0 or > maxX)
        let vx = 0;
        let facing = 1; // 1: cab on the right. Independent of the direction of travel, so it can reverse.
        let wheelAngle = 0;
        let maxX = 0;
        let pointer = null; // last mouse position in client coordinates
        let wasFollowing = false;
        let plan = {mode: 'drive', speed: 60, time: 3};
        let last = 0;
        let raf = 0;

        // Only called while the truck is completely off-screen, so the flip is never seen.
        const turnAround = speed => {
            facing = -facing;
            svg.style.transform = `scaleX(${facing})`;
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
            if (Math.random() < 0.2 && roomBehind > 90) {
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
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            const rect = footer.getBoundingClientRect();
            const truckWidth = truck.offsetWidth;
            const scale = truckWidth / TRUCK_WIDTH;
            maxX = Math.max(0, rect.width - truckWidth);
            const speedScale = clamp(maxX / 900, 0.45, 1); // keep the pace sensible on a short road (phones)
            const following = pointer !== null && pointer.y > rect.top - REACH && pointer.y < rect.bottom + REACH;

            const outside = x < 0 || x > maxX; // at least partly over an edge of the screen
            const gone = facing === 1 ? x >= rect.width : x <= -truckWidth; // completely off the edge it is heading to

            let desired;
            let rate;
            if (following) {
                wasFollowing = true;
                if (gone) turnAround(LOOP_SPEED); // it was looping around to reach the mouse: now it is facing it
                const gap = clamp(pointer.x - rect.left - truckWidth / 2, 0, maxX) - x;
                const mouseBehind = Math.abs(gap) > 30 && Math.sign(gap) !== facing;
                if (mouseBehind && Math.abs(gap) > LOOP_DISTANCE) {
                    // Far behind: drive out of the screen, turn around out of sight, come back.
                    desired = facing * LOOP_SPEED;
                    rate = ACCEL_RATE * 2;
                } else if (mouseBehind) {
                    // Just behind: back up to it.
                    desired = clamp(gap * FOLLOW_GAIN, -REVERSE_SPEED, REVERSE_SPEED);
                    rate = FOLLOW_RATE;
                } else {
                    desired = Math.abs(gap) < 2 ? 0 : clamp(gap * FOLLOW_GAIN, -MAX_SPEED, MAX_SPEED);
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
                } else if (plan.mode === 'reverse' && roomBehind < 24) {
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
            const limit = (speedingUp ? MAX_ACCEL : MAX_BRAKE) * dt;
            vx += clamp((desired - vx) * (1 - Math.exp(-rate * dt)), -limit, limit);
            x = clamp(x + vx * dt, -truckWidth, rect.width);

            // Wheels turn with the ground speed, backwards when reversing.
            wheelAngle = (wheelAngle + (vx * facing * dt / (WHEEL_RADIUS * scale)) * (180 / Math.PI)) % 360;
            WHEELS.forEach(({cx, cy}, i) => {
                wheels[i].setAttribute('transform', `translate(${cx} ${cy}) rotate(${wheelAngle.toFixed(1)})`);
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

        // Only animate while the footer is on screen.
        let observer = null;
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
            observer.observe(footer);
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

    // Click (or Enter/Space when focused) to honk; the lights flash along with it.
    const onHonk = () => {
        honk();
        const footer = footerRef.current;
        footer.classList.remove('honking');
        void footer.offsetWidth; // restart the flash if it is already running
        footer.classList.add('honking');
    };

    return (
        <footer className="truck-footer" ref={footerRef}
                onAnimationEnd={event => event.currentTarget.classList.remove('honking')}>
            <div className="truck-road" aria-hidden="true"/>
            <button type="button" className="truck" ref={truckRef} onClick={onHonk} aria-label="Honk the horn">
                <svg ref={svgRef} viewBox="0 0 100 40" width="100" height="40" focusable="false" aria-hidden="true">
                    {/* Curtain-sider trailer */}
                    <rect className="truck-box" x="0.5" y="3" width="69.5" height="24" rx="1.6"/>
                    <path className="truck-ribs" d="M10 4.5v21M20 4.5v21M30 4.5v21M40 4.5v21M50 4.5v21M60 4.5v21"/>
                    <rect className="truck-stripe" x="0.5" y="21" width="69.5" height="2"/>
                    <rect className="truck-light-red" x="0" y="24" width="1.1" height="2.6" rx="0.4"/>
                    {/* Chassis, landing gear, mud flaps */}
                    <rect className="truck-frame" x="3" y="27" width="77" height="2.4"/>
                    <rect className="truck-frame" x="44" y="29.4" width="1.6" height="4.2"/>
                    <rect className="truck-frame" x="42.8" y="33.4" width="4" height="1"/>
                    <rect className="truck-frame" x="1.8" y="29.4" width="1.4" height="6.5"/>
                    <rect className="truck-frame" x="50.6" y="29.4" width="1.4" height="6.5"/>
                    {/* Vertical exhaust stack behind the cab, fuel tank */}
                    <rect className="truck-stack" x="71.2" y="4" width="1.8" height="25" rx="0.6"/>
                    <rect className="truck-frame" x="70.8" y="3.4" width="2.6" height="1.4" rx="0.5"/>
                    <rect className="truck-tank" x="66" y="30.4" width="11" height="5.6" rx="2.2"/>
                    <path className="truck-strap" d="M69.5 30.4v5.6M73.5 30.4v5.6"/>
                    {/* Narrow cab-over-engine cab: tall, flat front, sun visor, steps behind the front wheel */}
                    <path className="truck-arch" d="M84 35a6 6 0 0 1 12 0z"/>
                    <path className="truck-cab"
                          d="M76 30V11Q76 8.5 78.5 8.5H95Q96.8 8.5 97.3 10.3L98.5 19.5L99 28.5V30z"/>
                    <path className="truck-seam" d="M85 9.8V28.6H98.6"/>
                    <path className="truck-glass" d="M87 11H94.9L96.1 19.8H87z"/>
                    <path className="truck-glint" d="M89.5 11h2.6l-3.4 8.8H87v-2z"/>
                    <rect className="truck-glass" x="78.3" y="13.5" width="4.6" height="3.8" rx="0.8"/>
                    <rect className="truck-trim" x="86.3" y="22.4" width="3" height="0.9" rx="0.45"/>
                    <rect className="truck-trim" x="96.5" y="13" width="2.2" height="5.4" rx="0.9"/>
                    <rect className="truck-trim" x="95.4" y="7.9" width="4.4" height="1.3" rx="0.5"/>
                    <rect className="truck-light-amber" x="87.5" y="6.7" width="1.6" height="1.4" rx="0.3"/>
                    <rect className="truck-light-amber" x="90" y="6.7" width="1.6" height="1.4" rx="0.3"/>
                    <rect className="truck-light-amber" x="92.5" y="6.7" width="1.6" height="1.4" rx="0.3"/>
                    <rect className="truck-headlight" x="97.7" y="22" width="2.2" height="3" rx="0.9"/>
                    <rect className="truck-trim" x="96.5" y="28" width="3.5" height="2.7" rx="1"/>
                    <rect className="truck-trim" x="78.5" y="30" width="5.5" height="1.2" rx="0.4"/>
                    {/* Wheels (rotated from the effect) */}
                    {WHEELS.map(({cx, cy}, i) => (
                        <g key={cx} ref={el => (wheelRefs.current[i] = el)} transform={`translate(${cx} ${cy})`}>
                            <circle className="truck-tire" r={WHEEL_RADIUS}/>
                            <circle className="truck-tread" r="4.2"/>
                            <circle className="truck-rim" r="2.9"/>
                            {LUGS.map(([lx, ly]) => <circle key={lx + ',' + ly} className="truck-lug" cx={lx} cy={ly} r="0.42"/>)}
                            <circle className="truck-hub" r="0.9"/>
                        </g>
                    ))}
                </svg>
            </button>
        </footer>
    );
}
