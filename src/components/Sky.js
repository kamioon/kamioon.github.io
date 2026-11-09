// The sky behind every page: sun or moon, stars, clouds, a plane and some birds.
// The colours follow the time of day (see App.css).

const CLOUDS = [
    {top: 70, duration: 140, delay: -30},
    {top: 170, duration: 190, delay: -120, small: true},
    {top: 330, duration: 230, delay: -70, small: true},
    {top: 455, duration: 170, delay: -90},
    {top: 540, duration: 210, delay: -10, small: true},
];

export default function Sky() {
    return (
        <div className="sky" aria-hidden="true">
            <div className="sky-sun"/>
            <div className="sky-stars"/>
            {CLOUDS.map(({top, duration, delay, small}) => (
                <i key={top} className={small ? 'sky-cloud sky-cloud-small' : 'sky-cloud'}
                   style={{top: `${top}px`, animationDuration: `${duration}s`, animationDelay: `${delay}s`}}/>
            ))}
            <div className="sky-plane">
                <i className="sky-contrail"/>
                <svg viewBox="0 0 60 20" width="54" height="18">
                    <path className="sky-plane-body" d="M2 10.4L40 8.6Q47 8 52 9.6L58 10.6Q59 11 58 11.6L52 12Q47 13.2 40 12.6L2 11.6z"/>
                    <path className="sky-plane-body" d="M25 9.4L17 2.4H21L33 9.4zM25 12L17 19H21L33 12zM4 10.6L1 4.4H5L9.4 9.6z"/>
                    <circle className="sky-plane-light" cx="2" cy="11" r="1"/>
                </svg>
            </div>
            <svg className="sky-birds" viewBox="0 0 90 30" width="90" height="30">
                <path d="M0 8q3-4 6 0q3-4 6 0M22 3q3-4 6 0q3-4 6 0M40 14q3-4 6 0q3-4 6 0M62 6q3-4 6 0q3-4 6 0M76 20q3-4 6 0q3-4 6 0"/>
            </svg>
        </div>
    );
}
