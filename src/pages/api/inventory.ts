import type { APIRoute } from 'astro';
import { getAdminPin, loadInventory, saveInventory, storageMode } from '../../lib/inventory-db';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

export const GET: APIRoute = async () => {
  try {
    const data = await loadInventory();
    return json({ ...data, storage: storageMode() });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Luku epäonnistui' }, 500);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const pin = request.headers.get('x-admin-pin') || '';
  if (pin !== getAdminPin()) {
    return json({ error: 'Virheellinen PIN' }, 401);
  }

  try {
    const body = (await request.json()) as { parts?: unknown[]; vehicles?: unknown[] };
    const current = await loadInventory();
    const next = await saveInventory({
      parts: Array.isArray(body.parts) ? body.parts : current.parts,
      vehicles: Array.isArray(body.vehicles) ? body.vehicles : current.vehicles,
    });
    return json({ ...next, storage: storageMode() });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Tallennus epäonnistui' }, 500);
  }
};
