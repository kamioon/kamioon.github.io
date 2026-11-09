// Parts of the truck drawing, shared by the footer truck (Truck.js) and the road scene (RoadTrip.js).
// The drawing is 100 x 40 units: road at y = 40, cab on the right.

export const WHEEL_RADIUS = 5;
export const WHEEL_Y = 35;
export const TRAILER_WHEELS = [9, 21]; // x of the tandem axle
export const TRACTOR_WHEELS = [54.5, 86.5]; // x of the drive axle and the steer axle

export const spin = (cx, angle) => `translate(${cx} ${WHEEL_Y}) rotate(${angle.toFixed(1)})`;

// Rounded, so the server and the browser print the same markup.
const ring = (count, radius, offset = 0) => Array.from({length: count}, (_, i) => {
    const angle = offset + (i * 2 * Math.PI) / count;
    return [+(radius * Math.cos(angle)).toFixed(2), +(radius * Math.sin(angle)).toFixed(2)];
});
const HOLES = ring(8, 2.35, Math.PI / 8);
const NUTS = ring(8, 1, 0);

export function Wheel({cx, rim = 'truck-rim', wheelRef}) {
    return (
        <g ref={wheelRef} transform={`translate(${cx} ${WHEEL_Y})`}>
            <circle className="truck-tire" r={WHEEL_RADIUS}/>
            <circle className="truck-tread" r="4.1"/>
            <circle className={rim} r="3.2"/>
            {HOLES.map(([hx, hy]) => <circle key={hx + ',' + hy} className="truck-hole" cx={hx} cy={hy} r="0.45"/>)}
            <circle className="truck-hub" r="1.5"/>
            {NUTS.map(([nx, ny]) => <circle key={nx + ',' + ny} className="truck-lug" cx={nx} cy={ny} r="0.2"/>)}
            <circle className="truck-lug" r="0.4"/>
        </g>
    );
}

// Only visible at dusk and night (see App.css).
export function TruckBeam({id}) {
    return (
        <>
            <defs>
                <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="98.9" y1="0" x2="152" y2="0">
                    <stop offset="0" stopColor="#fff4b8" stopOpacity="0.6"/>
                    <stop offset="1" stopColor="#fff4b8" stopOpacity="0"/>
                </linearGradient>
            </defs>
            <path className="truck-beam" fill={`url(#${id})`} d="M98.9 23.4L152 14.5V39L98.9 26.6z"/>
        </>
    );
}

// Container chassis. The landing gear slides down when the trailer is parked (.rt-trailer in App.css).
export function TrailerChassis() {
    return (
        <>
            <rect className="truck-frame" x="1.5" y="27" width="67.5" height="1.2"/>
            <rect className="truck-frame" x="4" y="28.2" width="42" height="1.5"/>
            <rect className="truck-frame" x="4.4" y="26.2" width="2.8" height="0.9" rx="0.2"/>
            <rect className="truck-frame" x="61.8" y="26.2" width="2.8" height="0.9" rx="0.2"/>
            <rect className="truck-light-red" x="0.6" y="26.2" width="1" height="2.4" rx="0.4"/>
            <rect className="truck-frame" x="2.6" y="29.5" width="0.8" height="2"/>
            <rect className="truck-frame" x="0.8" y="31" width="2.6" height="1.1" rx="0.4"/>
            <rect className="truck-frame" x="28" y="31.2" width="15" height="0.8"/>
            <rect className="truck-frame" x="28" y="33.6" width="15" height="0.8"/>
            <rect className="truck-frame" x="28" y="29.7" width="0.7" height="4.7"/>
            <rect className="truck-frame" x="42.3" y="29.7" width="0.7" height="4.7"/>
            <rect className="truck-frame" x="35.6" y="29.7" width="1.5" height="5.6"/>
            <g className="trailer-leg">
                <rect className="truck-frame" x="35.9" y="31" width="0.9" height="4.3"/>
                <rect className="truck-frame" x="33.6" y="35" width="5.5" height="0.9" rx="0.3"/>
            </g>
            <rect className="truck-frame" x="9" y="34.4" width="12" height="1.2"/>
            <rect className="truck-frame" x="13.4" y="29.7" width="3.2" height="5.2" rx="0.4"/>
            <path className="truck-guard" d="M3 35A6 6 0 0 1 15 35A6 6 0 0 1 27 35"/>
            <rect className="truck-frame" x="2.4" y="29.7" width="1.1" height="7.4" rx="0.3"/>
        </>
    );
}

// The tractor without its wheels: Volvo F12 style cab-over cab, frame, tank, fenders, exhaust stack.
export function TractorBody() {
    return (
        <>
            <rect className="truck-frame" x="44" y="29.3" width="38" height="2.3"/>
            <rect className="truck-stack" x="49" y="28.2" width="12.5" height="1.2" rx="0.3"/>
            <rect className="truck-tank" x="62" y="31.6" width="10" height="5.2" rx="2.3"/>
            <path className="truck-strap" d="M65 31.6v5.2M69 31.6v5.2"/>
            <rect className="truck-frame" x="73.2" y="31.6" width="5.4" height="3.9" rx="0.5"/>
            <path className="truck-fender" d="M48.1 35.2A6.4 6.4 0 0 1 60.9 35.2H59.8A5.3 5.3 0 0 0 49.2 35.2z"/>
            <rect className="truck-fender" x="47" y="30.6" width="1.2" height="6.8" rx="0.3"/>
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
        </>
    );
}
