import React from "react";
import {Helmet} from "react-helmet";
import departureCountdownImg from "../images/departure_countdown.jpg";

const pre = {
    background: '#1a1a1a',
    color: '#e2e8f0',
    padding: '1em 1.2em',
    borderRadius: '6px',
    fontSize: '0.78em',
    overflowX: 'auto',
    margin: '1em 0',
    lineHeight: '1.65',
    fontFamily: '"Courier New", Courier, monospace',
    whiteSpace: 'pre',
};

const ic = {
    background: 'rgba(0,0,0,0.1)',
    padding: '0.1em 0.4em',
    borderRadius: '3px',
    fontSize: '0.88em',
    fontFamily: '"Courier New", Courier, monospace',
};

const tbl = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.84em',
    margin: '0.8em 0 1.2em',
};

const th = {
    background: 'rgba(0,0,0,0.12)',
    padding: '0.45em 0.7em',
    textAlign: 'left',
    borderBottom: '2px solid rgba(0,0,0,0.15)',
};

const td = {
    padding: '0.35em 0.7em',
    borderBottom: '1px solid rgba(0,0,0,0.07)',
    verticalAlign: 'top',
};

const ghCard = {
    display: 'flex',
    alignItems: 'center',
    gap: '1em',
    background: '#0d1117',
    color: '#e6edf3',
    borderRadius: '8px',
    padding: '1.1em 1.4em',
    margin: '1.5em 0 0.5em',
    textDecoration: 'none',
    border: '1px solid #30363d',
};

const GhIcon = () => (
    <svg height="28" width="28" viewBox="0 0 16 16" style={{fill: '#e6edf3', flexShrink: 0}}>
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
);

const shareBtn = (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3em',
    padding: '0.3em 0.75em',
    borderRadius: '4px',
    fontSize: '0.8em',
    fontWeight: '600',
    color: '#fff',
    background: color,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
});

const POST_URL = 'https://kamran.azari.info/blogs/departure-countdown';
const POST_TITLE = 'Building a Smart Train Departure Countdown Display with ESP32';

const YtIcon = () => (
    <svg height="16" width="16" viewBox="0 0 24 24" style={{fill: 'currentColor', flexShrink: 0}}>
        <path d="M23.5 6.2a3.01 3.01 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3.01 3.01 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.01 3.01 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3.01 3.01 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
    </svg>
);

const GhFileLink = ({path, label}) => (
    <a href={`https://github.com/kamioon/departure-countdown/blob/main/${path}`}
       target="_blank" rel="noreferrer"
       style={{fontSize: '0.82em', marginLeft: '0.6em', opacity: 0.7, display: 'inline-flex', alignItems: 'center', gap: '0.25em', verticalAlign: 'middle'}}>
        <GhIcon /> {label || path}
    </a>
);

class BlogDepartureCountdown extends React.Component {
    render() {
        return (
            <div id="blog" className="blog">
                <Helmet>
                    <title>Building a Smart Train Departure Countdown Display with ESP32</title>
                    <meta name="description" content="How I built a wall-mounted MAX7219 LED display on an ESP32-S3 that counts down to when you need to leave home — not when the train departs — using the NS Dutch Railways API, FreeRTOS, and a local web UI." />
                    <meta name="keywords" content="ESP32, ESP32-S3, IoT, train departure countdown, NS API, MAX7219, dot matrix display, FreeRTOS, smart home, Home Assistant, DIY electronics, PlatformIO, embedded C++"/>
                    <meta property="og:title" content="Building a Smart Train Departure Countdown Display with ESP32"/>
                    <meta property="og:description" content="A wall-mounted LED display that counts down to when you need to leave — not when the train departs. Built on ESP32-S3 with FreeRTOS, NS API, and a local web UI."/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:url" content="https://kamran.azari.info/blogs/departure-countdown"/>
                    <meta property="og:image" content="https://kamran.azari.info/departure-countdown-preview.jpg"/>
                    <meta property="og:image:width" content="1200"/>
                    <meta property="og:image:height" content="630"/>
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta name="twitter:title" content="Building a Smart Train Departure Countdown Display with ESP32"/>
                    <meta name="twitter:description" content="A wall-mounted LED display that counts down to when you need to leave — not when the train departs. Built on ESP32-S3 with FreeRTOS and the NS Railways API."/>
                    <meta name="twitter:image" content="https://kamran.azari.info/departure-countdown-preview.jpg"/>
                    <script type="application/ld+json">{JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TechArticle",
                        "headline": "Building a Smart Train Departure Countdown Display with ESP32",
                        "description": "How I built a wall-mounted MAX7219 LED display on an ESP32-S3 that counts down to when you need to leave home — not when the train departs.",
                        "author": {"@type": "Person", "name": "Kamran Azari", "url": "https://kamran.azari.info"},
                        "datePublished": "2025-05-05",
                        "url": "https://kamran.azari.info/blogs/departure-countdown",
                        "keywords": "ESP32, IoT, NS API, MAX7219, FreeRTOS, train departure",
                        "about": {"@type": "Thing", "name": "IoT embedded systems"}
                    })}</script>
                </Helmet>

                <h1>Building a Smart Train Departure Countdown Display</h1>
                <p><small>May 5, 2025 &nbsp;·&nbsp; Kamran Azari &nbsp;·&nbsp; <em>ESP32 · FreeRTOS · IoT · C++</em></small></p>

                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5em', alignItems: 'center', margin: '0.5em 0 1.2em'}}>
                    <span style={{fontSize: '0.8em', color: '#666'}}>Share:</span>
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(POST_URL)}&text=${encodeURIComponent(POST_TITLE)}`}
                       target="_blank" rel="noreferrer" style={shareBtn('#000')}>
                        𝕏 Twitter / X
                    </a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(POST_URL)}`}
                       target="_blank" rel="noreferrer" style={shareBtn('#0077b5')}>
                        in LinkedIn
                    </a>
                    <button
                        style={shareBtn('#555')}
                        onClick={() => navigator.clipboard.writeText(POST_URL).then(() => alert('Link copied!'))}>
                        🔗 Copy link
                    </button>
                </div>

                <img
                    className="img-responsive"
                    src={departureCountdownImg}
                    alt="ESP32-S3 MAX7219 dot-matrix train departure countdown display mounted on a wall"
                    style={{borderRadius: '6px', margin: '0 0 1em'}}
                />

                <h2>Watch the Demo</h2>
                <div style={{position: 'relative', paddingTop: '56.25%', margin: '0.5em 0 0.5em', borderRadius: '8px', overflow: 'hidden', background: '#000'}}>
                    <iframe
                        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}}
                        src="https://www.youtube.com/embed/lqUtC60OAP4"
                        title="Smart Departure Countdown — Live Demo"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
                <p style={{fontSize: '0.82em', color: '#555', margin: '0.4em 0 1.4em'}}>
                    <YtIcon /> More projects on my{' '}
                    <a href="https://www.youtube.com/channel/UCUJoYBU1p5cJ3LYZFPSrjpQ" target="_blank" rel="noreferrer">YouTube channel</a>.
                </p>

                <h2>The Problem: Mental Math Every Morning</h2>
                <p>
                    Your train leaves at 08:14. The station is a 9-minute walk. You need a minute to lock the door.
                    So you should leave at 08:04. But you haven't finished your coffee. And is the bike outside today?
                    That's 4 minutes — so maybe 08:09.
                </p>
                <p>
                    This small calculation runs in the background of every commuter's brain, every single morning.
                    It's not hard, but it's a constant low-grade tax on your attention. Miss the window by 30 seconds
                    and you're jogging. Leave too early and you stand in the cold.
                </p>
                <p>
                    I wanted to solve it with one glance at the wall.
                </p>

                <h2>The Idea: Count Down to When You Leave, Not When the Train Departs</h2>
                <p>
                    Every train app already shows you departure times. What none of them do is answer the actual
                    question: <em>when do I put on my coat?</em>
                </p>
                <p>
                    This device answers exactly that. The display shows a live <span style={ic}>MM:SS</span> countdown
                    to the moment you need to walk out the door — already accounting for the distance to the station.
                    When it hits zero, you leave. No mental math required.
                </p>

                <h2>Hardware Overview</h2>

                <h3>Bill of Materials</h3>

                <p><strong>Required</strong></p>
                <table style={tbl}>
                    <thead>
                        <tr>
                            <th style={th}>Component</th>
                            <th style={th}>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={td}>ESP32-S3-DevKitC-1</td>
                            <td style={td}>Dual-core 240 MHz, 8 MB flash, built-in WiFi</td>
                        </tr>
                        <tr>
                            <td style={td}>2× MAX7219 FC-16 modules</td>
                            <td style={td}>Chained together → 64×8 pixel dot-matrix display</td>
                        </tr>
                        <tr>
                            <td style={td}>5V / 3A USB power supply</td>
                            <td style={td}>The display draws up to 2 A at full brightness</td>
                        </tr>
                        <tr>
                            <td style={td}>1000 µF / 16V capacitor</td>
                            <td style={td}>Place on 5V rail close to the first module</td>
                        </tr>
                    </tbody>
                </table>

                <p><strong>Optional</strong></p>
                <table style={tbl}>
                    <thead>
                        <tr>
                            <th style={th}>Component</th>
                            <th style={th}>Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={td}>DS3231 RTC module</td>
                            <td style={td}>Time continuity during WiFi outages</td>
                        </tr>
                        <tr>
                            <td style={td}>Passive buzzer</td>
                            <td style={td}>Audio alerts (configurable, off by default)</td>
                        </tr>
                        <tr>
                            <td style={td}>RGB LED (common cathode) + 3× 220 Ω</td>
                            <td style={td}>Visual urgency indicator</td>
                        </tr>
                        <tr>
                            <td style={td}>Rotary encoder + button</td>
                            <td style={td}>Physical transport mode selection</td>
                        </tr>
                        <tr>
                            <td style={td}>3× momentary push buttons</td>
                            <td style={td}>Refresh, mode switch, factory reset</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Wiring (Key Connections)</h3>
                <pre style={pre}>{`MAX7219 Display  →  ESP32-S3
  DIN (MOSI)     →  GPIO 11
  CLK (SCK)      →  GPIO 12
  CS  (LOAD)     →  GPIO 10
  VCC            →  5V   (separate rail — NOT 3.3V)
  GND            →  GND

DS3231 RTC (I²C, optional)
  SDA            →  GPIO 1
  SCL            →  GPIO 2

RGB LED (common cathode)
  Red            →  GPIO 18 + 220 Ω
  Green          →  GPIO 8  + 220 Ω
  Blue           →  GPIO 3  + 220 Ω

Buzzer (PWM)     →  GPIO 17
Buttons          →  GPIO 7 / 15 / 16  (to GND, internal pull-up)`}</pre>

                <p>
                    The MAX7219 chain runs on 5V. Keep the power traces short and put the 1000 µF cap as close
                    as possible to the first module — display glitches are almost always a power supply issue.
                </p>

                <h2>System Architecture</h2>
                <p>
                    The diagram below shows how the main components interact. The ESP32 runs two concurrent
                    FreeRTOS tasks; a binary semaphore ensures the display never reads corrupt data during an API fetch.
                </p>

                <svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg"
                    style={{width: '100%', margin: '0.8em 0 1.2em', display: 'block'}}>
                    <defs>
                        <marker id="ah" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="#555"/>
                        </marker>
                        <marker id="ah-dash" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="#999"/>
                        </marker>
                    </defs>

                    {/* NS API */}
                    <rect x="8" y="80" width="105" height="50" rx="5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"/>
                    <text x="60" y="101" textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#1e3a5f" fontWeight="bold">NS Railways</text>
                    <text x="60" y="118" textAnchor="middle" fontSize="10" fontFamily="sans-serif" fill="#1e3a5f">REST API</text>
                    <line x1="113" y1="105" x2="182" y2="105" stroke="#555" strokeWidth="1.5" markerEnd="url(#ah)"/>
                    <text x="148" y="99" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#555">HTTPS</text>

                    {/* RTC (optional) */}
                    <rect x="8" y="10" width="105" height="48" rx="5" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="1.5"/>
                    <text x="60" y="31" textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#4c1d95" fontWeight="bold">DS3231 RTC</text>
                    <text x="60" y="48" textAnchor="middle" fontSize="10" fontFamily="sans-serif" fill="#9333ea">(optional)</text>
                    <line x1="113" y1="34" x2="182" y2="70" stroke="#999" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#ah-dash)"/>
                    <text x="135" y="43" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#999">I²C</text>

                    {/* ESP32 center */}
                    <rect x="182" y="50" width="168" height="120" rx="6" fill="#c8102f" stroke="#8b000d" strokeWidth="2"/>
                    <text x="266" y="84" textAnchor="middle" fontSize="13" fontFamily="sans-serif" fill="white" fontWeight="bold">ESP32-S3</text>
                    <text x="266" y="102" textAnchor="middle" fontSize="10" fontFamily="sans-serif" fill="#fca5a5">FreeRTOS</text>
                    <line x1="200" y1="112" x2="332" y2="112" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
                    <text x="266" y="127" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#fca5a5">main task  ↔  fetch task</text>
                    <text x="266" y="142" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#fca5a5">binary semaphore sync</text>
                    <text x="266" y="157" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#fca5a5">NVS config · NTP · ArduinoJson</text>

                    {/* Arrow ESP32 → Display */}
                    <line x1="350" y1="75" x2="418" y2="45" stroke="#555" strokeWidth="1.5" markerEnd="url(#ah)"/>
                    <text x="392" y="52" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#555">SPI</text>

                    {/* Display */}
                    <rect x="418" y="8" width="115" height="52" rx="5" fill="#111" stroke="#444" strokeWidth="1.5"/>
                    <text x="475" y="31" textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#00ff41" fontWeight="bold">MAX7219</text>
                    <text x="475" y="47" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#00cc33">64×8 dot matrix</text>

                    {/* Arrow ESP32 → Web UI */}
                    <line x1="350" y1="110" x2="418" y2="110" stroke="#555" strokeWidth="1.5" markerEnd="url(#ah)"/>
                    <text x="386" y="104" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#555">WiFi</text>

                    {/* Web UI */}
                    <rect x="418" y="82" width="115" height="52" rx="5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5"/>
                    <text x="475" y="104" textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#1e3a5f" fontWeight="bold">Web UI</text>
                    <text x="475" y="120" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#1e3a5f">REST API :80</text>

                    {/* Arrow ESP32 → Alerts */}
                    <line x1="350" y1="145" x2="418" y2="165" stroke="#555" strokeWidth="1.5" markerEnd="url(#ah)"/>
                    <text x="393" y="162" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#555">GPIO</text>

                    {/* Alerts */}
                    <rect x="418" y="155" width="115" height="60" rx="5" fill="#fef9c3" stroke="#fbbf24" strokeWidth="1.5"/>
                    <text x="475" y="175" textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#78350f" fontWeight="bold">Alerts</text>
                    <text x="475" y="191" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#78350f">RGB LED (GPIO 3/8/18)</text>
                    <text x="475" y="206" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#78350f">Buzzer PWM (GPIO 17)</text>

                    {/* Buttons */}
                    <rect x="8" y="155" width="105" height="60" rx="5" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
                    <text x="60" y="175" textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#14532d" fontWeight="bold">Input</text>
                    <text x="60" y="191" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#14532d">3× buttons (GPIO 7/15/16)</text>
                    <text x="60" y="206" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#14532d">Rotary encoder (GPIO 4/5/6)</text>
                    <line x1="113" y1="185" x2="182" y2="152" stroke="#555" strokeWidth="1.5" markerEnd="url(#ah)"/>
                </svg>

                <h2>How the Countdown Works</h2>
                <p>
                    The device fetches the next departures from your station via the NS Reisinformatie API every
                    2 minutes. For each departure it calculates the time <em>you</em> need to leave:
                </p>
                <pre style={pre}>{`leave_time = departure_time - (travel_time + buffer_time) * 60`}</pre>
                <p>
                    If your station is a 9-minute walk and you set a 2-minute buffer, the display starts
                    counting down 11 minutes before the train leaves. When it hits <span style={ic}>00:00</span>,
                    that's your cue.
                </p>
                <p>
                    <GhFileLink path="src/countdown_calc.cpp" label="countdown_calc.cpp" />
                    <GhFileLink path="src/ns_api.cpp" label="ns_api.cpp" />
                </p>
                <p>
                    The API returns the <em>planned</em> departure time, not the real-time delay. That's intentional:
                    you plan your life around the schedule, not live delays. Delays are surfaced separately in the
                    departure data but don't affect when the device tells you to leave.
                </p>
                <p>
                    There's also a 30-second grace period: if a train departs within the next 30 seconds the
                    device doesn't immediately skip to the next one, preventing a jarring jump right when
                    you're deciding whether to sprint.
                </p>

                <h2>Walk vs Bike: Distance Is the Key Variable</h2>
                <p>
                    The single most important configuration parameter isn't the station code — it's how long
                    it takes you to get there. That number changes based on how you travel.
                </p>
                <p>
                    The display alternates every 5 seconds between <strong>Walk</strong> and <strong>Bike</strong> mode
                    (a Bus mode is also available). Each has its own independent travel time that you set once.
                    At a glance you can see both options and decide which applies today.
                </p>
                <p>
                    If the bike isn't available, the device gracefully shows only the walking countdown.
                    If neither mode has a catchable train, it waits and retries silently.
                </p>

                <h2>Why Display Size Actually Matters</h2>
                <p>
                    The most underrated design decision in this project is the display choice. A small LCD or
                    OLED is fine for a desk gadget you lean in to read. This is a <em>room display</em>.
                    The whole premise falls apart if you have to walk up to it.
                </p>
                <p>
                    Two chained MAX7219 FC-16 modules give 64×8 pixels total — a wide strip of large blocky
                    digits readable from several meters away, in daylight, without glasses.
                    No backlight glare, no color calibration, no viewing angle issues.
                    The dot-matrix aesthetic is purely practical.
                </p>

                <h2>The Non-Blocking Design Challenge</h2>
                <p>
                    Here's the embedded systems problem that took the most thought: an HTTPS round-trip to the
                    NS API takes 2–3 seconds (SSL handshake + JSON parsing). On a microcontroller,
                    doing that on the main thread freezes everything — the display stops ticking,
                    buttons stop responding. That's unacceptable.
                </p>
                <p>
                    The solution uses a FreeRTOS background task and a binary semaphore:
                </p>
                <pre style={pre}>{`// Main loop — runs every second
void loop() {
    if (xSemaphoreTake(nsMutex, 0) == pdTRUE) {
        // Got the mutex: read fresh departure data
        cacheWalk = nsApiClient.getNextDeparture(WALK, config.walkTime);
        cacheBike = nsApiClient.getNextDeparture(BIKE, config.bikeTime);
        xSemaphoreGive(nsMutex);
    }
    // Always update display — from cache if mutex was busy
    updateDisplay(cacheWalk, cacheBike);
}

// Background fetch task — created every 2 minutes
void fetchTaskFn(void *) {
    xSemaphoreTake(nsMutex, portMAX_DELAY);  // blocks main only during HTTPS
    nsApiClient.fetchDepartures(config.stationCode, 10);
    xSemaphoreGive(nsMutex);
    vTaskDelete(NULL);
}`}</pre>
                <p>
                    <GhFileLink path="src/main.cpp" label="main.cpp" />
                    <GhFileLink path="src/ns_api_fetch_esp32.cpp" label="ns_api_fetch_esp32.cpp" />
                </p>
                <p>
                    The mutex is held only during the actual HTTPS transaction. The main loop uses a
                    non-blocking <span style={ic}>xSemaphoreTake(..., 0)</span> — if the fetch is in progress,
                    it simply reuses the last cached timestamps and keeps the countdown ticking.
                    The display never blanks or freezes.
                </p>

                <h2>Urgency States and Alerts</h2>
                <p>
                    The device knows five urgency levels and the hardware responds accordingly:
                </p>

                <table style={tbl}>
                    <thead>
                        <tr>
                            <th style={th}>State</th>
                            <th style={th}>When</th>
                            <th style={th}>RGB LED</th>
                            <th style={th}>Display</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={td}><strong>Safe</strong></td>
                            <td style={td}>&gt; 10 min</td>
                            <td style={td}>🟢 Green</td>
                            <td style={td}>MM:SS, calm</td>
                        </tr>
                        <tr>
                            <td style={td}><strong>Ready</strong></td>
                            <td style={td}>5–10 min</td>
                            <td style={td}>🟡 Yellow</td>
                            <td style={td}>MM:SS</td>
                        </tr>
                        <tr>
                            <td style={td}><strong>Time to Go</strong></td>
                            <td style={td}>2–5 min</td>
                            <td style={td}>🟠 Orange</td>
                            <td style={td}>MM:SS + buzzer once</td>
                        </tr>
                        <tr>
                            <td style={td}><strong>Urgent</strong></td>
                            <td style={td}>&lt; 2 min</td>
                            <td style={td}>🔴 Red (blinking)</td>
                            <td style={td}>Animated icon + seconds</td>
                        </tr>
                        <tr>
                            <td style={td}><strong>Departed</strong></td>
                            <td style={td}>Passed</td>
                            <td style={td}>Off</td>
                            <td style={td}>Next train</td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    When the countdown drops below 60 seconds, the rightmost display module switches
                    from text to a walking or cycling icon (depending on the active mode). It's a visual
                    signal that standing around is no longer an option.
                </p>
                <p>
                    The buzzer plays distinct tone patterns for each alert type — a single long beep
                    at "time to go," two short beeps at urgent — and is disabled by default.
                    On power-on it always plays a triple beep regardless of settings, confirming the
                    hardware is alive.
                </p>

                <h2>Web UI and Configuration</h2>
                <p>
                    Everything is configured through a local web UI hosted directly on the device at
                    <span style={ic}> http://&lt;device-ip&gt;/</span>. No app, no account, no cloud.
                    The page auto-refreshes the live status every 2 seconds.
                </p>
                <p>
                    The UI shows both walk and bike countdowns live, WiFi signal strength, heap memory,
                    uptime, and a "Fetch Now" button to trigger an immediate refresh. Configuration options
                    include station code, all three travel times, buffer time, and alert preferences.
                    Credentials (API key, WiFi password) are masked and stored in the ESP32's NVS flash —
                    never in source code.
                </p>

                <h2>REST API for Smart Home Integration</h2>
                <p>
                    The device exposes a small REST API with CORS headers, making it straightforward to
                    integrate with Home Assistant, Node-RED, or any other automation platform.
                </p>
                <pre style={pre}>{`GET /api/status      → full system snapshot
GET /api/departures  → next walk + bike countdowns
GET /api/config      → current config (secrets masked)
POST /api/config     → update any config fields
POST /api/transport  → switch mode { "mode": "bike" }
POST /api/fetch      → trigger immediate data refresh`}</pre>
                <p>Example response from <span style={ic}>GET /api/departures</span>:</p>
                <pre style={pre}>{`{
  "fetchInProgress": false,
  "departures": [
    { "mode": "walk", "secondsUntilLeave": 312, "direction": "Den Haag Centraal" },
    { "mode": "bike", "secondsUntilLeave": 480, "direction": "Den Haag Centraal" }
  ]
}`}</pre>
                <p>
                    All API handlers read from a cached status struct that the main loop writes every second.
                    The async web server never touches the departure mutex directly — no risk of blocking
                    the display while serving a web request.
                </p>

                <h2>Unit Testing Without Hardware</h2>
                <p>
                    One pattern I'm proud of here: all the core logic — countdown calculation, state machine,
                    NS API parsing, configuration validation — is tested in a native desktop environment.
                    No ESP32 needed.
                </p>
                <pre style={pre}>{`pio test -e native          # run the full test suite on your Mac/Linux
pio test -e native -v       # verbose
pio test -e native -f test_countdown_calc  # single suite`}</pre>
                <p>
                    <GhFileLink path="test/test_countdown_calc/test_countdown_calc.cpp" label="test_countdown_calc.cpp" />
                    <GhFileLink path="test/test_ns_api/test_ns_api.cpp" label="test_ns_api.cpp" />
                    <GhFileLink path="platformio.ini" label="platformio.ini" />
                </p>
                <p>
                    Hardware-specific code (<span style={ic}>*_esp32.cpp</span>) is excluded from the native build via
                    PlatformIO's <span style={ic}>build_src_filter</span>. Stub implementations replace the display,
                    buzzer, buttons, and WiFi for the test environment. This means the business logic can be
                    iterated and tested fast, without flashing the device every time.
                </p>

                <h2>Full Feature List</h2>
                <ul>
                    <li>Live <strong>MM:SS countdown</strong> to when you need to leave (not when the train departs)</li>
                    <li>Separate <strong>Walk, Bike, and Bus</strong> modes with independent configurable travel times</li>
                    <li>Display <strong>alternates between modes</strong> every 5 seconds automatically</li>
                    <li>Fetches <strong>live NS Railways API</strong> data every 2 minutes in the background</li>
                    <li>Display <strong>never freezes</strong> during API calls — FreeRTOS mutex design</li>
                    <li>5-state urgency system: Safe → Ready → Time to Go → Urgent → Departed</li>
                    <li><strong>Animated icon</strong> on urgent mode (&lt;60 s) — walk or bike figure</li>
                    <li><strong>RGB LED</strong> urgency indicator (green → yellow → orange → red blinking)</li>
                    <li>Optional <strong>buzzer</strong> with distinct tone patterns per alert level</li>
                    <li>Local <strong>web UI</strong> — no app, no account, self-hosted on device</li>
                    <li><strong>REST API</strong> with CORS — ready for Home Assistant, Node-RED, shell scripts</li>
                    <li><strong>NTP time sync</strong> with Amsterdam DST handling (CET/CEST)</li>
                    <li>Optional <strong>DS3231 RTC</strong> fallback for accurate time during WiFi outages</li>
                    <li>All config <strong>persists across reboots</strong> via ESP32 NVS flash</li>
                    <li>Credentials stored securely in flash — <strong>never in source code</strong></li>
                    <li>Factory reset via long press or web UI</li>
                    <li>Physical <strong>mode cycling</strong> via button press</li>
                    <li><strong>Unit tests</strong> runnable on desktop with no hardware (PlatformIO native env)</li>
                    <li>Rotary encoder support for future UI navigation</li>
                </ul>

                <h2>What I Learned</h2>
                <p>
                    The hardest part wasn't the API integration or the display driver — it was the concurrency.
                    Getting the mutex pattern right so the display never shows stale or corrupted data while
                    an HTTPS fetch is in progress required a few iterations. The key insight was to cache
                    only primitive values (Unix timestamps, string copies) before releasing the mutex,
                    so the main loop can safely recalculate the countdown from those without holding the lock.
                </p>
                <p>
                    The other lesson: power supply matters more than you expect. Two MAX7219 modules at full
                    brightness pull close to 2 A. Without the 1000 µF cap on the 5V rail, the ESP32 would
                    reset when the display lit up. A €0.10 capacitor in the right place saved hours of debugging.
                </p>

                <a href="https://github.com/kamioon/departure-countdown" target="_blank" rel="noreferrer" style={ghCard}>
                    <GhIcon />
                    <div style={{flex: 1}}>
                        <div style={{fontWeight: 'bold', fontSize: '0.95em'}}>kamioon / departure-countdown</div>
                        <div style={{fontSize: '0.82em', color: '#8b949e', marginTop: '0.25em'}}>
                            Hardware wiring · firmware source · PlatformIO setup · unit tests · build instructions
                        </div>
                        <div style={{fontSize: '0.78em', color: '#6e7681', marginTop: '0.3em'}}>
                            ESP32-S3 &nbsp;·&nbsp; FreeRTOS &nbsp;·&nbsp; NS API &nbsp;·&nbsp; MAX7219 &nbsp;·&nbsp; C++ &nbsp;·&nbsp; CC BY-NC 4.0
                        </div>
                    </div>
                    <span style={{fontSize: '0.82em', color: '#58a6ff', whiteSpace: 'nowrap'}}>View on GitHub →</span>
                </a>
            </div>
        );
    }
}

export default BlogDepartureCountdown;
