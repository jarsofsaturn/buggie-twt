const posts = [];
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { content, date } = req.body;
    if (!content || !date) return res.status(400).end('Missing');
    posts.unshift({ content, date });
    return res.status(200).end('OK');
  } else if (req.method === 'GET') {
    const items = posts.map(p => `
      <item>
        <title>${escape(p.content.slice(0,30))}</title>
        <description>${escape(p.content)}</description>
        <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      </item>`).join('');
    const xml = `<?xml version="1.0"?>
<rss><channel>
  <title>twt but for buggie</title>
  <description>buggie’s personal post feed</description>
  <link>YourSiteURL</link>
  ${items}
</channel></rss>`;
    res.setHeader('Content-Type', 'application/rss+xml');
    return res.status(200).send(xml);
  } else {
    res.status(405).end();
  }
}
function escape(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}
