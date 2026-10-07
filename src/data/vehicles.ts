export type Vehicle = {
  make: string;
  model: string;
  year?: string;
  engine?: string;
  gearbox?: string;
  status: 'Purussa' | 'Tulossa purkuun';
  image?: string;
};

export const vehicles: Vehicle[] = [];
