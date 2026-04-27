interface Env {
  CLICKHOUSE_URL: string;
  CLICKHOUSE_USER: string;
  CLICKHOUSE_PASSWORD: string;
  CLICKHOUSE_DATABASE: string;
}

interface Position {
  lat: number;
  lng: number;
}

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

// Deterministic jitter seeded by day + grid cell — shifts points ±0.05° (~5km)
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

  const { CLICKHOUSE_URL, CLICKHOUSE_USER, CLICKHOUSE_PASSWORD, CLICKHOUSE_DATABASE } = context.env;
  if (!CLICKHOUSE_URL || !CLICKHOUSE_USER || !CLICKHOUSE_PASSWORD) {
    return new Response(JSON.stringify({ positions: [], count: 0, error: 'not configured' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const query = `
    SELECT
      round(latitude, 1) AS lat,
      round(longitude, 1) AS lng
    FROM (
      SELECT
        client_id,
        latitude,
        longitude,
        ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY timestamp DESC) AS rn
      FROM gps
      WHERE timestamp > now() - INTERVAL 1 HOUR
        AND latitude != 0
        AND longitude != 0
        AND latitude BETWEEN -90 AND 90
        AND longitude BETWEEN -180 AND 180
    )
    WHERE rn = 1
    LIMIT 200
    FORMAT JSONEachRow
  `;

  try {
    const url = new URL(CLICKHOUSE_URL);
    url.searchParams.set('database', CLICKHOUSE_DATABASE || 'default');
    url.searchParams.set('query', query);

    const chResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-ClickHouse-User': CLICKHOUSE_USER,
        'X-ClickHouse-Key': CLICKHOUSE_PASSWORD,
      },
    });

    if (!chResponse.ok) {
      console.error('ClickHouse error:', await chResponse.text());
      return new Response(JSON.stringify({ positions: [], count: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    const text = await chResponse.text();
    const rows = text
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as { lat: number; lng: number });

    // Deduplicate grid cells and apply jitter
    const seen = new Set<string>();
    const positions: Position[] = [];
    for (const row of rows) {
      const key = `${row.lat},${row.lng}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const [jLat, jLng] = jitter(row.lat, row.lng);
      positions.push({ lat: Math.round(jLat * 100) / 100, lng: Math.round(jLng * 100) / 100 });
    }

    const body = JSON.stringify({ positions, count: positions.length });
    const response = new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, max-age=60',
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
