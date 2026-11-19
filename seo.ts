import type { Plugin } from 'vite';

export function seo(): Plugin {
  // On Pages the workflow supplies the real deployment URL, including its repository path.
  const raw = process.env.VITE_SITE_URL;
  const site = raw ? new URL(raw.endsWith('/') ? raw : `${raw}/`).href : null;
  return {
    name: 'neuro-static-seo',
    transformIndexHtml(html) {
      const image = site ? new URL('og-image.png', site).href : './og-image.png';
      const tags = site ? `<link rel="canonical" href="${site}" /><meta property="og:url" content="${site}" />` : '';
      return html.replace('__NEURO_SOCIAL_IMAGE__', image).replace('</head>', `${tags}</head>`);
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${site ? `Sitemap: ${site}sitemap.xml\n` : ''}` });
      // Without a deployment origin an empty sitemap avoids publishing an invented URL.
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site ? `<url><loc>${site.replaceAll('&', '&amp;')}</loc></url>` : ''}</urlset>` });
    },
  };
}
