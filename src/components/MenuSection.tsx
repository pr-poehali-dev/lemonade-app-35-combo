import { useState } from "react";
import Icon from "@/components/ui/icon";
import { PRODUCTS, INITIAL_REVIEWS, type Review } from "@/components/shared/data";

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

interface MenuSectionProps {
  addToCart: (productId: number) => void;
  addedId: number | null;
}

export default function MenuSection({ addToCart, addedId }: MenuSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newReview, setNewReview] = useState({ productId: 1, author: "", rating: 5, text: "" });
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [filterProduct, setFilterProduct] = useState<number | "all">("all");

  const submitReview = () => {
    if (!newReview.author.trim() || !newReview.text.trim()) return;
    const today = new Date();
    const date = `${today.getDate()} ${["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"][today.getMonth()]}`;
    setReviews((prev) => [{ id: Date.now(), ...newReview, date }, ...prev]);
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
  );
}
