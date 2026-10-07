export type OutletItem = {
  category: 'Moottorit' | 'Laturit & startit' | 'Peltiosat' | 'Muut osat';
  title: string;
  code?: string;
  year?: string;
  km?: string;
  oldPrice?: number;
  price: number;
};

export const outletItems: OutletItem[] = [
  { category: 'Moottorit', title: 'Volkswagen Sharan 1.9 D', year: '2004', oldPrice: 400, price: 120 },
  { category: 'Moottorit', title: 'Skoda Octavia 1.9 D', code: 'ASZ', oldPrice: 400, price: 150 },
  { category: 'Moottorit', title: 'Nissan Note 1.6 bensa', year: '2007', oldPrice: 400, price: 150 },
];

export const upcomingCategories: OutletItem['category'][] = ['Laturit & startit', 'Peltiosat', 'Muut osat'];
