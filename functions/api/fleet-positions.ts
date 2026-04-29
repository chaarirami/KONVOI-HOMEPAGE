interface Env {}

interface Position {
  lat: number;
  lng: number;
}

const SUPABASE_URL = 'https://riwxdhytoaglntyjpaww.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpd3hkaHl0b2FnbG50eWpwYXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NTM4NDEsImV4cCI6MjA1NTUyOTg0MX0.6bPU5M0D-fEDAwHnrHa38fjONhrr4tSisBR4EWuZu_Q';

const ALLOWED_ORIGINS = [
  'https://konvoi.eu',
  'https://www.konvoi.eu',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/\.konvoi-homepage\.pages\.dev$/.test(origin)) return true;
  if (origin === 'http://localhost:4321') return true;
  return false;
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

function jitter(lat: number, lng: number): [number, number] {
  const daySeed = Math.floor(Date.now() / 86_400_000);
  const cellSeed = Math.round(lat * 10) * 10000 + Math.round(lng * 10);
  const seed = daySeed * 1_000_003 + cellSeed;
  const pseudoRandLat = ((seed * 2654435761) >>> 0) / 4_294_967_296;
  const pseudoRandLng = ((seed * 2246822519) >>> 0) / 4_294_967_296;
  return [
    lat + (pseudoRandLat - 0.5) * 0.1,
    lng + (pseudoRandLng - 0.5) * 0.1,
  ];
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const origin = context.request.headers.get('Origin');

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  const cache = caches.default;
  const cacheKey = new Request(context.request.url, { method: 'GET' });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_globe_positions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    });

    if (!res.ok) {
      console.error('Supabase error:', await res.text());
      return new Response(JSON.stringify({ positions: [], count: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    const rows = await res.json() as { lat: number; lng: number }[];

    const positions: Position[] = rows.map((row) => {
      const [jLat, jLng] = jitter(row.lat, row.lng);
      return { lat: Math.round(jLat * 100) / 100, lng: Math.round(jLng * 100) / 100 };
    });

    const body = JSON.stringify({ positions, count: positions.length });
    const response = new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, max-age=3600',
        ...corsHeaders(origin),
      },
    });

    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    console.error('Fleet positions error:', err);
    return new Response(JSON.stringify({ positions: [], count: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }
};

export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(context.request.headers.get('Origin')),
  });
};
