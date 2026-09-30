import {Helmet} from "react-helmet-async";

export const SITE_URL = 'https://kamran.azari.info';
const IMAGE = `${SITE_URL}/departure-countdown-preview.jpg`;

export const PERSON = {
    "@type": "Person",
    "name": "Kamran Azari",
    "alternateName": "Kamioon",
    "url": `${SITE_URL}/`,
    "jobTitle": "Software Developer",
    "address": {"@type": "PostalAddress", "addressCountry": "NL"},
    "sameAs": [
        "https://www.linkedin.com/in/kamranazari/",
        "https://github.com/kamioon",
        "https://stackoverflow.com/users/7238282/kamran",
        "https://x.com/kamioon",
        "https://www.youtube.com/channel/UCUJoYBU1p5cJ3LYZFPSrjpQ",
    ],
};

// Title, description, canonical URL and social cards for a page. The build step
// (scripts/prerender.mjs) bakes these into each page's static HTML.
function Seo({title, description, path, type = 'website', jsonLd, children}) {
    const url = SITE_URL + path;
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description}/>
            <link rel="canonical" href={url}/>
            <meta property="og:type" content={type}/>
            <meta property="og:site_name" content="Kamran Azari"/>
            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            <meta property="og:url" content={url}/>
            <meta property="og:image" content={IMAGE}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={IMAGE}/>
            {jsonLd && <script type="application/ld+json">{JSON.stringify({"@context": "https://schema.org", ...jsonLd})}</script>}
            {children}
        </Helmet>
    );
}

export default Seo;
