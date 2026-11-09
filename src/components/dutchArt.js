// Dutch scenery for the About page's road scene (see RoadTrip.js): windmills, church towers, a TV tower, wind
// turbines, pylons, canal houses, tulip fields and poplars. Everything is drawn in the scene's world units, standing
// on y = EDGE (the far edge of the road) unless said otherwise, and coloured from CSS variables (see App.css) so it
// follows the time of day. Only plain shapes: SSR safe.

// The far edge of the road: everything in the landscape stands on it.
export const EDGE = 102;

// A smooth line of low hills from x to x, as a closed shape down to the bottom.
export function hillsPath(from, to, base, amp, phase) {
    const pts = [];
    for (let x = from; x <= to; x += 24) {
        const y = base - amp * (0.55 + 0.3 * Math.sin(x / 150 + phase) + 0.15 * Math.sin(x / 61 + phase * 2));
        pts.push([x, y]);
    }
    let d = `M${from} ${base + 80}L${pts[0][0]} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2;
        const my = (pts[i][1] + pts[i + 1][1]) / 2;
        d += `Q${pts[i][0]} ${pts[i][1].toFixed(1)} ${mx} ${my.toFixed(1)}`;
    }
    return `${d}L${to} ${base + 80}z`;
}

// A traditional windmill with turning sails.
export function Windmill({x, y = EDGE, s = 1}) {
    return (
        <g transform={`translate(${x} ${y}) scale(${s})`}>
            <path className="rt-mill-body" d="M-10 0L-6.5 -36H6.5L10 0z"/>
            <path className="rt-mill-body" d="M-8 -36L0 -47L8 -36z"/>
            <rect className="rt-mill-dark" x="-7.6" y="-20" width="15.2" height="1.3"/>
            <rect className="rt-mill-dark" x="-2.2" y="-9" width="4.4" height="9" rx="2.2"/>
            <g transform="translate(0 -39) scale(0.5)">
                <g className="rt-blades">
                    <rect x="-1.2" y="-38" width="2.4" height="76"/>
                    <rect x="-38" y="-1.2" width="76" height="2.4"/>
                    <rect className="rt-sail" x="1.2" y="-38" width="6.8" height="20"/>
                    <rect className="rt-sail" x="-8" y="18" width="6.8" height="20"/>
                    <rect className="rt-sail" x="18" y="1.2" width="20" height="6.8"/>
                    <rect className="rt-sail" x="-38" y="-8" width="20" height="6.8"/>
                </g>
            </g>
            <circle className="rt-mill-dark" cx="0" cy="-39" r="2"/>
        </g>
    );
}

// A big brick church tower with an open lantern and a needle spire (a Dom Tower sort of silhouette).
export function ChurchTower({x, y = EDGE, s = 1}) {
    return (
        <g transform={`translate(${x} ${y}) scale(${s})`}>
            <rect className="rt-tower-brick" x="-8" y="-72" width="16" height="72"/>
            <rect className="rt-tower-stone" x="-9.4" y="-75" width="18.8" height="3.4"/>
            <rect className="rt-tower-dark" x="-3.4" y="-56" width="6.8" height="16" rx="3.4"/>
            <rect className="rt-tower-dark" x="-3.4" y="-30" width="6.8" height="12" rx="3.4"/>
            <rect className="rt-tower-brick" x="-6.2" y="-100" width="12.4" height="26"/>
            <rect className="rt-tower-dark" x="-3.4" y="-96" width="6.8" height="16" rx="3.4"/>
            <rect className="rt-tower-stone" x="-7.6" y="-102.6" width="15.2" height="3"/>
            <rect className="rt-tower-stone" x="-4.8" y="-122" width="9.6" height="20"/>
            <rect className="rt-tower-dark" x="-2.4" y="-118" width="4.8" height="12" rx="2.4"/>
            <path className="rt-spire" d="M-5.6 -122L0 -152L5.6 -122z"/>
            <circle className="rt-spire" cx="0" cy="-153" r="1.4"/>
            <path className="rt-spire" d="M-9.4 -75L-7.6 -83L-5.8 -75zM5.8 -75L7.6 -83L9.4 -75z"/>
        </g>
    );
}

// A slender TV tower with a saucer-shaped viewing deck (Euromast style).
export function Euromast({x, y = EDGE, s = 1}) {
    return (
        <g transform={`translate(${x} ${y}) scale(${s})`}>
            <rect className="rt-concrete" x="-2.4" y="-100" width="4.8" height="100"/>
            <ellipse className="rt-concrete" cx="0" cy="-100" rx="13" ry="3.2"/>
            <ellipse className="rt-concrete rt-concrete-dark" cx="0" cy="-107" rx="8.4" ry="6"/>
            <rect className="rt-tower-dark" x="-7.4" y="-109" width="14.8" height="2.6" rx="1"/>
            <rect className="rt-concrete" x="-0.9" y="-146" width="1.8" height="38"/>
            <rect className="rt-mast-red" x="-0.9" y="-146" width="1.8" height="7"/>
            <rect className="rt-mast-red" x="-0.9" y="-132" width="1.8" height="7"/>
            <rect className="rt-mast-red" x="-0.9" y="-118" width="1.8" height="7"/>
        </g>
    );
}

// A modern three-blade wind turbine; the rotor turns slowly.
export function Turbine({x, y = EDGE, s = 1, delay = 0}) {
    return (
        <g transform={`translate(${x} ${y}) scale(${s})`}>
            <path className="rt-turbine" d="M-1.5 0L-0.8 -62H0.8L1.5 0z"/>
            <rect className="rt-turbine" x="-1.8" y="-65" width="5" height="3.4" rx="1"/>
            <g transform="translate(0 -63.4)">
                <g className="rt-rotor" style={{animationDelay: `${delay}s`}}>
                    <circle r="31" fill="none"/>
                    <path className="rt-turbine" d="M-1 0L-0.5 -30L0.5 -30L1 0zM-1 0L-0.5 -30L0.5 -30L1 0z"/>
                    <path className="rt-turbine" transform="rotate(120)" d="M-1 0L-0.5 -30L0.5 -30L1 0z"/>
                    <path className="rt-turbine" transform="rotate(240)" d="M-1 0L-0.5 -30L0.5 -30L1 0z"/>
                    <circle className="rt-turbine" r="1.8"/>
                </g>
            </g>
        </g>
    );
}

// A high-voltage pylon.
export function Pylon({x, y = EDGE, s = 1}) {
    return (
        <g className="rt-pylon" transform={`translate(${x} ${y}) scale(${s})`}>
            <path d="M-9 0L-2 -52M9 0L2 -52M-2 -52L2 -52M-5.5 -26H5.5M-7 -12H7M-9 0L5.5 -26M9 0L-5.5 -26M-5.5 -26L2 -52M5.5 -26L-2 -52M-15 -43H15M-11 -52H11M0 -52V-58"/>
            <path d="M-15 -43V-40M15 -43V-40M-11 -52V-49M11 -52V-49"/>
        </g>
    );
}

// A tall slender poplar.
export function Poplar({x, y = EDGE, s = 1}) {
    return (
        <g transform={`translate(${x} ${y}) scale(${s})`}>
            <rect className="rt-trunk" x="-0.7" y="-6" width="1.4" height="6"/>
            <ellipse className="rt-foliage" cx="0" cy="-17" rx="3.4" ry="12"/>
        </g>
    );
}

// A row of narrow Amsterdam style canal houses with different gables, standing on a quay above the canal.
const HOUSES = [
    {w: 12, h: 36, c: 1, g: 'step'}, {w: 11, h: 42, c: 2, g: 'bell'}, {w: 13, h: 34, c: 3, g: 'point'},
    {w: 11, h: 40, c: 4, g: 'step'}, {w: 12, h: 37, c: 5, g: 'bell'}, {w: 13, h: 43, c: 2, g: 'step'},
    {w: 11, h: 35, c: 1, g: 'point'}, {w: 12, h: 39, c: 3, g: 'bell'},
];

function gable(w, h, kind) {
    if (kind === 'step') {
        const u = w / 5;
        return `M0 ${-h}V${-h - 3}H${u}V${-h - 6}H${2 * u}V${-h - 9}H${3 * u}V${-h - 6}H${4 * u}V${-h - 3}H${w}V${-h}z`;
    }
    if (kind === 'bell') {
        return `M0 ${-h}Q0 ${-h - 4} ${w * 0.3} ${-h - 5}Q${w * 0.5} ${-h - 10} ${w * 0.7} ${-h - 5}Q${w} ${-h - 4} ${w} ${-h}z`;
    }
    return `M0 ${-h}L${w / 2} ${-h - 9}L${w} ${-h}z`;
}

export function CanalHouses({x, y = EDGE - 6, count = HOUSES.length, from = 0}) {
    const items = [];
    let at = 0;
    for (let i = 0; i < count; i++) {
        const {w, h, c, g} = HOUSES[(from + i) % HOUSES.length];
        const rows = Math.floor((h - 8) / 9);
        const windows = [];
        for (let r = 0; r < rows; r++) {
            windows.push(<rect key={`a${r}`} className="rt-hwin" x={w * 0.18} y={-h + 6 + r * 9} width={w * 0.24} height="5"/>);
            windows.push(<rect key={`b${r}`} className="rt-hwin" x={w * 0.58} y={-h + 6 + r * 9} width={w * 0.24} height="5"/>);
        }
        items.push(
            <g key={i} transform={`translate(${at} 0)`}>
                <rect className={`rt-house rt-h${c}`} width={w} height={h}  y={-h}/>
                <path className={`rt-house rt-h${c}`} d={gable(w, h, g)}/>
                {windows}
                <rect className="rt-hdoor" x={w * 0.38} y="-7" width={w * 0.24} height="7"/>
            </g>
        );
        at += w + 0.6;
    }
    return <g transform={`translate(${x} ${y})`}>{items}</g>;
}

// A canal: a band of water with a few ripples.
export function Canal({x, width, y = EDGE - 6, height = 6}) {
    let ripples = '';
    for (let i = 8; i < width - 8; i += 22) ripples += `M${x + i} ${y + 2.2}h8M${x + i + 9} ${y + 4.2}h6`;
    return (
        <g>
            <rect className="rt-water" x={x} y={y} width={width} height={height}/>
            <path className="rt-ripple" d={ripples}/>
        </g>
    );
}

// A tulip field seen from the road: bands of colour, one behind the other, with the texture of the flower rows.
const TULIPS = ['rt-tulip-yellow', 'rt-tulip-red', 'rt-tulip-pink', 'rt-tulip-purple', 'rt-tulip-orange'];

export function TulipField({x, width, y = EDGE - 14, offset = 0}) {
    return (
        <g>
            {TULIPS.map((_, i) => {
                const cls = TULIPS[(i + offset) % TULIPS.length];
                const top = y + i * 2.8;
                return (
                    <g key={i}>
                        <rect className={cls} x={x} y={top} width={width} height="2.8"/>
                        <path className="rt-rows" d={`M${x} ${top + 1.4}h${width}`}/>
                    </g>
                );
            })}
            <rect className="rt-leaf" x={x} y={y + 14} width={width} height="0.8"/>
        </g>
    );
}

// ---------------------------------------------------------------------------------------------------------------
// A different road through the Netherlands for every trip: landmarks far apart, never two of a kind in a row.
// Seeded, so the same seed (the one the server renders with) always gives the same picture.
function mulberry32(seed) {
    let a = seed | 0;
    return () => {
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const round = value => Math.round(value * 10) / 10;

// x positions: `world` is the roadside (it moves with the road); `near` and `mid` are layers that move slower
// (see RoadTrip.js), so their positions are in that layer's own coordinates.
export function makeTrip(seed) {
    const r = mulberry32(seed);
    const between = (a, b) => round(a + (b - a) * r());
    const whole = (a, b) => Math.floor(a + (b - a + 1) * r());
    const world = [];
    const mid = [];
    const near = [];

    // The roadside: a landmark every 260 to 520 units.
    let x = between(520, 720);
    let previous = '';
    while (x < 3000) {
        let kind;
        do {
            const roll = r();
            kind = roll < 0.3 ? 'houses' : roll < 0.6 ? 'tulips' : roll < 0.8 ? 'windmill' : 'poplars';
        } while (kind === previous);
        previous = kind;
        if (kind === 'houses') {
            const count = whole(4, 8);
            world.push({t: 'houses', x, count, from: whole(0, 7)});
            x += count * 12.6 + 10;
        } else if (kind === 'tulips') {
            for (let i = whole(2, 3); i > 0; i--) {
                const width = between(80, 150);
                world.push({t: 'tulips', x: round(x), width, offset: whole(0, 4)});
                x += width + between(12, 30);
            }
        } else if (kind === 'windmill') {
            world.push({t: 'windmill', x: round(x), s: between(1.05, 1.35)});
            x += 30;
        } else {
            for (let i = whole(2, 4); i > 0; i--) {
                world.push({t: 'poplar', x: round(x), s: between(0.95, 1.2)});
                x += between(10, 16);
            }
        }
        x += between(260, 520);
    }

    // Far away: wind turbines every 120 to 300 units, one TV tower, a pylon or two.
    const mast = between(560, 1100);
    for (let p = between(440, 560); p < 1500; p += between(120, 300)) {
        if (Math.abs(p - mast) > 40) mid.push({t: 'turbine', x: round(p), s: between(0.85, 1.15), delay: -between(0, 9)});
    }
    mid.push({t: 'euromast', x: mast, s: between(1.1, 1.3)});
    for (let i = whole(1, 2); i > 0; i--) mid.push({t: 'pylon', x: between(450, 1300), s: 1});

    // Nearer: church towers and windmills, hundreds of units apart.
    let q = between(480, 700);
    while (q < 2200) {
        near.push(r() < 0.5 ? {t: 'church', x: round(q), s: between(0.8, 1)} : {t: 'windmill', x: round(q), s: between(0.95, 1.15)});
        q += between(380, 700);
    }
    return {world, mid, near};
}
