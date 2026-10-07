import { list, put } from '@vercel/blob';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parts as seedParts } from '../data/parts';
import { vehicles as seedVehicles } from '../data/vehicles';

export type InventoryData = {
  parts: unknown[];
  vehicles: unknown[];
  updatedAt?: string;
};

const BLOB_PATHNAME = 'tapsa-inventory.json';
const LOCAL_FILE = join(process.cwd(), 'data', 'inventory.json');

const seed = (): InventoryData => ({
  parts: structuredClone(seedParts),
  vehicles: structuredClone(seedVehicles),
  updatedAt: new Date().toISOString(),
});

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function readFromBlob(): Promise<InventoryData | null> {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 10 });
  const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME) ?? blobs[0];
  if (!blob?.url) return null;
  const res = await fetch(blob.url, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = (await res.json()) as InventoryData;
  if (!Array.isArray(data.parts) || !Array.isArray(data.vehicles)) return null;
  return data;
}

async function writeToBlob(data: InventoryData) {
  await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

function readFromFile(): InventoryData | null {
  if (!existsSync(LOCAL_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(LOCAL_FILE, 'utf8')) as InventoryData;
    if (!Array.isArray(data.parts) || !Array.isArray(data.vehicles)) return null;
    return data;
  } catch {
    return null;
  }
}

function writeToFile(data: InventoryData) {
  mkdirSync(dirname(LOCAL_FILE), { recursive: true });
  writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export function getAdminPin() {
  return process.env.ADMIN_PIN || 'tapsa1981';
}

export function storageMode(): 'blob' | 'file' {
  return hasBlob() ? 'blob' : 'file';
}

export async function loadInventory(): Promise<InventoryData> {
  if (hasBlob()) {
    return (await readFromBlob()) ?? seed();
  }
  return readFromFile() ?? seed();
}

export async function saveInventory(data: InventoryData): Promise<InventoryData> {
  const payload: InventoryData = {
    parts: data.parts,
    vehicles: data.vehicles,
    updatedAt: new Date().toISOString(),
  };

  if (hasBlob()) {
    await writeToBlob(payload);
    return payload;
  }

  // Vercel serverless ilman Blobia: tiedostot eivät säily.
  if (process.env.VERCEL) {
    throw new Error(
      'Vercelissä tarvitaan BLOB_READ_WRITE_TOKEN. Luo Blob-store Vercelissä ja lisää token ympäristömuuttujiin.',
    );
  }

  writeToFile(payload);
  return payload;
}
