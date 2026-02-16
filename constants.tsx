
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: {
      en: 'Organic Argan Oil',
      fr: 'Huile d\'Argan Bio',
      ar: 'زيت الأركان العضوي',
      ama: 'ⵜⴰⵢⵏⵉ ⵏ ⵡⴰⵔⴳⴰⵏ'
    },
    description: {
      en: '100% Pure cosmetic Argan oil for skin and hair health.',
      fr: 'Huile d\'argan cosmétique 100% pure pour la peau et les cheveux.',
      ar: 'زيت أركان تجميلي نقي 100٪ لصحة البشرة والشعر.',
      ama: 'ⵜⴰⵢⵏⵉ ⵏ ⵡⴰⵔⴳⴰⵏ ⵜⴰⴷⵔⴼⵉⵜ ⵉ ⵜⴷⵓⵙⵉ.'
    },
    price: 150,
    priceLabel: '150 DH',
    image: 'https://images.unsplash.com/photo-1628102422700-08e64c3c3185?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: {
      en: 'Premium Saffron',
      fr: 'Safran de Taliouine',
      ar: 'زعفران تاليوين الممتاز',
      ama: 'ⵣⴰⵄⴼⵔⴰⵏ'
    },
    description: {
      en: 'Authentic Taliouine Saffron, hand-picked for maximum aroma.',
      fr: 'Safran authentique de Taliouine, cueilli à la main.',
      ar: 'زعفران تاليوين الأصيل، تم قطفه يدويًا لأقصى درجات النكهة.',
      ama: 'ⵣⴰⵄⴼⵔⴰⵏ ⵏ ⵜⴰⵍⵉⵡⵉⵏ ⵉⵍⵎⵎⴰⵏ.'
    },
    price: 45,
    priceLabel: '45 DH/g',
    image: 'https://images.unsplash.com/photo-1599307767316-776533bb941c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: {
      en: 'Authentic Amlou',
      fr: 'Amlou Artisanal',
      ar: 'أملو أصيل',
      ama: 'ⴰⵎⵍⵓ'
    },
    description: {
      en: 'A delicious blend of roasted almonds, Argan oil, and honey.',
      fr: 'Un délicieux mélange d\'amandes grillées, d\'huile d\'argan et de miel.',
      ar: 'مزيج لذيذ من اللوز المحمص وزيت الأركان والعسل.',
      ama: 'ⴰⵎⵍⵓ ⵏ ⵡⴰⵔⴳⴰⵏ ⴷ ⵜⴰⵎⵎⵏⵜ.'
    },
    price: 120,
    priceLabel: '120 DH',
    image: 'https://images.unsplash.com/photo-1594913366159-1832ffdf8e46?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: {
      en: 'Pure Thyme Honey',
      fr: 'Miel de Thym Pur',
      ar: 'عسل الزعتر الحر',
      ama: 'ⵜⴰⵎⵎⵏⵜ ⵏ ⵡⴰⵣⵓⴽⵏⵏⵉ'
    },
    description: {
      en: 'Pure mountain honey with powerful health benefits.',
      fr: 'Miel de montagne pur avec de puissants bienfaits pour la santé.',
      ar: 'عسل جبلي حر بفوائد صحية مذهلة.',
      ama: 'ⵜⴰⵎⵎⵏⵜ ⵜⴰⴷⵔⴼⵉⵜ ⵏ ⵓⴷⵔⴰⵔ.'
    },
    price: 250,
    priceLabel: '250 DH',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: {
      en: 'Virgin Olive Oil',
      fr: 'Huile d\'Olive Vierge',
      ar: 'زيت الزيتون البكر',
      ama: 'ⵜⴰⵢⵏⵉ ⵏ ⵓⵣⵎⵎⵓⵔ'
    },
    description: {
      en: 'Traditional cold-pressed olive oil from local groves.',
      fr: 'Huile d\'olive traditionnelle pressée à froid.',
      ar: 'زيت زيتون تقليدي معصور على البارد من حقولنا المحلية.',
      ama: 'ⵜⴰⵢⵏⵉ ⵏ ⵓⵣⵎⵎⵓⵔ ⵜⴰⵣⴰⵢⴽⵓⵜ.'
    },
    price: 85,
    priceLabel: '85 DH/L',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: {
      en: 'Rose Water',
      fr: 'Eau de Rose de Kelaat M\'Gouna',
      ar: 'ماء الورد قلعة مكونة',
      ama: 'ⴰⵎⴰⵏ ⵏ ⵜⵓⵊⵊⵓⵜ'
    },
    description: {
      en: 'Pure distilled rose water for natural skin care.',
      fr: 'Eau de rose pure distillée pour les soins naturels de la peau.',
      ar: 'ماء ورد نقي مقطر للعناية الطبيعية بالبشرة.',
      ama: 'ⴰⵎⴰⵏ ⵏ ⵜⵓⵊⵊⵓⵜ ⵜⴰⴷⵔⴼⵉⵜ.'
    },
    price: 60,
    priceLabel: '60 DH',
    image: 'https://images.unsplash.com/photo-1563821816912-8f921d3e8574?auto=format&fit=crop&q=80&w=800'
  }
];

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/imiri',
  instagram: 'https://instagram.com/imiri',
  whatsapp: '+212600000000',
  email: 'contact@imiri.ma'
};
