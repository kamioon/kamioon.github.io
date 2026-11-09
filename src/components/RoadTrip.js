import {useEffect, useId, useMemo, useRef, useState} from "react";
import {honk} from "./honk";
import {Wheel, TrailerChassis, TractorBody, TruckBeam, TRAILER_WHEELS, TRACTOR_WHEELS, WHEEL_RADIUS, spin} from "./truckArt";
import {
    EDGE, makeTrip, hillsPath, Windmill, ChurchTower, Euromast, Turbine, Pylon, Poplar, CanalHouses, Canal, TulipField,
} from "./dutchArt";

// The About page scene, a small story that loops:
//  1. A truck brings a PHP container to the yard. The crane unloads it and the tractor leaves.
//  2. The factory takes the PHP container in and puts a Python container out.
//  3. A tractor arrives alone, the crane loads the Python container, the tractor backs under the trailer and leaves.
//  4. The camera zooms out and follows it along a random Dutch road, then it fades back to the yard.
//
// Everything is one SVG in "units" (the truck is 100 x 40). The yard is at x 0..340 and the road runs on to the
// right. The camera is the viewBox, and the far layers move slower than the road for depth.
// The markup is static; the motion is applied from the effect.
const YARD_W = 340;
const ABOVE = 124; // from the top of the crane's beacon down to the wheel line
const GROUND = 120; // y of the wheel line
const SHIFT = GROUND - EDGE; // the yard stands this much higher than the wheels, behind the road
const CAM_HOME = YARD_W / 2;

const BAY = 197.5; // x of the parked trailer
const STOP_GAP = 40; // the tractor waits this far in front of the trailer, then reverses under it
const LANE_OFFSET = 3; // the tractor passes the parked trailer in the lane in front of it

const SLOT_X = 102; // where containers are set down and picked up in the yard
const SLOT_TOP = EDGE - 26;
const CTR_W = 60;
const DECK_X = 4.5; // a container on the trailer: x in the trailer's frame...
const DECK_Y = 81; // ...and y in the scene
const REST_X = 190; // the crane's trolley when idle
const CARRY_Y = 36; // container top while carried
const SLOT_C = SLOT_X + CTR_W / 2;
const DROP_C = BAY + DECK_X + CTR_W / 2;

// Crane steps: [seconds, trolley x, container top y], eased in and out.
const LOAD = { // yard -> trailer
    keys: [[0, REST_X, CARRY_Y], [1.5, SLOT_C, CARRY_Y], [3.0, SLOT_C, SLOT_TOP], [3.6, SLOT_C, SLOT_TOP],
        [5.2, SLOT_C, CARRY_Y], [7.4, DROP_C, CARRY_Y], [9.2, DROP_C, DECK_Y], [9.8, DROP_C, DECK_Y],
        [11.2, DROP_C, CARRY_Y], [12.8, REST_X, CARRY_Y]],
    attach: 3.6, release: 9.8, to: 'loaded', clear: 11.2, // the tractor can back under the trailer at `clear`
};
const UNLOAD = { // trailer -> yard
    keys: [[0, REST_X, CARRY_Y], [1.6, DROP_C, CARRY_Y], [3.2, DROP_C, DECK_Y], [3.8, DROP_C, DECK_Y],
        [5.2, DROP_C, CARRY_Y], [7.4, SLOT_C, CARRY_Y], [9.0, SLOT_C, SLOT_TOP], [9.6, SLOT_C, SLOT_TOP],
        [11.0, SLOT_C, CARRY_Y], [12.4, REST_X, CARRY_Y]],
    attach: 3.8, release: 9.6, to: 'stack', clear: 5.6, // the tractor can uncouple and leave at `clear`
};

// Factory: the container slides in and fades, the factory works, a Python container slides out.
const SLIDE = 26;
const IN = 1.4;
const WORK = 2;
const OUT = 1.4;

const ZOOM_TIME = 3.6;
const CRUISE = 105; // units/s on the open road
const DRIVE_END = 2300; // where the road trip ends and the story cuts back to the yard

// How much of the camera's movement each far layer follows (1 = the road).
const FAR_K = 0.15;
const MID_K = 0.3;
const NEAR_K = 0.6;

const FAR_HILLS = hillsPath(-1700, 2300, EDGE, 44, 0.5);
const NEAR_HILLS = hillsPath(-1700, 2800, EDGE, 22, 2.1);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const ease = t => t * t * (3 - 2 * t);

function sampleCrane(keys, time) {
    let i = 0;
    while (i < keys.length - 2 && time > keys[i + 1][0]) i++;
    const [t0, x0, y0] = keys[i];
    const [t1, x1, y1] = keys[i + 1];
    const e = ease(clamp((time - t0) / (t1 - t0), 0, 1));
    return {x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e};
}

// A 20 ft container. Its label and colour switch between PHP and Python from the effect.
function MovingContainer() {
    const ribs = [];
    for (let x = 4; x < 57; x += 2.8) ribs.push(`M${x.toFixed(1)} 2.2V23.8`);
    return (
        <>
            <rect className="rt-ctr" width="60" height="26" rx="0.8"/>
            <path className="rt-ctr-ribs" d={ribs.join('')}/>
            <rect className="rt-ctr-rail" y="0" width="60" height="1.8"/>
            <rect className="rt-ctr-rail" y="24.2" width="60" height="1.8"/>
            {[[0, 0], [56.8, 0], [0, 22.8], [56.8, 22.8]].map(([x, y]) => (
                <rect key={x + ',' + y} className="rt-ctr-corner" x={x} y={y} width="3.2" height="3.2"/>
            ))}
            <text className="rt-ctr-label k-php" x="30" y="17.6" textAnchor="middle" textLength="26"
                  lengthAdjust="spacingAndGlyphs">PHP</text>
            <text className="rt-ctr-label k-python" x="30" y="17.2" textAnchor="middle" textLength="38"
                  lengthAdjust="spacingAndGlyphs">Python</text>
        </>
    );
}

// Truss under the crane beam
const TRUSS = (() => {
    let d = '';
    for (let x = 96; x < 312; x += 9) d += `M${x} 15.6L${x + 4.5} 12.4L${x + 9} 15.6`;
    return d;
})();

// One landmark from makeTrip (dutchArt.js)
function item(d, i) {
    const key = `${d.t}${i}`;
    switch (d.t) {
        case 'houses':
            return (
                <g key={key}>
                    <CanalHouses x={d.x} count={d.count} from={d.from}/>
                    <Canal x={d.x - 8} width={d.count * 12.6 + 16}/>
                </g>
            );
        case 'tulips':
            return <TulipField key={key} x={d.x} width={d.width} offset={d.offset}/>;
        case 'windmill':
            return <Windmill key={key} x={d.x} s={d.s}/>;
        case 'poplar':
            return <Poplar key={key} x={d.x} y={EDGE - 2} s={d.s}/>;
        case 'turbine':
            return <Turbine key={key} x={d.x} s={d.s} delay={d.delay}/>;
        case 'euromast':
            return <Euromast key={key} x={d.x} s={d.s}/>;
        case 'pylon':
            return <Pylon key={key} x={d.x} s={d.s}/>;
        default:
            return <ChurchTower key={key} x={d.x} s={d.s}/>;
    }
}

export default function RoadTrip({children}) {
    const [seed, setSeed] = useState(1); // the server renders trip 1, the browser picks a new one each trip
    const trip = useMemo(() => makeTrip(seed), [seed]);

    const rootRef = useRef(null);
    const laneRef = useRef(null);
    const svgRef = useRef(null);
    const farRef = useRef(null);
    const midRef = useRef(null);
    const nearRef = useRef(null);
    const tractorRef = useRef(null);
    const trailerRef = useRef(null);
    const ctrRef = useRef(null);
    const trolleyRef = useRef(null);
    const cableRef = useRef(null);
    const spreaderRef = useRef(null);
    const wheelRefs = useRef([]); // the two trailer wheels, then the two tractor wheels
    const beamId = `${useId().replace(/:/g, '')}-beam`;

    useEffect(() => {
        const root = rootRef.current;
        const lane = laneRef.current;
        const svg = svgRef.current;
        const layers = [[farRef.current, FAR_K], [midRef.current, MID_K], [nearRef.current, NEAR_K]];
        const tractor = tractorRef.current;
        const trailer = trailerRef.current;
        const ctr = ctrRef.current;
        const trolley = trolleyRef.current;
        const cable = cableRef.current;
        const spreader = spreaderRef.current;
        const wheels = wheelRefs.current;
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const newTrip = () => setSeed(Math.floor(Math.random() * 2147483647));

        let tx = BAY; // x of the tractor
        let vx = 0;
        let yOff = 0; // 0: in the trailer's lane, LANE_OFFSET: in the lane in front of it
        let coupled = false; // the trailer follows the tractor
        let where = 'stack'; // the container is in the 'stack' (yard slot), on the crane's 'hook' or 'loaded' on the trailer
        let kind = 'php'; // what it says: 'php' or 'python'
        let slide = 0; // how far into the factory dock it is (<= 0)
        let fade = 1;
        let script = LOAD;
        let craneTime = -1; // negative while the crane is idle
        let crane = {x: REST_X, y: CARRY_Y};
        let factoryTime = -1; // negative while the factory is idle
        let factoryStarted = false;
        let ready = false; // the Python container is waiting in the yard
        let tractorAngle = 0;
        let trailerAngle = 0;
        let phase = 'wait';
        let clock = 1;
        let zooming = false;
        let zoomT = 0;
        let W = 0;
        let H = 0;
        let curb = 30; // px of road below the wheel line
        let sYard = 1; // px per unit in the yard shot...
        let sWide = 1; // ...and zoomed out
        let leftYard = 0; // visible part of the yard shot, in units
        let rightYard = YARD_W;
        let raf = 0;
        let last = 0;

        const measure = () => {
            const box = lane.getBoundingClientRect();
            W = box.width;
            H = box.height;
            curb = clamp(H * 0.085, 22, 40);
            sYard = Math.min(W / YARD_W, (H - curb) / ABOVE) || 1;
            sWide = clamp(sYard * 0.62, 0.9, 1.9);
            leftYard = CAM_HOME - W / (2 * sYard);
            rightYard = CAM_HOME + W / (2 * sYard);
        };

        const render = () => {
            // camera: the yard, zooming out and following the rig
            const e = ease(zoomT);
            const s = sYard * Math.pow(sWide / sYard, e);
            const follow = tx + 50 + (W / s) * 0.2;
            const camX = CAM_HOME + (follow - CAM_HOME) * e;
            svg.setAttribute('viewBox', `${(camX - W / (2 * s)).toFixed(2)} ${(GROUND - (H - curb) / s).toFixed(2)} ${(W / s).toFixed(2)} ${(H / s).toFixed(2)}`);
            layers.forEach(([layer, k]) => {
                layer.setAttribute('transform', `translate(${((camX - CAM_HOME) * (1 - k)).toFixed(1)} 0)`);
            });

            const rx = coupled ? tx : BAY;
            tractor.setAttribute('transform', `translate(${tx.toFixed(2)} ${(80 + yOff).toFixed(2)})`);
            trailer.setAttribute('transform', `translate(${rx.toFixed(2)} 80)`);
            const at = where === 'stack' ? [SLOT_X + slide, SLOT_TOP]
                : where === 'hook' ? [crane.x - CTR_W / 2, crane.y]
                    : [rx + DECK_X, DECK_Y];
            ctr.setAttribute('transform', `translate(${at[0].toFixed(2)} ${at[1].toFixed(2)})`);
            ctr.style.opacity = where === 'stack' ? fade.toFixed(2) : '1';
            trolley.setAttribute('transform', `translate(${crane.x.toFixed(2)} 0)`);
            cable.setAttribute('y2', (crane.y - 10.4).toFixed(2));
            spreader.setAttribute('transform', `translate(0 ${(crane.y - 2.4).toFixed(2)})`);
            TRAILER_WHEELS.forEach((cx, i) => {
                if (wheels[i]) wheels[i].setAttribute('transform', spin(cx, trailerAngle));
            });
            TRACTOR_WHEELS.forEach((cx, i) => {
                if (wheels[2 + i]) wheels[2 + i].setAttribute('transform', spin(cx, tractorAngle));
            });
        };

        svg.setAttribute('preserveAspectRatio', 'none'); // the camera makes the viewBox match the box
        newTrip(); // the first trip is not the one the server rendered
        measure();

        if (reduceMotion) {
            // a still picture: the rig loaded with the Python container
            kind = 'python';
            ctr.dataset.kind = kind;
            coupled = true;
            where = 'loaded';
            trailer.classList.remove('parked');
            render();
            return undefined;
        }

        // Speed eases towards `desired` within an acceleration limit, so a heavy truck never jumps to speed.
        const accelerate = (desired, accel, brake, rate, dt) => {
            const speedingUp = desired * vx >= 0 && Math.abs(desired) > Math.abs(vx);
            const limit = (speedingUp ? accel : brake) * dt;
            vx += clamp((desired - vx) * (1 - Math.exp(-rate * dt)), -limit, limit);
        };

        const startCrane = next => {
            script = next;
            craneTime = 0;
        };

        // Start of every round: a rig with a PHP container waits off-screen on the left.
        const arrival = () => {
            kind = 'php';
            ctr.dataset.kind = kind;
            where = 'loaded';
            slide = 0;
            fade = 1;
            coupled = true;
            ready = false;
            factoryStarted = false;
            factoryTime = -1;
            root.classList.remove('working');
            trailer.classList.remove('parked');
            tractor.classList.remove('reversing');
            zooming = false;
            zoomT = 0;
            measure();
            tx = leftYard - 104;
            vx = 0;
            yOff = 0;
            craneTime = -1;
            crane = {x: REST_X, y: CARRY_Y};
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
            measure();
            const before = tx;

            if (phase === 'wait') {
                tx = leftYard - 104; // stay out of sight, even after a resize
                clock -= dt;
                if (clock <= 0) phase = 'arrive';
            } else if (phase === 'arrive') { // the rig with the PHP container stops at the bay
                accelerate(clamp((BAY - tx) * 0.9, 0, CRUISE), 55, 90, 3, dt);
                tx += vx * dt;
                if (BAY - tx < 0.5 && vx < 4) {
                    tx = BAY;
                    vx = 0;
                    phase = 'unload';
                    startCrane(UNLOAD);
                }
            } else if (phase === 'unload') {
                if (craneTime < 0 || craneTime >= UNLOAD.clear) {
                    phase = 'uncouple';
                    clock = 1.1;
                    coupled = false; // the trailer stays, with its landing gear down
                    trailer.classList.add('parked');
                }
            } else if (phase === 'uncouple') {
                clock -= dt;
                if (clock <= 0) phase = 'leave';
            } else if (phase === 'leave') { // the tractor drives away, leaving the empty trailer
                accelerate(110, 40, 70, 1.6, dt);
                tx += vx * dt;
                if (tx >= rightYard + 6) {
                    phase = 'gone';
                    clock = 1;
                }
            } else if (phase === 'gone') { // another tractor comes in from the left
                clock -= dt;
                if (clock <= 0) {
                    tx = leftYard - 104;
                    vx = 0;
                    yOff = LANE_OFFSET;
                    phase = 'enter';
                }
            } else if (phase === 'enter') {
                const target = BAY + STOP_GAP;
                accelerate(clamp((target - tx) * 0.9, 0, 110), 55, 90, 3, dt);
                tx += vx * dt;
                if (target - tx < 0.5 && vx < 4) {
                    tx = target;
                    vx = 0;
                    phase = 'ready';
                }
            } else if (phase === 'ready') { // waits for the Python container and a free crane
                if (ready && craneTime < 0) {
                    phase = 'load';
                    startCrane(LOAD);
                }
            } else if (phase === 'load') {
                if (craneTime < 0 || craneTime >= LOAD.clear) {
                    phase = 'reverse';
                    tractor.classList.add('reversing');
                }
            } else if (phase === 'reverse') {
                accelerate(clamp((BAY - tx) * 1.4, -22, 0), 30, 60, 3, dt);
                tx += vx * dt;
                yOff = LANE_OFFSET * ease(clamp((tx - BAY) / 24, 0, 1)); // straightens up as it backs under
                if (tx - BAY < 0.3 && Math.abs(vx) < 2) {
                    tx = BAY;
                    vx = 0;
                    yOff = 0;
                    coupled = true;
                    trailer.classList.remove('parked');
                    tractor.classList.remove('reversing');
                    phase = 'couple';
                    clock = 1.4;
                }
            } else if (phase === 'couple') {
                clock -= dt;
                if (clock <= 0) phase = 'depart';
            } else if (phase === 'depart') {
                accelerate(CRUISE, 24, 60, 1.2, dt);
                tx += vx * dt;
                if (tx > BAY + 50) {
                    zooming = true;
                    phase = 'drive';
                }
            } else if (phase === 'drive') {
                accelerate(CRUISE, 24, 60, 1.2, dt);
                tx += vx * dt;
                if (tx >= DRIVE_END) {
                    phase = 'fadeOut';
                    clock = 0.9;
                    svg.style.opacity = '0';
                }
            } else if (phase === 'fadeOut') {
                clock -= dt;
                if (clock <= 0) {
                    newTrip();
                    arrival();
                    phase = 'fadeIn';
                    clock = 0.4;
                    svg.style.opacity = '1';
                }
            } else if (phase === 'fadeIn') {
                clock -= dt;
                if (clock <= 0) phase = 'arrive';
            }

            if (craneTime >= 0) {
                craneTime += dt;
                crane = sampleCrane(script.keys, craneTime);
                if (craneTime >= script.release) where = script.to;
                else if (craneTime >= script.attach) where = 'hook';
                // once the PHP container is down and the hook is clear, the factory takes it in
                if (script === UNLOAD && !factoryStarted && craneTime >= UNLOAD.release + 1.2) {
                    factoryStarted = true;
                    factoryTime = 0;
                }
                if (craneTime >= script.keys[script.keys.length - 1][0]) craneTime = -1;
            }

            if (factoryTime >= 0) {
                factoryTime += dt;
                const t = factoryTime;
                if (t < IN) {
                    const e = ease(t / IN);
                    slide = -SLIDE * e;
                    fade = 1 - e;
                } else if (t < IN + WORK) { // PHP goes in, Python comes out
                    slide = -SLIDE;
                    fade = 0;
                    root.classList.add('working');
                    if (kind !== 'python') {
                        kind = 'python';
                        ctr.dataset.kind = kind;
                    }
                } else if (t < IN + WORK + OUT) {
                    const e = ease((t - IN - WORK) / OUT);
                    slide = -SLIDE * (1 - e);
                    fade = e;
                    root.classList.remove('working');
                } else {
                    slide = 0;
                    fade = 1;
                    factoryTime = -1;
                    ready = true;
                    root.classList.remove('working');
                }
            }

            if (zooming) zoomT = Math.min(1, zoomT + dt / ZOOM_TIME);

            // wheels turn with the ground speed; the trailer's only when it is hitched
            const dx = tx - before;
            const turn = dx * (180 / Math.PI) / WHEEL_RADIUS;
            tractorAngle = (tractorAngle + turn) % 360;
            if (coupled) trailerAngle = (trailerAngle + turn) % 360;
            render();
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

        arrival();
        phase = 'wait';
        clock = 1.2;
        render();
        // only animate while the scene is on screen
        let observer = null;
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
            observer.observe(lane);
        } else {
            start();
        }
        return () => {
            stop();
            if (observer) observer.disconnect();
        };
    }, []);

    const onHonk = () => {
        honk();
        const lane = laneRef.current;
        lane.classList.remove('honking');
        void lane.offsetWidth; // restart the flash if it is already running
        lane.classList.add('honking');
    };

    return (
        <section className="roadtrip" ref={rootRef} aria-label="Trucks bringing and taking away containers">
            <div className="rt-top">{children}</div>
            <div className="roadtrip-lane" ref={laneRef}
                 onAnimationEnd={event => event.currentTarget.classList.remove('honking')}>
                <svg ref={svgRef} className="rt-stage" viewBox={`0 0 ${YARD_W} 140`}
                     preserveAspectRatio="xMidYMax meet" focusable="false">
                    <g aria-hidden="true">
                        {/* far: hills, turbines, pylons, TV tower. nearer: hills, church towers, windmills */}
                        <g ref={farRef}>
                            <path className="rt-hill-far" d={FAR_HILLS}/>
                        </g>
                        <g ref={midRef} className="rt-distant">
                            {trip.mid.map(item)}
                        </g>
                        <g ref={nearRef}>
                            <path className="rt-hill-near" d={NEAR_HILLS}/>
                            {trip.near.map(item)}
                        </g>

                        {/* roadside */}
                        <rect className="rt-verge" x="-1500" y={EDGE - 8} width="5000" height="10"/>
                        {trip.world.map(item)}

                        {/* factory */}
                        <g transform={`translate(0 ${-SHIFT})`}>
                            <rect className="rt-brick" x="18" y="44" width="8" height="36"/>
                            <rect className="rt-brick rt-brick-cap" x="17" y="42" width="10" height="3"/>
                            <g className="rt-smoke">
                                <circle cx="22" cy="40" r="3" style={{animationDelay: '0s'}}/>
                                <circle cx="22" cy="40" r="3" style={{animationDelay: '-2s'}}/>
                                <circle cx="22" cy="40" r="3" style={{animationDelay: '-4s'}}/>
                            </g>
                            <rect className="rt-wall" x="8" y="80" width="64" height="40"/>
                            {[0, 1, 2, 3].map(i => (
                                <path key={i} className="rt-roof" d={`M${8 + i * 16} 80V68L${24 + i * 16} 80z`}/>
                            ))}
                            {[14, 28, 42, 56].map(x => <rect key={x} className="rt-win" x={x} y="92" width="8" height="8"/>)}
                            <rect className="rt-wall rt-wall-dark" x="72" y="94" width="26" height="26"/>
                            <rect className="rt-roof" x="70" y="91" width="30" height="3.5"/>
                            <rect className="rt-door" x="76" y="99" width="18" height="21"/>
                            <rect className="rt-door-glow" x="77" y="100" width="16" height="20"/>
                            <path className="rt-door-slats" d="M76 101.5H94M76 104H94M76 106.5H94"/>
                        </g>

                        {/* crane */}
                        <path className="rt-crane-leg"
                              d={`M164 ${EDGE}L171 17L178 ${EDGE}M292 ${EDGE}L299 17L306 ${EDGE}M166.6 80H175.4M294.6 80H303.4`}/>
                        <rect className="rt-crane" x="96" y="10" width="218" height="2.4"/>
                        <rect className="rt-crane" x="96" y="15.6" width="218" height="1.8"/>
                        <path className="rt-crane-truss" d={TRUSS}/>
                        <rect className="rt-crane-cab" x="100" y="17.6" width="13" height="9" rx="1.2"/>
                        <rect className="rt-crane-window" x="102" y="19.2" width="6" height="4" rx="0.6"/>
                        <path className="rt-crane-truss" d="M299 10V5"/>
                        <circle className="rt-beacon" cx="299" cy="4.4" r="1.6"/>

                        {/* road */}
                        <rect className="rt-asphalt" x="-1500" y={EDGE} width="5000" height="100"/>
                        <rect className="rt-edge" x="-1500" y={EDGE} width="5000" height="1.2"/>
                        <path className="rt-dash" d="M-1500 129H3500"/>

                        {/* trolley, cable and spreader */}
                        <g ref={trolleyRef} transform={`translate(${REST_X} 0)`}>
                            <rect className="rt-trolley" x="-5" y="17.4" width="10" height="4.6" rx="1"/>
                            <line ref={cableRef} className="rt-cable" x1="0" y1="22" x2="0" y2={CARRY_Y - 10.4}/>
                            <g ref={spreaderRef} transform={`translate(0 ${CARRY_Y - 2.4})`}>
                                <rect className="rt-trolley" x="-3" y="-8" width="6" height="4" rx="0.8"/>
                                <path className="rt-cable" d="M0 -4L-26 0M0 -4L26 0"/>
                                <rect className="rt-spreader" x="-27" y="0" width="54" height="2.4" rx="0.5"/>
                            </g>
                        </g>
                    </g>

                    <g ref={trailerRef} className="rt-trailer parked" aria-hidden="true" transform={`translate(${BAY} 80)`}>
                        <TrailerChassis/>
                        {TRAILER_WHEELS.map((cx, i) => (
                            <Wheel key={cx} cx={cx} rim="truck-rim truck-rim-trailer"
                                   wheelRef={el => (wheelRefs.current[i] = el)}/>
                        ))}
                    </g>

                    <g ref={ctrRef} className="rt-dyn" data-kind="python" aria-hidden="true"
                       transform={`translate(${SLOT_X} ${SLOT_TOP})`}>
                        <MovingContainer/>
                    </g>

                    {/* click it to honk */}
                    <g ref={tractorRef} className="rt-tractor" role="button" tabIndex={0} aria-label="Honk the horn"
                       transform="translate(-150 83)" onClick={onHonk}
                       onKeyDown={event => {
                           if (event.key === 'Enter' || event.key === ' ') {
                               event.preventDefault();
                               onHonk();
                           }
                       }}>
                        <rect x="44" y="6" width="56" height="34" fill="none" pointerEvents="all"/>
                        <TruckBeam id={beamId}/>
                        <TractorBody/>
                        {TRACTOR_WHEELS.map((cx, i) => (
                            <Wheel key={cx} cx={cx} wheelRef={el => (wheelRefs.current[2 + i] = el)}/>
                        ))}
                    </g>
                </svg>
            </div>
        </section>
    );
}
