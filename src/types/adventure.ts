export type Adventure = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'locked' | 'completed' | 'in-progress';
  image: string;
  password?: string;
  message?: string;
  location?: string;
};

export const INITIAL_ADVENTURES: Adventure[] = [
  {
    id: 'la-ruta-del-dorado',
    title: 'La Ruta del Dorado',
    description: 'Buscamos oro, pero encontramos algo mucho más valioso.',
    date: '08/01/2021',
    status: 'locked',
    image: '/images/dizi.png',
    password: '080121',
    message: 'Muchos buscaron El Dorado pensando que era oro. Nosotros descubrimos que el verdadero tesoro siempre fue compartir el camino.',
    location: 'DIZI RESTOBAR'
  }
];
