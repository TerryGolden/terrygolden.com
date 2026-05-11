export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

function escapeXml(str: string): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

interface Track {
  artist: string;
  title: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { episodeTitle, episodeNumber, tracklist, theme } = await req.json();

    const bgColor = theme === 'dark' ? '#1a1a2e' : '#0f0f23';
    const accentColor = theme === 'purple' ? '#9333ea' : '#06b6d4';
    
    // Create track items with artist highlighting
    const trackItems = tracklist.slice(0, 15).map((track: Track, i: number) => {
      const y = 320 + (i * 100);
      const artistName = escapeXml(track.artist || 'Unknown');
      const trackTitle = escapeXml(track.title || '');
      return `
        <rect x="50" y="${y - 30}" width="980" height="90" rx="12" fill="rgba(255,255,255,0.03)"/>
        <text x="80" y="${y + 5}" fill="${accentColor}" font-size="32" font-weight="bold" font-family="Arial, sans-serif">${String(i + 1).padStart(2, '0')}</text>
        <text x="150" y="${y}" fill="#ffffff" font-size="28" font-weight="700" font-family="Arial, sans-serif">${artistName}</text>
        <text x="150" y="${y + 38}" fill="#888888" font-size="22" font-family="Arial, sans-serif">${trackTitle}</text>
      `;
    }).join('');

    const svg = `<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor}"/>
      <stop offset="100%" style="stop-color:#0a0a1a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${accentColor}"/>
      <stop offset="100%" style="stop-color:#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <rect x="40" y="40" width="1000" height="220" rx="24" fill="rgba(255,255,255,0.05)"/>
  <text x="540" y="110" text-anchor="middle" fill="url(#accent)" font-size="36" font-weight="bold" font-family="Arial, sans-serif">ART OF RAVE</text>
  <text x="540" y="175" text-anchor="middle" fill="#ffffff" font-size="56" font-weight="bold" font-family="Arial, sans-serif">Episode ${episodeNumber}</text>
  <text x="540" y="225" text-anchor="middle" fill="#888888" font-size="24" font-family="Arial, sans-serif">${escapeXml(episodeTitle || '')}</text>
  <rect x="40" y="280" width="1000" height="6" fill="url(#accent)" rx="3"/>
  ${trackItems}
  <rect x="40" y="1800" width="1000" height="80" rx="16" fill="rgba(147,51,234,0.2)"/>
  <text x="540" y="1850" text-anchor="middle" fill="#ffffff" font-size="24" font-weight="600" font-family="Arial, sans-serif">@DJTerryGolden</text>
</svg>`;

    const base64Svg = btoa(unescape(encodeURIComponent(svg)));
    const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

    // Extract unique artist names for Instagram tagging
    const artistSet = new Set<string>();
    tracklist.forEach((t: Track) => {
      if (t.artist) {
        const artists = t.artist.split(/\s*(?:&|feat\.?|ft\.?|vs\.?|x)\s*/i);
        artists.forEach((a: string) => {
          const cleaned = a.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
          if (cleaned.length > 2) artistSet.add(cleaned);
        });
      }
    });

    return new Response(JSON.stringify({ 
      success: true,
      svgData: svg,
      dataUrl,
      artists: Array.from(artistSet)
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
