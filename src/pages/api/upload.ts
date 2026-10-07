import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAdminPin } from '../../lib/inventory-db';

export const prerender = false;

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 6 * 1024 * 1024;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

const safeName = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .slice(0, 80);

export const POST: APIRoute = async ({ request }) => {
  const pin = request.headers.get('x-admin-pin') || '';
  if (pin !== getAdminPin()) {
    return json({ error: 'Virheellinen PIN' }, 401);
  }

  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return json({ error: 'Kuva puuttuu' }, 400);
    }
    if (!ALLOWED.has(file.type)) {
      return json({ error: 'Sallitut muodot: JPG, PNG, WebP, GIF' }, 400);
    }
    if (file.size > MAX_BYTES) {
      return json({ error: 'Kuva on liian suuri (max 6 Mt)' }, 400);
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : file.type === 'image/gif' ? 'gif' : 'jpg';
    const base = safeName(file.name.replace(/\.[^.]+$/, '')) || 'kuva';
    const pathname = `vehicles/${Date.now()}-${base}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(pathname, bytes, {
        access: 'public',
        contentType: file.type,
        addRandomSuffix: false,
      });
      return json({ url: blob.url, pathname: blob.pathname, storage: 'blob' });
    }

    if (process.env.VERCEL) {
      return json(
        {
          error:
            'Kuvien lataus Vercelissä vaatii BLOB_READ_WRITE_TOKEN-ympäristömuuttujan.',
        },
        500,
      );
    }

    const dir = join(process.cwd(), 'public', 'uploads', 'vehicles');
    mkdirSync(dir, { recursive: true });
    const filename = pathname.split('/').pop()!;
    writeFileSync(join(dir, filename), bytes);
    return json({ url: `/uploads/vehicles/${filename}`, pathname, storage: 'file' });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Lataus epäonnistui' }, 500);
  }
};
