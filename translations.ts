
import { Translation, Language } from './types';

export const translations: Record<Language, Translation> = {
  en: {
    nav: { home: 'Home', about: 'About Us', products: 'Products', contact: 'Contact' },
    hero: { 
      title: 'IMIRI Cooperative', 
      subtitle: 'Pure Moroccan nature in every drop. Authentic products crafted with passion by local hands.',
      cta: 'Explore Products' 
    },
    about: {
      title: 'Our Story',
      description: 'IMIRI is more than a cooperative; it is a community of dedicated women preserving the ancestral secrets of Moroccan natural beauty and health. We harvest the best nature has to offer to bring you pure, organic excellence.',
      values: {
        natural: '100% Natural',
        authentic: 'Pure Authenticity',
        empowerment: 'Women Empowerment',
        local: 'Local Production'
      }
    },
    products: {
      title: 'Our Natural Collection',
      addToBasket: 'Add to Basket',
      price: 'Price'
    },
    cart: {
      title: 'Your Basket',
      empty: 'Your basket is empty',
      total: 'Total Amount',
      sendOrder: 'Send Order via WhatsApp',
      items: 'Items'
    },
    contact: {
      title: 'Get in Touch',
      whatsapp: 'Chat with us',
      email: 'Email Us',
      location: 'Our Location'
    }
  },
  fr: {
    nav: { home: 'Accueil', about: 'À Propos', products: 'Produits', contact: 'Contact' },
    hero: { 
      title: 'Coopérative IMIRI', 
      subtitle: 'La nature marocaine pure dans chaque goutte. Des produits authentiques fabriqués avec passion par des mains locales.',
      cta: 'Explorer les Produits' 
    },
    about: {
      title: 'Notre Histoire',
      description: 'IMIRI est plus qu’une coopérative ; c’est une communauté de femmes dévouées préservant les secrets ancestraux de la beauté et de la santé naturelle marocaine.',
      values: {
        natural: '100% Naturel',
        authentic: 'Pure Authenticité',
        empowerment: 'Émancipation Féminine',
        local: 'Production Locale'
      }
    },
    products: {
      title: 'Notre Collection Naturelle',
      addToBasket: 'Ajouter au Panier',
      price: 'Prix'
    },
    cart: {
      title: 'Votre Panier',
      empty: 'Votre panier est vide',
      total: 'Montant Total',
      sendOrder: 'Envoyer la Commande via WhatsApp',
      items: 'Articles'
    },
    contact: {
      title: 'Contactez-nous',
      whatsapp: 'Discutez avec nous',
      email: 'Écrivez-nous',
      location: 'Notre Emplacement'
    }
  },
  ar: {
    nav: { home: 'الرئيسية', about: 'من نحن', products: 'منتجاتنا', contact: 'اتصل بنا' },
    hero: { 
      title: 'تعاونية إيميري', 
      subtitle: 'طبيعة مغربية خالصة في كل قطرة. منتجات أصيلة صنعت بكل شغف بأيدي محلية.',
      cta: 'استكشف المنتجات' 
    },
    about: {
      title: 'قصتنا',
      description: 'إيميري أكثر من مجرد تعاونية؛ إنها مجتمع من النساء المتفانيات اللواتي يحافظن على الأسرار العريقة للجمال والصحة الطبيعية المغربية.',
      values: {
        natural: 'طبيعي 100%',
        authentic: 'أصالة تامة',
        empowerment: 'تمكين المرأة',
        local: 'إنتاج محلي'
      }
    },
    products: {
      title: 'مجموعتنا الطبيعية',
      addToBasket: 'أضف إلى السلة',
      price: 'السعر'
    },
    cart: {
      title: 'سلة المشتريات',
      empty: 'سلتك فارغة',
      total: 'المجموع الإجمالي',
      sendOrder: 'إرسال الطلب عبر واتساب',
      items: 'منتجات'
    },
    contact: {
      title: 'تواصل معنا',
      whatsapp: 'تحدث معنا',
      email: 'بريدنا الإلكتروني',
      location: 'موقعنا'
    }
  },
  ama: {
    nav: { home: 'ⴰⵙⵏⵓⴱⴳ', about: 'ⴼⵍⵍⴰⵖ', products: 'ⵉⴼⴰⵔⵙⵏ', contact: 'ⴰⵎⵢⴰⵡⴰⴹ' },
    hero: { 
      title: 'ⵜⴰⵎⵓⵏⵜ ⵉⵎⵉⵔⵉ', 
      subtitle: 'ⵜⴰⴳⴰⵎⴰ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ ⵜⴰⴷⵔⴼⵉⵜ. ⵉⴼⴰⵔⵙⵏ ⵉⵎⴰⵣⵉⵖⵏ ⵙ ⵉⴼⴰⵙⵙⵏ ⵏ ⵜⵎⵖⴰⵔⵉⵏ.',
      cta: 'ⴰⵣⵏ' 
    },
    about: {
      title: 'ⵜⴰⵎⵢⴰⵡⴰⴹⵜ ⵏⵏⵖ',
      description: 'ⵉⵎⵉⵔⵉ ⵜⴳⴰ ⵜⴰⵎⵓⵏⵜ ⵏ ⵜⵎⵖⴰⵔⵉⵏ ⵉⵙⵡⵓⵔⵉⵏ ⵅⴼ ⵜⴳⴰⵎⴰ ⴷ ⵜⴷⵓⵙⵉ ⵜⴰⵎⵖⵔⵉⴱⵉⵜ.',
      values: {
        natural: '100% ⴰⴳⴰⵎⴰⵏ',
        authentic: 'ⵜⴰⵏⵏⴰⵢⵜ',
        empowerment: 'ⵜⴰⵎⵖⴰⵔⵜ',
        local: 'ⴰⴼⴰⵔⵙ ⴰⴷⵖⴰⵔⴰⵏ'
      }
    },
    products: {
      title: 'ⵉⴼⴰⵔⵙⵏ ⵏⵏⵖ',
      addToBasket: 'ⴰⵔⵏⵓ ⵙ ⵜⵙⵍⵍⴰ',
      price: 'ⴰⵜⵉⴳ'
    },
    cart: {
      title: 'ⵜⴰⵙⵍⵍⴰ',
      empty: 'ⵜⴰⵙⵍⵍⴰ ⵜⵅⵡⴰ',
      total: 'ⴰⵜⵉⴳ ⴰⵎⴰⵜⴰⵢ',
      sendOrder: 'ⴰⵣⵏ ⵜⴰⵖⴰⵡⵙⴰ ⵙ ⵡⴰⵜⵙⴰⴱ',
      items: 'ⵉⴼⴰⵔⵙⵏ'
    },
    contact: {
      title: 'ⴰⵎⵢⴰⵡⴰⴹ',
      whatsapp: 'ⵡⴰⵜⵙⴰⴱ',
      email: 'ⵉⵎⴰⵢⵍ',
      location: 'ⴰⴷⵖⴰⵔ'
    }
  }
};
