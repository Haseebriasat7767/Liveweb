/**
 * Structural QA harness for LUXURY LEAD MACHINE.
 * Run `npm run dev` in another terminal, then `npm run qa`.
 * Checks metadata, landmarks, anchors, images, structured data, form
 * semantics, asset routes and third-party hygiene against the rendered HTML.
 */
const BASE = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const html = await (await fetch(`${BASE}/`)).text();

const report = [];
const ok = (label, cond, extra='') => report.push(`${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? ' — ' + extra : ''}`);

/* ---------- metadata ---------- */
const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
ok('title present', title.includes('Private Listing'), title);
ok('meta description', /<meta name="description" content="[^"]{60,}"/.test(html));
ok('canonical', html.includes('rel="canonical"'));
ok('og:image', /property="og:image"/.test(html) && /og:image:alt/.test(html));
ok('og:site_name + locale', /property="og:site_name"/.test(html) && /property="og:locale"/.test(html));
ok('twitter card', html.includes('name="twitter:card"') && html.includes('summary_large_image'));
ok('viewport meta', /name="viewport" content="width=device-width/.test(html));
ok('theme-color', html.includes('theme-color'));
ok('manifest link', html.includes('rel="manifest"'));
ok('robots meta / indexable', !html.includes('noindex'));

/* ---------- structure ---------- */
const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
const required = ['hero','residence','statistics','architecture','spaces','gallery','amenities','floor-plan','location','film','advisor','private-showing','contact','footer'];
ok('all sections present', required.every(id => ids.includes(id)), required.filter(id => !ids.includes(id)).join(',') || 'all');

const h1s = [...html.matchAll(/<h1[^>]*>/g)].length;
ok('exactly one h1', h1s === 1, `found ${h1s}`);
const h2s = [...html.matchAll(/<h2[^>]*>/g)].length;
ok('multiple h2 (hierarchy)', h2s >= 8, `${h2s} h2s`);
ok('skip link', html.includes('Skip to content'));
ok('noscript fallback', html.includes('<noscript>'));
ok('main landmark', html.includes('<main id="top">'));
ok('lang attribute', html.includes('<html lang="en"'));

/* ---------- structured data ---------- */
const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
let ldTypes = [];
try { ldTypes = ld.map(json => JSON.parse(json)['@type']); } catch (e) { ok('JSON-LD parses', false, e.message); }
ok('JSON-LD parses', ldTypes.length > 0, ldTypes.join(' · '));
ok('RealEstateListing present', ldTypes.includes('RealEstateListing'));
ok('RealEstateAgent present', ldTypes.includes('RealEstateAgent'));

/* ---------- links ---------- */
const hrefs = [...new Set([...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]))];
const anchors = hrefs.filter(h => h.startsWith('#'));
const brokenAnchors = anchors.filter(h => h.length > 1 && !ids.includes(h.slice(1)));
ok('all in-page anchors resolve', brokenAnchors.length === 0, brokenAnchors.join(', '));
const tel = hrefs.filter(h => h.startsWith('tel:'));
const mailto = hrefs.filter(h => h.startsWith('mailto:'));
const wa = hrefs.filter(h => h.startsWith('https://wa.me/'));
ok('tel link present + E.164', tel.length > 0 && /^tel:\+\d{7,15}$/.test(tel[0]), tel[0]);
ok('mailto link present', mailto.length > 0, mailto[0]?.slice(0, 46));
ok('whatsapp link present', wa.length > 0, wa[0]);
const internalLinks = hrefs.filter(h => h.startsWith('/') && !h.startsWith('//'));
ok('internal links are app routes', internalLinks.every(h => /^\/(privacy|terms|fair-housing)?/.test(h)), internalLinks.join(', '));

/* ---------- images ---------- */
const imgs = [...html.matchAll(/<img[^>]*>/g)].map(m => m[0]);
const srcs = imgs.map(t => t.match(/src="([^"]+)"/)?.[1]).filter(Boolean);
ok('images rendered', imgs.length > 5, `${imgs.length} <img>`);
const missingAlt = imgs.filter(t => !/alt="/.test(t)).length;
ok('every img has alt attribute', missingAlt === 0, `${missingAlt} without alt`);

let bad = [];
for (const src of [...new Set(srcs)]) {
  const clean = src.replace(/&amp;/g, '&');
  const res = await fetch(clean.startsWith('http') ? clean : BASE + clean, { method: 'GET' });
  if (!res.ok) bad.push(`${res.status} ${src.slice(0, 70)}`);
}
ok('all image requests 200', bad.length === 0, bad.join(' | '));

/* ---------- assets ---------- */
for (const path of ['/sitemap.xml','/robots.txt','/manifest.webmanifest','/icon.svg']) {
  const res = await fetch(BASE + path);
  ok(`asset ${path}`, res.ok, String(res.status));
}
const robots = await (await fetch(BASE + '/robots.txt')).text();
ok('robots disallows /api/', /Disallow: \/api\//.test(robots));
const sitemap = await (await fetch(BASE + '/sitemap.xml')).text();
ok('sitemap lists canonical route', sitemap.includes('<loc>') && sitemap.includes('privacy'));

/* ---------- lead form semantics ---------- */
for (const id of ['firstName','lastName','email','phone','message','consent','marketing','preferredDate','preferredTime']) {
  if (!ids.includes(id)) { ok(`form field #${id}`, false); continue; }
}
ok('form fields present', ['firstName','lastName','email','phone','consent'].every(id => ids.includes(id)));
const labels = [...html.matchAll(/<label[^>]*for="([^"]+)"/g)].map(m => m[1]);
ok('required fields labelled', ['firstName','lastName','email','phone','consent'].every(id => labels.includes(id)), labels.join(','));
ok('honeypot field present', /name="_company"/.test(html));
ok('autocomplete on address fields', ['given-name','family-name','email','tel'].every(a => new RegExp(`autocomplete="${a}"`, 'i').test(html)));
ok('no browser alert()', !/alert\(/.test(html));

/* ---------- third-party ---------- */
ok('no external font requests', !/fonts\.googleapis|fonts\.gstatic/.test(html));
ok('no external scripts', !/<script[^>]+src="https?:\/\/(?!127\.0\.0\.1|localhost)/.test(html));

/* ---------- placeholders stated honestly ---------- */
ok('fictional property disclaimer', html.includes('fictional demonstration property'));
ok('demo mode notices present', html.includes('Placeholder'));

console.log(report.join('\n'));
console.log(`\n${report.filter(r => r.startsWith('PASS')).length} passed, ${report.filter(r => r.startsWith('FAIL')).length} failed`);
