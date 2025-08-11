export type Tour = {
  id: string;
  slug: string;
  title: string;
  location: string;
  duration: string;
  group?: string;
  price?: string;
  images: string[];
  featured?: boolean;
};

export const tours: Tour[] = [
  {
    id: "1",
    slug: "e-scooter-along-kwai",
    title: "E-scooter along the Kwai River",
    location: "Kanchanaburi",
    duration: "3 heures",
    group: "2-6",
    price: "1500 THB",
    images: ["/placeholder.svg"],
    featured: true,
  },
  {
    id: "2",
    slug: "river-exploration",
    title: "River exploration",
    location: "Kanchanaburi",
    duration: "1 jour",
    group: "2-8",
    price: "900 €",
    images: ["/placeholder.svg"],
    featured: true,
  },
  {
    id: "3",
    slug: "kayaking-adventure",
    title: "Kayaking adventure",
    location: "Chiang Mai",
    duration: "2 jours / 1 nuit",
    group: "2-6",
    price: "1200 €",
    images: ["/placeholder.svg"],
    featured: true,
  },
  {
    id: "4",
    slug: "temple-cultural-visit",
    title: "Cultural temple visit",
    location: "Chiang Mai",
    duration: "1 jour",
    group: "2-10",
    price: "300 €",
    images: ["/placeholder.svg"],
    featured: true,
  },
];
