
export type Language = 'en' | 'fr' | 'ar' | 'ama';

export interface Product {
  id: string;
  name: { [key in Language]: string };
  description: { [key in Language]: string };
  price: number;
  priceLabel: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Translation {
  nav: {
    home: string;
    about: string;
    products: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    description: string;
    values: {
      natural: string;
      authentic: string;
      empowerment: string;
      local: string;
    };
  };
  products: {
    title: string;
    addToBasket: string;
    price: string;
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    sendOrder: string;
    items: string;
  };
  contact: {
    title: string;
    whatsapp: string;
    email: string;
    location: string;
  };
}
