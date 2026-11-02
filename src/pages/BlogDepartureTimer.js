import React from "react";
import {Link} from "react-router-dom";
import Seo, {PERSON, SITE_URL} from "../components/Seo";
import toolbarImg from "../images/departure_timer_toolbar.png";
import popupImg from "../images/departure_timer_popup.png";
import profileImg from "../images/departure_timer_profile.png";

const POST_PATH = '/blogs/departure-timer';
const POST_URL = `${SITE_URL}${POST_PATH}`;
const POST_TITLE = 'Departure Timer: a Chrome Extension That Tells You When to Leave for Your Train';
const REPO_URL = 'https://github.com/kamioon/departure-countdown-chrome';

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

const ic = {
    background: 'rgba(0,0,0,0.1)',
    padding: '0.1em 0.4em',
    borderRadius: '3px',
    fontSize: '0.88em',
    fontFamily: '"Courier New", Courier, monospace',
};

const shot = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '6px',
    border: '1px solid rgba(0,0,0,0.12)',
};

const caption = {fontSize: '0.82em', color: '#555', margin: '0.4em 0 1.2em', textAlign: 'center'};

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

class BlogDepartureTimer extends React.Component {
    render() {
        return (
            <div id="blog" className="blog">
                <Seo
                    title={POST_TITLE}
                    description="Departure Timer is a free, open source Chrome extension for Dutch train commuters. It shows how many minutes are left before you must leave, using the NS API."
                    path={POST_PATH}
                    type="article"
                    jsonLd={{
                        "@type": "TechArticle",
                        "headline": POST_TITLE,
                        "description": "A free, open source Chrome extension that shows how many minutes are left before you must leave for your next NS train.",
                        "image": SITE_URL + popupImg,
                        "author": PERSON,
                        "datePublished": "2026-11-02",
                        "dateModified": "2026-11-02",
                        "mainEntityOfPage": POST_URL,
                        "keywords": "Chrome extension, NS API, train departure, Manifest V3, open source",
                        "about": {"@type": "SoftwareApplication", "name": "Departure Timer", "applicationCategory": "BrowserApplication"}
                    }}
                >
                    <meta name="keywords" content="Chrome extension, Departure Timer, NS API, NS train, train departure, when to leave, Manifest V3, open source, Dutch trains"/>
                    <meta property="article:published_time" content="2026-11-02"/>
                </Seo>

                <h1>Departure Timer: a Chrome Extension for When to Leave</h1>
                <p><small>November 2, 2026 &nbsp;·&nbsp; Kamran Azari &nbsp;·&nbsp; <em>Chrome extension · NS API · Open source</em></small></p>

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

                <p>
                    Train apps show you when the train leaves. But what I really want to know is when I need to
                    leave home. This Chrome extension does that for me. It shows the minutes left on the toolbar
                    icon, so I don't need to open anything.
                </p>

                <img
                    src={toolbarImg}
                    alt="Chrome toolbar icon showing the minutes left before you must leave, red when it is 5 minutes or less"
                    style={{...shot, width: '520px'}}
                />
                <p style={caption}>The icon shows the minutes until you must leave. It turns red at 5 minutes or less.</p>

                <h2>Before the ESP32 one</h2>
                <p>
                    This extension is older than the <Link to="/blogs/departure-countdown">ESP32 departure countdown</Link>.
                    I made it first, for myself. After some updates I decided to make it public and open source,
                    so now everyone can use it.
                </p>

                <h2>How it works</h2>
                <p>
                    You make a profile. A profile is the station you leave from and the minutes you need to get
                    there. Walking, cycling, driving or public transit. A destination is optional.
                </p>
                <p>
                    The extension asks the NS API for the next trains and takes the departure time minus your
                    travel time. That is the time you must leave.
                </p>
                <ul>
                    <li>A background worker checks the NS API every minute and draws the number on the toolbar icon.</li>
                    <li>The popup counts down every second by itself, so it doesn't call the API all the time.</li>
                    <li>If the train is late, your leave time moves too. (The ESP32 one uses the planned time, this one uses the real time.)</li>
                    <li>Without a destination you see all departures from the station. With one, it uses the NS trips API, so you also see transfers and the arrival time.</li>
                    <li>Trains you can't catch anymore are hidden.</li>
                </ul>

                <img
                    src={popupImg}
                    alt="Departure Timer popup with the time to leave, the time until the train departs and the next departures"
                    style={{...shot, width: '280px'}}
                />
                <p style={caption}>
                    The popup has two countdowns: time to leave and time until the train departs.
                    Under that are the next five departures with platform and delay.
                </p>

                <h2>Features</h2>
                <ul>
                    <li>Minutes left on the toolbar icon, red at 5 minutes or less</li>
                    <li>Popup with the next 5 departures, platform and delay</li>
                    <li>The leave countdown turns red when less than 2 minutes are left</li>
                    <li>One tab per profile, for example Home, Work or Gym</li>
                    <li>Notification when it's time to leave (once per 10 minutes at most)</li>
                    <li>Transfers and arrival time when you set a destination</li>
                    <li>Settings follow you to other devices with Chrome sync</li>
                    <li>No analytics, no tracking</li>
                </ul>

                <h2>Options</h2>
                <table style={tbl}>
                    <thead>
                        <tr>
                            <th style={th}>Option</th>
                            <th style={th}>What it does</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={td}>Data source</td>
                            <td style={td}>NS API (direct) with your own key, or your own personal hub</td>
                        </tr>
                        <tr>
                            <td style={td}>Profiles</td>
                            <td style={td}>Name, station, destination, how you travel and minutes to the station. Station names autocomplete, and there is a button to check the travel time on Google Maps</td>
                        </tr>
                        <tr>
                            <td style={td}>Intercity only</td>
                            <td style={td}>Hide the Sprinters</td>
                        </tr>
                        <tr>
                            <td style={td}>Notifications</td>
                            <td style={td}>Turn the "time to leave" notification on or off</td>
                        </tr>
                        <tr>
                            <td style={td}>Use my location</td>
                            <td style={td}>Opens the profile nearest to you. The location is never saved</td>
                        </tr>
                        <tr>
                            <td style={td}>Sync API key</td>
                            <td style={td}>Untick it to keep the key on this device only</td>
                        </tr>
                    </tbody>
                </table>

                <img
                    src={profileImg}
                    alt="Profile editor with station, destination and travel time"
                    style={{...shot, width: '250px'}}
                />
                <p style={caption}>Editing a profile.</p>

                <h3>Direct NS or personal hub</h3>
                <p>
                    <strong>Direct NS</strong> is the easy way. Get a free key on
                    the <a href="https://apiportal.ns.nl/" target="_blank" rel="noreferrer">NS API portal</a> (subscribe
                    to the Reisinformatie API), paste it in the settings and press <span style={ic}>Test key</span>.
                    The key stays in your browser.
                </p>
                <p>
                    <strong>Personal hub</strong> is for when you run your own server. The hub calls NS once and gives
                    the result to all your devices. The extension only needs the hub URL and a token. Chrome asks
                    for permission to reach the hub when you press Save.
                </p>

                <h2>Install</h2>
                <p>
                    For now you install it from the source. There is no build step.
                </p>
                <ol>
                    <li>Download the code from <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>.</li>
                    <li>Open <span style={ic}>chrome://extensions</span> and turn on Developer mode.</li>
                    <li>Click Load unpacked and select the folder.</li>
                    <li>Open the extension's Options, add your NS key and a profile.</li>
                </ol>
                <p>
                    It's plain JavaScript (Manifest V3) and needs Chrome 99 or newer. It's not affiliated with NS,
                    so please follow the NS API terms of use.
                </p>

                <a href={REPO_URL} target="_blank" rel="noreferrer" style={ghCard}>
                    <GhIcon />
                    <div style={{flex: 1}}>
                        <div style={{fontWeight: 'bold', fontSize: '0.95em'}}>kamioon / departure-countdown-chrome</div>
                        <div style={{fontSize: '0.82em', color: '#8b949e', marginTop: '0.25em'}}>
                            Source code · install steps · issues are welcome
                        </div>
                        <div style={{fontSize: '0.78em', color: '#6e7681', marginTop: '0.3em'}}>
                            Chrome extension &nbsp;·&nbsp; Manifest V3 &nbsp;·&nbsp; NS API &nbsp;·&nbsp; JavaScript &nbsp;·&nbsp; MIT
                        </div>
                    </div>
                    <span style={{fontSize: '0.82em', color: '#58a6ff', whiteSpace: 'nowrap'}}>View on GitHub →</span>
                </a>
            </div>
        );
    }
}

export default BlogDepartureTimer;
