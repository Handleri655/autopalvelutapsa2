export const site = {
  name: 'Nastolan autopalvelu Tapsa Oy',
  shortName: 'Autopalvelu Tapsa',
  founded: 1981,
  tagline: 'Luotettava perheyritys palveluksessasi vuodesta 1981',
  address: {
    street: 'Tervatie 5',
    postalCode: '15560',
    city: 'Nastola',
    region: 'Lahti',
    country: 'FI',
  },
  phone: {
    display: '044 771 1154',
    href: 'tel:+358447711154',
  },
  landline: {
    display: '03 762 3455',
    href: 'tel:+35837623455',
  },
  salesPhone: {
    display: '045 773 51727',
    href: 'tel:+3584577351727',
  },
  whatsapp: 'https://wa.me/358447711154',
  email: 'info@autopalvelutapsa.fi',
  salesEmail: 'automyynti@autopalvelutapsa.fi',
  facebook: 'https://www.facebook.com/61585190460998',
  nettiauto: 'https://www.nettiauto.com/yritys/3315771',
  // Lomakepalvelun (esim. Formspree) osoite. Tyhjänä lomake avaa sähköpostiohjelman.
  formEndpoint: '',
  // Hallintasivun PIN (demo – ei oikeaa tietoturvaa ilman palvelinta).
  adminPin: 'tapsa1981',
  hours: [
    { days: 'Ma–Pe', time: '10.00–17.00' },
    { days: 'La–Su', time: 'Suljettu' },
  ],
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Tervatie+5%2C+15560+Nastola',
  mapsEmbed: 'https://maps.google.com/maps?q=Tervatie%205%2C%2015560%20Nastola&z=14&output=embed',
};

export const nav = [
  { href: '/', label: 'Etusivu' },
  { href: '/palvelut/', label: 'Palvelut' },
  { href: '/varaosahaku/', label: 'Varaosahaku' },
  { href: '/purettavat-ajoneuvot/', label: 'Purettavat autot' },
  { href: '/outlet/', label: 'Outlet' },
  { href: '/myyntiautot/', label: 'Myyntiautot' },
  { href: '/yhteystiedot/', label: 'Yhteystiedot' },
];
