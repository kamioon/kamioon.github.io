// Runs after `react-scripts build` (npm "postbuild").
//
// Renders every page to static HTML so search engines and LLM crawlers that don't run
// JavaScript still see the content, and so each URL gets its own file (HTTP 200) on
// GitHub Pages instead of going through 404.html. The browser bundle then hydrates
// that markup as usual. Pages are discovered by following internal links from "/".
// Also writes 404.html, sitemap.xml and llms.txt.
import {build} from 'esbuild';
import {promises as fs} from 'fs';
import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath} from 'url';

const SITE_URL = 'https://kamran.azari.info';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, 'build');
const ssrFile = path.join(root, 'node_modules', '.cache', 'prerender', 'ssr.cjs');

process.env.NODE_ENV = 'production';

const manifest = JSON.parse(await fs.readFile(path.join(buildDir, 'asset-manifest.json'), 'utf8')).files;

// Image imports must resolve to the hashed URLs webpack produced, or hydration won't match.
const craAssets = {
    name: 'cra-assets',
    setup(b) {
        b.onResolve({filter: /\.(jpe?g|png|gif|svg|webp)$/}, args => ({
            path: path.resolve(args.resolveDir, args.path),
            namespace: 'cra-asset',
        }));
        b.onLoad({filter: /.*/, namespace: 'cra-asset'}, args => {
            const url = manifest[`static/media/${path.basename(args.path)}`];
            if (!url) throw new Error(`${args.path} is not in asset-manifest.json (webpack may have inlined it)`);
            return {contents: `export default ${JSON.stringify(url)};`, loader: 'js'};
        });
    },
};

await build({
    entryPoints: [path.join(root, 'src', 'ssr.js')],
    outfile: ssrFile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node14',
    packages: 'external',
    jsx: 'automatic',
    loader: {'.js': 'jsx', '.css': 'empty'},
    plugins: [craAssets],
    logLevel: 'warning',
});
const {render} = createRequire(import.meta.url)(ssrFile);

const template = await fs.readFile(path.join(buildDir, 'index.html'), 'utf8');
if (!/<title>[^<]*<\/title>/.test(template) || !template.includes('<div id="root"></div>')) {
    throw new Error('build/index.html is missing <title> or <div id="root"></div>');
}

function toHtml({html, helmet}) {
    const head = ['title', 'meta', 'link', 'script'].map(key => helmet[key].toString()).join('');
    // Function replacements, so "$" in page content isn't treated as a pattern.
    return template
        .replace(/<title>[^<]*<\/title>/, () => '')
        .replace('</head>', () => `${head}</head>`)
        .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);
}

const decode = s => s
    .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

async function writeFile(file, contents) {
    await fs.mkdir(path.dirname(path.join(buildDir, file)), {recursive: true});
    await fs.writeFile(path.join(buildDir, file), contents);
}

const pages = new Map();
const queue = [['/', null]];
while (queue.length) {
    const [url, linkedFrom] = queue.shift();
    if (pages.has(url)) continue;

    const result = render(url);
    const meta = result.helmet.meta.toString();
    if (meta.includes('noindex')) throw new Error(`Broken internal link to ${url} on ${linkedFrom}`);
    pages.set(url, {
        title: decode(result.helmet.title.toString().match(/<title[^>]*>([^<]*)<\/title>/)[1]),
        description: decode((meta.match(/name="description" content="([^"]*)"/) || [])[1] || ''),
    });

    // GitHub Pages serves /about from about.html; the about/index.html copy covers /about/
    // and the case where a same-named directory exists (e.g. /blogs and /blogs/...).
    const html = toHtml(result);
    const files = url === '/' ? ['index.html'] : [`${url.slice(1)}.html`, `${url.slice(1)}/index.html`];
    for (const file of files) await writeFile(file, html);

    for (const [, href] of result.html.matchAll(/href="(\/[^"#?]*)"/g)) {
        const next = href.length > 1 ? href.replace(/\/+$/, '') : href;
        if (!/\.[a-z0-9]+$/i.test(next)) queue.push([next, url]);
    }
}

await writeFile('404.html', toHtml(render('/404')));

const loc = url => SITE_URL + url;
await writeFile('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...pages.keys()].map(url => `  <url><loc>${loc(url)}</loc></url>`).join('\n')}
</urlset>
`);

// https://llmstxt.org — a plain-text map of the site for LLMs.
const list = test => [...pages]
    .filter(([url]) => url !== '/' && test(url))
    .map(([url, {title, description}]) => `- [${title}](${loc(url)}): ${description}`)
    .join('\n');
await writeFile('llms.txt', `# Kamran Azari

> ${pages.get('/').description}

## Blog posts

${list(url => url.startsWith('/blogs/'))}

## Pages

${list(url => !url.startsWith('/blogs/'))}
`);

console.log(`Prerendered ${pages.size} pages + 404.html:\n${[...pages.keys()].map(url => `  ${url}`).join('\n')}`);
