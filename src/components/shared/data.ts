export const LEMONADE_IMG = "https://cdn.poehali.dev/projects/13bf98c5-75eb-4faf-9dcf-ca215771ed40/files/0c493cbe-0fe5-41a0-af1d-ce4170dfc85d.jpg";
export const COMBO_IMG = "https://cdn.poehali.dev/projects/13bf98c5-75eb-4faf-9dcf-ca215771ed40/files/dbf8201c-6769-47a9-84d5-6b3bcb7a8707.jpg";
export const CHIPS_IMG = "https://cdn.poehali.dev/projects/13bf98c5-75eb-4faf-9dcf-ca215771ed40/files/63a82200-7552-4798-86e8-ae118e6c72d1.jpg";

export type Review = { id: number; productId: number; author: string; rating: number; text: string; date: string };
export type CartItem = { productId: number; qty: number };

export const PRODUCTS = [
  {
    id: 1,
    name: "Лимонад",
    desc: "Освежающий домашний лимонад с мятой и льдом",
    price: 35,
    image: LEMONADE_IMG,
    emoji: "🍋",
    tag: "Хит",
    tagColor: "bg-lemon text-[#1A1A0F]",
  },
  {
    id: 4,
    name: "Лимонад (½ порции)",
    desc: "Тот же свежий лимонад, только поменьше — в самый раз",
    price: 25,
    image: LEMONADE_IMG,
    emoji: "🍋",
    tag: "Мини",
    tagColor: "bg-lemon-light text-[#1A1A0F]",
  },
  {
    id: 2,
    name: "Чипсы",
    desc: "Хрустящие золотистые чипсы — идеальный перекус",
    price: 49,
    image: CHIPS_IMG,
    emoji: "🍟",
    tag: "Новинка",
    tagColor: "bg-orange-400 text-white",
  },
  {
    id: 3,
    name: "Комбо: Лимонад + Чипсы",
    desc: "Идеальный дуэт — холодный лимонад и хрустящие чипсы",
    price: 80,
    image: COMBO_IMG,
    emoji: "🍋🍟",
    tag: "Выгода",
    tagColor: "bg-emerald text-white",
  },
];

export const INITIAL_REVIEWS: Review[] = [
  { id: 1, productId: 1, author: "Аня К.", rating: 5, text: "Лучший лимонад в городе! Очень свежий и ароматный.", date: "12 марта" },
  { id: 2, productId: 2, author: "Максим Р.", rating: 5, text: "Комбо — просто огонь! Чипсы хрустят, лимонад освежает.", date: "18 марта" },
  { id: 3, productId: 1, author: "Света В.", rating: 4, text: "Вкусно и быстро, буду брать снова!", date: "22 марта" },
];
