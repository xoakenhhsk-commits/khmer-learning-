// Vercel Serverless Function: Proxy Google Translate TTS
// This bypasses CORS restrictions that block direct browser requests

export default async function handler(req, res) {
  const { text, lang = 'km' } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  // Use a more reliable endpoint and client ID
  // client=gtx is generally more stable for free access
  const encoded = encodeURIComponent(text);
  const urls = [
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=gtx`,
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob`
  ];

  for (const url of urls) {
    try {
      console.log(`TTS Proxy: Trying ${url}`);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/',
        },
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        
        // Set proper headers for audio stream
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.byteLength);
        res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        return res.send(Buffer.from(audioBuffer));
      }
      console.warn(`TTS Proxy: Failed with status ${response.status} for ${url}`);
    } catch (error) {
      console.error(`TTS Proxy: Error fetching from ${url}:`, error);
    }
  }

  return res.status(502).json({ error: 'Google TTS unavailable' });
}
