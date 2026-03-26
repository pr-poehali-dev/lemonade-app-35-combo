import { useState } from "react";
import Icon from "@/components/ui/icon";

const LEMONADE_IMG = "https://cdn.poehali.dev/projects/13bf98c5-75eb-4faf-9dcf-ca215771ed40/files/0c493cbe-0fe5-41a0-af1d-ce4170dfc85d.jpg";
const COMBO_IMG = "https://cdn.poehali.dev/projects/13bf98c5-75eb-4faf-9dcf-ca215771ed40/files/dbf8201c-6769-47a9-84d5-6b3bcb7a8707.jpg";

const PRODUCTS = [
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
    id: 2,
    name: "Комбо: Лимонад + Чипсы",
    desc: "Идеальный дуэт — холодный лимонад и хрустящие чипсы",
    price: 80,
    image: COMBO_IMG,
    emoji: "🍋🍟",
    tag: "Выгода",
    tagColor: "bg-emerald text-white",
  },
];

const INITIAL_REVIEWS = [
  { id: 1, productId: 1, author: "Аня К.", rating: 5, text: "Лучший лимонад в городе! Очень свежий и ароматный.", date: "12 марта" },
  { id: 2, productId: 2, author: "Максим Р.", rating: 5, text: "Комбо — просто огонь! Чипсы хрустят, лимонад освежает.", date: "18 марта" },
  { id: 3, productId: 1, author: "Света В.", rating: 4, text: "Вкусно и быстро, буду брать снова!", date: "22 марта" },
];

type Review = { id: number; productId: number; author: string; rating: number; text: string; date: string };
type CartItem = { productId: number; qty: number };

function StarRating({ value, onChange, size = 20 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="star-btn"
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          onClick={() => onChange?.(star)}
          style={{ background: "none", border: "none", padding: 2, cursor: onChange ? "pointer" : "default" }}
        >
          <span style={{ fontSize: size, color: star <= (hovered || value) ? "#FFD700" : "#D1D5DB" }}>★</span>
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: typeof PRODUCTS[0]; onAdd: () => void }) {
  return (
    <div className="card-hover bg-white rounded-3xl overflow-hidden shadow-md border border-yellow-100 flex flex-col">
      <div className="relative h-52 overflow-hidden bg-yellow-50">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${product.tagColor} shadow`}>
          {product.tag}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-golos font-bold text-lg text-[#1A1A0F] leading-snug mb-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1">{product.desc}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-pacifico text-2xl text-[#F9A825]">{product.price}₽</span>
          <button
            onClick={onAdd}
            className="btn-press bg-lemon hover:bg-lemon-dark text-[#1A1A0F] font-bold py-2 px-5 rounded-2xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Icon name="Plus" size={16} />
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const product = PRODUCTS.find((p) => p.id === review.productId);
  return (
    <div className="animate-fade-in-up bg-white rounded-2xl p-5 shadow-sm border border-yellow-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-lemon flex items-center justify-center font-bold text-[#1A1A0F] text-sm">
            {review.author[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#1A1A0F]">{review.author}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <StarRating value={review.rating} size={15} />
      </div>
      {product && (
        <p className="text-xs text-emerald font-semibold mb-1">{product.emoji} {product.name}</p>
      )}
      <p className="text-sm text-[#333]">{review.text}</p>
    </div>
  );
}

export default function Index() {
  const [section, setSection] = useState<"menu" | "cart" | "contacts">("menu");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newReview, setNewReview] = useState({ productId: 1, author: "", rating: 5, text: "" });
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [filterProduct, setFilterProduct] = useState<number | "all">("all");

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => {
    const p = PRODUCTS.find((pr) => pr.id === i.productId);
    return s + (p?.price || 0) * i.qty;
  }, 0);

  const addToCart = (productId: number) => {
    setCart((prev) => {
      const found = prev.find((i) => i.productId === productId);
      if (found) return prev.map((i) => i.productId === productId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId, qty: 1 }];
    });
    setAddedId(productId);
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
    setTimeout(() => setAddedId(null), 600);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const changeQty = (productId: number, delta: number) => {
    setCart((prev) => prev.map((i) =>
      i.productId === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ));
  };

  const submitReview = () => {
    if (!newReview.author.trim() || !newReview.text.trim()) return;
    const today = new Date();
    const date = `${today.getDate()} ${["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"][today.getMonth()]}`;
    setReviews((prev) => [
      { id: Date.now(), ...newReview, date },
      ...prev,
    ]);
    setNewReview({ productId: 1, author: "", rating: 5, text: "" });
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const filteredReviews = filterProduct === "all"
    ? reviews
    : reviews.filter((r) => r.productId === filterProduct);

  const avgRating = (productId: number) => {
    const r = reviews.filter((rv) => rv.productId === productId);
    if (!r.length) return 0;
    return r.reduce((s, rv) => s + rv.rating, 0) / r.length;
  };

  return (
    <div className="min-h-screen font-golos" style={{ background: "linear-gradient(135deg, #FFFDE7 0%, #F0FFF4 100%)" }}>

      {/* Hero */}
      <div className="relative overflow-hidden noise-overlay" style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFF176 50%, #2ECC71 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #1A1A0F 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-2xl mx-auto px-6 pt-14 pb-10 text-center">
          <div className="animate-float inline-block text-6xl mb-3">🍋</div>
          <h1 className="font-pacifico text-5xl text-[#1A1A0F] mb-2 drop-shadow-sm">Лемонад фон</h1>
          <p className="font-golos text-[#1A1A0F]/70 text-lg font-medium">Свежо. Вкусно. Заряжает.</p>
        </div>
      </div>

      {/* Nav */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-yellow-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-1 py-2">
            {([
              { key: "menu", label: "Меню", icon: "UtensilsCrossed" },
              { key: "cart", label: "Корзина", icon: "ShoppingCart" },
              { key: "contacts", label: "Контакты", icon: "MapPin" },
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`btn-press flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all flex-1 justify-center relative ${
                  section === key
                    ? "bg-lemon text-[#1A1A0F] shadow-sm"
                    : "text-muted-foreground hover:bg-yellow-50"
                }`}
              >
                <Icon name={icon} size={16} />
                {label}
                {key === "cart" && totalQty > 0 && (
                  <span className={`absolute -top-1 -right-1 w-5 h-5 bg-emerald text-white text-xs font-bold rounded-full flex items-center justify-center ${cartBounce ? "animate-bounce-badge" : ""}`}>
                    {totalQty}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ===== МЕНЮ ===== */}
        {section === "menu" && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="relative">
                  {addedId === p.id && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                      <div className="animate-pop-in bg-emerald text-white font-bold px-6 py-3 rounded-2xl shadow-lg text-lg">
                        ✓ Добавлено!
                      </div>
                    </div>
                  )}
                  <ProductCard product={p} onAdd={() => addToCart(p.id)} />
                </div>
              ))}
            </div>

            {/* Отзывы */}
            <div>
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <h2 className="font-pacifico text-2xl text-[#1A1A0F]">Отзывы</h2>
                <div className="flex gap-2">
                  {[{ label: "Все", val: "all" as const }, ...PRODUCTS.map((p) => ({ label: p.emoji, val: p.id }))].map(({ label, val }) => (
                    <button
                      key={String(val)}
                      onClick={() => setFilterProduct(val)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold btn-press transition-colors ${
                        filterProduct === val ? "bg-lemon text-[#1A1A0F]" : "bg-white text-muted-foreground border border-yellow-100"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Средние оценки */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {PRODUCTS.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl p-4 border border-yellow-100 flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm text-[#1A1A0F]">{p.name.split(":")[0]}</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        <StarRating value={Math.round(avgRating(p.id))} size={14} />
                        <span className="text-xs text-muted-foreground">
                          {avgRating(p.id).toFixed(1)} ({reviews.filter(r => r.productId === p.id).length})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Форма отзыва */}
              <div className="bg-white rounded-3xl p-6 border border-yellow-100 shadow-sm mb-5">
                <h3 className="font-golos font-bold text-base text-[#1A1A0F] mb-4 flex items-center gap-2">
                  <Icon name="MessageSquarePlus" size={18} />
                  Оставить отзыв
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={newReview.author}
                      onChange={(e) => setNewReview((r) => ({ ...r, author: e.target.value }))}
                      placeholder="Ваше имя"
                      className="border border-yellow-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lemon bg-yellow-50/50"
                    />
                    <select
                      value={newReview.productId}
                      onChange={(e) => setNewReview((r) => ({ ...r, productId: Number(e.target.value) }))}
                      className="border border-yellow-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lemon bg-yellow-50/50"
                    >
                      {PRODUCTS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#1A1A0F]">Оценка:</span>
                    <StarRating value={newReview.rating} onChange={(v) => setNewReview((r) => ({ ...r, rating: v }))} />
                  </div>
                  <textarea
                    value={newReview.text}
                    onChange={(e) => setNewReview((r) => ({ ...r, text: e.target.value }))}
                    placeholder="Расскажите о вашем впечатлении..."
                    rows={3}
                    className="w-full border border-yellow-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lemon bg-yellow-50/50 resize-none"
                  />
                  <button
                    onClick={submitReview}
                    className="btn-press w-full bg-emerald hover:bg-emerald-dark text-white font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="Send" size={16} />
                    Отправить отзыв
                  </button>
                  {reviewSuccess && (
                    <div className="animate-pop-in bg-emerald/10 text-emerald-dark text-sm font-semibold rounded-xl py-2.5 px-4 text-center">
                      🎉 Спасибо! Ваш отзыв опубликован.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {filteredReviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== КОРЗИНА ===== */}
        {section === "cart" && (
          <div>
            <h2 className="font-pacifico text-3xl text-[#1A1A0F] mb-6">Корзина</h2>
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-muted-foreground font-semibold text-lg mb-4">Корзина пуста</p>
                <button
                  onClick={() => setSection("menu")}
                  className="btn-press bg-lemon text-[#1A1A0F] font-bold px-8 py-3 rounded-2xl transition-colors"
                >
                  Перейти в меню
                </button>
              </div>
            ) : (
              <div>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => {
                    const product = PRODUCTS.find((p) => p.id === item.productId)!;
                    return (
                      <div key={item.productId} className="animate-fade-in-up bg-white rounded-2xl p-4 border border-yellow-100 shadow-sm flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#1A1A0F] text-sm truncate">{product.name}</p>
                          <p className="text-muted-foreground text-xs">{product.price}₽ × {item.qty}</p>
                          <p className="font-bold text-emerald-dark text-sm">{product.price * item.qty}₽</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeQty(item.productId, -1)} className="btn-press w-8 h-8 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center justify-center font-bold text-[#1A1A0F] transition-colors hover:bg-lemon">
                            <Icon name="Minus" size={14} />
                          </button>
                          <span className="w-5 text-center font-bold text-[#1A1A0F]">{item.qty}</span>
                          <button onClick={() => changeQty(item.productId, 1)} className="btn-press w-8 h-8 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center justify-center font-bold text-[#1A1A0F] transition-colors hover:bg-lemon">
                            <Icon name="Plus" size={14} />
                          </button>
                          <button onClick={() => removeFromCart(item.productId)} className="btn-press w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center ml-1 transition-colors">
                            <Icon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white rounded-3xl p-6 border border-yellow-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-[#1A1A0F]">Итого:</span>
                    <span className="font-pacifico text-3xl text-[#F9A825]">{totalPrice}₽</span>
                  </div>
                  <button className="btn-press w-full bg-emerald hover:bg-emerald-dark text-white font-bold py-4 rounded-2xl text-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                    <Icon name="CreditCard" size={20} />
                    Оформить заказ
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== КОНТАКТЫ ===== */}
        {section === "contacts" && (
          <div>
            <h2 className="font-pacifico text-3xl text-[#1A1A0F] mb-6">Контакты</h2>
            <div className="space-y-4">
              {[
                { icon: "MapPin", label: "Адрес", value: "ул. Лимонная, 7, Москва", color: "bg-lemon/20 text-lemon-dark" },
                { icon: "Phone", label: "Телефон", value: "+7 (999) 123-45-67", color: "bg-emerald/20 text-emerald-dark" },
                { icon: "Clock", label: "Часы работы", value: "Пн–Вс: 10:00 – 22:00", color: "bg-orange-100 text-orange-500" },
                { icon: "Instagram", label: "Instagram", value: "@lemonade_fon", color: "bg-pink-100 text-pink-500" },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="animate-fade-in-up bg-white rounded-2xl p-5 border border-yellow-100 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={icon as "MapPin"} size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
                    <p className="font-bold text-[#1A1A0F]">{value}</p>
                  </div>
                </div>
              ))}

              <div className="animate-fade-in-up bg-white rounded-3xl p-6 border border-yellow-100 shadow-sm mt-2">
                <h3 className="font-golos font-bold text-base text-[#1A1A0F] mb-4 flex items-center gap-2">
                  <Icon name="MessageCircle" size={18} />
                  Написать нам
                </h3>
                <div className="space-y-3">
                  <input
                    placeholder="Ваше имя"
                    className="w-full border border-yellow-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lemon bg-yellow-50/50"
                  />
                  <textarea
                    placeholder="Ваше сообщение..."
                    rows={4}
                    className="w-full border border-yellow-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lemon bg-yellow-50/50 resize-none"
                  />
                  <button className="btn-press w-full bg-lemon hover:bg-lemon-dark text-[#1A1A0F] font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2">
                    <Icon name="Send" size={16} />
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="text-center py-8 text-muted-foreground text-sm">
        <span className="font-pacifico text-lemon-dark text-base">Лемонад фон</span>
        <span className="mx-2">·</span>
        <span>Свежо каждый день 🍋</span>
      </div>
    </div>
  );
}
