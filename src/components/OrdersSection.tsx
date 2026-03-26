import Icon from "@/components/ui/icon";
import { PRODUCTS, type CartItem } from "@/components/shared/data";

export type Order = {
  code: string;
  items: CartItem[];
  total: number;
  payment: "cash" | "transfer";
  createdAt: string;
};

interface OrdersSectionProps {
  orders: Order[];
  onGoToMenu: () => void;
}

const PAYMENT_LABELS = {
  cash: "Наличными",
  transfer: "Переводом",
};

export default function OrdersSection({ orders, onGoToMenu }: OrdersSectionProps) {
  if (orders.length === 0) {
    return (
      <div>
        <h2 className="font-pacifico text-3xl text-[#1A1A0F] mb-6">Заказы</h2>
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-muted-foreground font-semibold text-lg mb-4">Заказов пока нет</p>
          <button
            onClick={onGoToMenu}
            className="btn-press bg-lemon text-[#1A1A0F] font-bold px-8 py-3 rounded-2xl transition-colors"
          >
            Перейти в меню
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-pacifico text-3xl text-[#1A1A0F] mb-6">Заказы</h2>
      <div className="space-y-5">
        {[...orders].reverse().map((order) => (
          <div key={order.code} className="animate-fade-in-up bg-white rounded-3xl border border-yellow-100 shadow-sm overflow-hidden">
            <div className="bg-lemon/30 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Код заказа</p>
                <p className="font-pacifico text-3xl text-[#1A1A0F] tracking-widest">{order.code}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 text-sm font-semibold text-emerald-dark border border-emerald/20">
                  <Icon name={order.payment === "cash" ? "Banknote" : "ArrowLeftRight"} size={14} />
                  {PAYMENT_LABELS[order.payment]}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{order.createdAt}</p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              {order.items.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.productId)!;
                return (
                  <div key={item.productId} className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1A1A0F] text-sm truncate">{product.name}</p>
                      <p className="text-muted-foreground text-xs">{product.price}₽ × {item.qty}</p>
                    </div>
                    <p className="font-bold text-[#1A1A0F] text-sm">{product.price * item.qty}₽</p>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t border-yellow-50 flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">Итого</span>
              <span className="font-pacifico text-2xl text-[#F9A825]">{order.total}₽</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
