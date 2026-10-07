import type { APIRoute } from 'astro';
import { getAdminPin, storageMode } from '../../lib/inventory-db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as { pin?: string };
    const ok = String(body.pin ?? '') === getAdminPin();
    return new Response(
      JSON.stringify({
        ok,
        storage: storageMode(),
        error: ok ? undefined : 'Väärä PIN',
      }),
      {
        status: ok ? 200 : 401,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Virheellinen pyyntö' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
};
