import Icon from "@/components/ui/icon";
import { PRODUCTS, type CartItem } from "@/components/shared/data";

interface CartSectionProps {
  cart: CartItem[];
  onGoToMenu: () => void;
  onRemove: (productId: number) => void;
  onChangeQty: (productId: number, delta: number) => void;
}

export default function CartSection({ cart, onGoToMenu, onRemove, onChangeQty }: CartSectionProps) {
  const totalPrice = cart.reduce((s, i) => {
    const p = PRODUCTS.find((pr) => pr.id === i.productId);
    return s + (p?.price || 0) * i.qty;
  }, 0);

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
            <button className="btn-press w-full bg-emerald hover:bg-emerald-dark text-white font-bold py-4 rounded-2xl text-lg transition-colors flex items-center justify-center gap-2 shadow-md">
              <Icon name="CreditCard" size={20} />
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
