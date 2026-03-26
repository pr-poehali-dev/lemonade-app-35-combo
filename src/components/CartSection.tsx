import { useState } from "react";
import Icon from "@/components/ui/icon";
import { PRODUCTS, type CartItem } from "@/components/shared/data";

interface CartSectionProps {
  cart: CartItem[];
  onGoToMenu: () => void;
  onRemove: (productId: number) => void;
  onChangeQty: (productId: number, delta: number) => void;
  onPlaceOrder: (payment: "cash" | "transfer") => void;
}

export default function CartSection({ cart, onGoToMenu, onRemove, onChangeQty, onPlaceOrder }: CartSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [payment, setPayment] = useState<"cash" | "transfer">("cash");

  const totalPrice = cart.reduce((s, i) => {
    const p = PRODUCTS.find((pr) => pr.id === i.productId);
    return s + (p?.price || 0) * i.qty;
  }, 0);

  const handleConfirm = () => {
    onPlaceOrder(payment);
    setShowModal(false);
  };

  return (
    <div>
      <h2 className="font-pacifico text-3xl text-[#1A1A0F] mb-6">Корзина</h2>
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-muted-foreground font-semibold text-lg mb-4">Корзина пуста</p>
          <button
            onClick={onGoToMenu}
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
                    <button onClick={() => onChangeQty(item.productId, -1)} className="btn-press w-8 h-8 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center justify-center font-bold text-[#1A1A0F] transition-colors hover:bg-lemon">
                      <Icon name="Minus" size={14} />
                    </button>
                    <span className="w-5 text-center font-bold text-[#1A1A0F]">{item.qty}</span>
                    <button onClick={() => onChangeQty(item.productId, 1)} className="btn-press w-8 h-8 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center justify-center font-bold text-[#1A1A0F] transition-colors hover:bg-lemon">
                      <Icon name="Plus" size={14} />
                    </button>
                    <button onClick={() => onRemove(item.productId)} className="btn-press w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center ml-1 transition-colors">
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
            <button
              onClick={() => setShowModal(true)}
              className="btn-press w-full bg-emerald hover:bg-emerald-dark text-white font-bold py-4 rounded-2xl text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Icon name="ShoppingBag" size={20} />
              Оформить заказ
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-pacifico text-2xl text-[#1A1A0F]">Оформить заказ</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-muted-foreground hover:bg-gray-200 transition-colors">
                <Icon name="X" size={16} />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-1">Получение</p>
            <div className="bg-lemon/20 rounded-2xl px-4 py-3 flex items-center gap-2 mb-5">
              <Icon name="Store" size={18} />
              <span className="font-semibold text-[#1A1A0F] text-sm">Получить в магазине</span>
            </div>

            <p className="text-sm text-muted-foreground mb-3">Способ оплаты</p>
            <div className="space-y-2 mb-6">
              {([
                { value: "cash", label: "Наличными", icon: "Banknote" },
                { value: "transfer", label: "Переводом", icon: "ArrowLeftRight" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPayment(opt.value)}
                  className={`btn-press w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all font-semibold text-sm ${
                    payment === opt.value
                      ? "border-emerald bg-emerald/10 text-emerald-dark"
                      : "border-yellow-100 bg-white text-[#1A1A0F] hover:bg-yellow-50"
                  }`}
                >
                  <Icon name={opt.icon} size={18} />
                  {opt.label}
                  {payment === opt.value && <Icon name="Check" size={16} className="ml-auto" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-[#1A1A0F]">Итого:</span>
              <span className="font-pacifico text-2xl text-[#F9A825]">{totalPrice}₽</span>
            </div>

            <button
              onClick={handleConfirm}
              className="btn-press w-full bg-emerald hover:bg-emerald-dark text-white font-bold py-4 rounded-2xl text-lg transition-colors shadow-md"
            >
              Подтвердить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
