import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useOrders } from "@/context/OrdersContext";
import { PRODUCTS } from "@/components/shared/data";
import { type Order } from "@/components/OrdersSection";

const PIN = "1234";

const STATUS_CONFIG: Record<Order["status"], { label: string; icon: string; color: string; bg: string }> = {
  preparing: { label: "Готовится", icon: "ChefHat",     color: "text-orange-600",  bg: "bg-orange-50 border-orange-200" },
  ready:     { label: "Готов!",    icon: "Bell",         color: "text-emerald-dark", bg: "bg-emerald/10 border-emerald/30" },
  done:      { label: "Выдан",     icon: "CircleCheck",  color: "text-gray-400",    bg: "bg-gray-50 border-gray-200" },
  cancelled: { label: "Отменён",   icon: "CircleX",      color: "text-red-400",     bg: "bg-red-50 border-red-200" },
};

const NEXT_STATUS: Partial<Record<Order["status"], Order["status"]>> = {
  preparing: "ready",
  ready: "done",
};

const NEXT_LABEL: Partial<Record<Order["status"], string>> = {
  preparing: "Готов →",
  ready: "Выдан →",
};

export default function Seller() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pinError, setPinError] = useState(false);
  const { orders, updateOrderStatus } = useOrders();

  const handlePin = (digit: string) => {
    const next = pin + digit;
    setPin(next);
    setPinError(false);
    if (next.length === 4) {
      if (next === PIN) {
        setAuthed(true);
      } else {
        setPinError(true);
        setTimeout(() => { setPin(""); setPinError(false); }, 700);
      }
    }
  };

  const activeOrders = orders.filter((o) => o.status === "preparing" || o.status === "ready");
  const doneOrders = orders.filter((o) => o.status === "done" || o.status === "cancelled");

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center font-golos" style={{ background: "linear-gradient(135deg, #FFFDE7 0%, #F0FFF4 100%)" }}>
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xs text-center">
          <div className="text-4xl mb-3">🍋</div>
          <h2 className="font-pacifico text-2xl text-[#1A1A0F] mb-1">Панель продавца</h2>
          <p className="text-muted-foreground text-sm mb-6">Введите PIN-код</p>

          <div className="flex justify-center gap-3 mb-6">
            {[0,1,2,3].map((i) => (
              <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > i
                  ? pinError ? "bg-red-400 border-red-400" : "bg-emerald border-emerald"
                  : "border-gray-300"
              }`} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (d === "⌫") { setPin((p) => p.slice(0, -1)); setPinError(false); }
                  else if (d && pin.length < 4) handlePin(d);
                }}
                className={`btn-press h-14 rounded-2xl font-bold text-xl transition-colors ${
                  d === "" ? "invisible" :
                  d === "⌫" ? "bg-gray-100 text-gray-500 hover:bg-gray-200" :
                  "bg-lemon/30 text-[#1A1A0F] hover:bg-lemon"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-golos" style={{ background: "linear-gradient(135deg, #FFFDE7 0%, #F0FFF4 100%)" }}>
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-yellow-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍋</span>
            <span className="font-pacifico text-xl text-[#1A1A0F]">Панель продавца</span>
          </div>
          <button onClick={() => setAuthed(false)} className="btn-press text-xs text-muted-foreground flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <Icon name="LogOut" size={13} />
            Выйти
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        <div>
          <h3 className="font-bold text-[#1A1A0F] text-lg mb-3 flex items-center gap-2">
            <Icon name="Clock" size={18} />
            Активные заказы
            {activeOrders.length > 0 && (
              <span className="bg-orange-400 text-white text-xs font-bold rounded-full px-2 py-0.5">{activeOrders.length}</span>
            )}
          </h3>

          {activeOrders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-medium">Нет активных заказов</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => {
                const st = STATUS_CONFIG[order.status];
                const next = NEXT_STATUS[order.status];
                return (
                  <div key={order.code} className="bg-white rounded-3xl border border-yellow-100 shadow-sm overflow-hidden">
                    <div className="bg-lemon/30 px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Код заказа</p>
                        <p className="font-pacifico text-3xl text-[#1A1A0F] tracking-widest">{order.code}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">{order.createdAt}</div>
                    </div>

                    <div className={`mx-4 mt-3 rounded-2xl border px-4 py-2 flex items-center gap-2 ${st.bg}`}>
                      <Icon name={st.icon} size={15} className={st.color} />
                      <span className={`font-bold text-sm ${st.color}`}>{st.label}</span>
                    </div>

                    <div className="px-5 py-3 space-y-2">
                      {order.items.map((item) => {
                        const product = PRODUCTS.find((p) => p.id === item.productId)!;
                        return (
                          <div key={item.productId} className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#1A1A0F] text-sm truncate">{product.name}</p>
                              <p className="text-muted-foreground text-xs">× {item.qty}</p>
                            </div>
                            <p className="font-bold text-sm">{product.price * item.qty}₽</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="px-5 py-3 border-t border-yellow-50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <Icon name={order.payment === "cash" ? "Banknote" : "ArrowLeftRight"} size={14} className="text-muted-foreground" />
                        <span className="text-sm font-semibold">{order.payment === "cash" ? "Наличными" : "Переводом"}</span>
                        <span className="font-pacifico text-xl text-[#F9A825] ml-2">{order.total}₽</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOrderStatus(order.code, "cancelled")}
                          className="btn-press text-xs text-red-400 font-semibold px-3 py-1.5 rounded-xl border border-red-100 hover:bg-red-50 transition-colors"
                        >
                          Отменить
                        </button>
                        {next && (
                          <button
                            onClick={() => updateOrderStatus(order.code, next)}
                            className="btn-press text-xs text-white font-bold px-4 py-1.5 rounded-xl bg-emerald hover:bg-emerald-dark transition-colors"
                          >
                            {NEXT_LABEL[order.status]}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {doneOrders.length > 0 && (
          <div>
            <h3 className="font-bold text-muted-foreground text-sm mb-3 flex items-center gap-2">
              <Icon name="History" size={15} />
              История
            </h3>
            <div className="space-y-2">
              {[...doneOrders].reverse().map((order) => {
                const st = STATUS_CONFIG[order.status];
                return (
                  <div key={order.code} className="bg-white rounded-2xl border border-yellow-50 px-4 py-3 flex items-center gap-3">
                    <p className="font-pacifico text-xl text-[#1A1A0F] tracking-wider w-16">{order.code}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border ${st.bg} ${st.color}`}>
                      <Icon name={st.icon} size={12} />
                      {st.label}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">{order.createdAt}</span>
                    <span className="font-bold text-sm">{order.total}₽</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
