import {renderToString} from "react-dom/server";
import {StaticRouter} from "react-router-dom/server";
import {HelmetProvider} from "react-helmet-async";
import App from "./App";

// Build-time entry used by scripts/prerender.mjs to turn each route into static HTML.
export function render(url) {
    const helmetContext = {};
    const html = renderToString(
        <HelmetProvider context={helmetContext}>
            <StaticRouter location={url}>
                <App/>
            </StaticRouter>
        </HelmetProvider>
    );
    return {html, helmet: helmetContext.helmet};
}
