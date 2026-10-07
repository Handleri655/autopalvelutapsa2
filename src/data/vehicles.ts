export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year?: string;
  engine?: string;
  gearbox?: string;
  fuel?: string;
  body?: string;
  color?: string;
  status: 'Purussa' | 'Tulossa purkuun';
  image?: string;
  note?: string;
};

export const vehicleStatuses = ['Purussa', 'Tulossa purkuun'] as const;

export const vehicles: Vehicle[] = [
  {
    id: 'v-001',
    make: 'Volkswagen',
    model: 'Passat 2.0 TDI Farmari',
    year: '2009',
    engine: '2.0 TDI',
    fuel: 'Diesel',
    body: 'Farmari',
    color: 'Musta',
    status: 'Purussa',
    image: '/images/purettavat/passat.jpg',
    note: 'Moottori, vaihdelaatikko ja apulaitteet paikoillaan.',
  },
  {
    id: 'v-002',
    make: 'Kia',
    model: 'Rio 1.4 CRDI',
    year: '2015',
    engine: '1.4 CRDI, D4FC 66 kW',
    gearbox: '6-vaihteinen manuaali',
    fuel: 'Diesel',
    body: 'Hatchback',
    color: 'Ruskea',
    status: 'Purussa',
    image: '/images/purettavat/kia-rio.jpg',
  },
  {
    id: 'v-003',
    make: 'BMW',
    model: '3-sarja E46 2.0',
    year: '1999',
    engine: 'N42 / N46 B20',
    gearbox: 'Automaatti',
    fuel: 'Bensiini',
    body: 'Sedan',
    color: 'Harmaa',
    status: 'Purussa',
    image: '/images/purettavat/bmw-e46.jpg',
  },
  {
    id: 'v-004',
    make: 'Skoda',
    model: 'Octavia 2.0 TDI RS',
    year: '2008',
    engine: '2.0 TDI',
    gearbox: '6-vaihteinen manuaali',
    fuel: 'Diesel',
    body: 'Farmari',
    color: 'Metallisininen',
    status: 'Purussa',
    image: '/images/purettavat/skoda-octavia.jpg',
  },
];
