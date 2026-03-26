import { useState } from "react";
import Icon from "@/components/ui/icon";
import { PRODUCTS, type CartItem } from "@/components/shared/data";
import MenuSection from "@/components/MenuSection";
import CartSection from "@/components/CartSection";
import ContactsSection from "@/components/ContactsSection";
import OrdersSection, { type Order } from "@/components/OrdersSection";

function generateCode() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export default function Index() {
  const [section, setSection] = useState<"menu" | "cart" | "contacts" | "orders">("menu");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartBounce, setCartBounce] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

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

  const placeOrder = (payment: "cash" | "transfer") => {
    const now = new Date();
    const total = cart.reduce((s, i) => {
      const p = PRODUCTS.find((pr) => pr.id === i.productId);
      return s + (p?.price || 0) * i.qty;
    }, 0);
    const order: Order = {
      code: generateCode(),
      items: [...cart],
      total,
      payment,
      createdAt: now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) + ", " +
        now.toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
    };
    setOrders((prev) => [...prev, order]);
    setCart([]);
    setSection("orders");
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
              { key: "orders", label: "Заказы", icon: "ClipboardList" },
              { key: "contacts", label: "Контакты", icon: "MapPin" },
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`btn-press flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex-1 justify-center relative ${
                  section === key
                    ? "bg-lemon text-[#1A1A0F] shadow-sm"
                    : "text-muted-foreground hover:bg-yellow-50"
                }`}
              >
                <Icon name={icon} size={15} />
                {label}
                {key === "cart" && totalQty > 0 && (
                  <span className={`absolute -top-1 -right-1 w-5 h-5 bg-emerald text-white text-xs font-bold rounded-full flex items-center justify-center ${cartBounce ? "animate-bounce-badge" : ""}`}>
                    {totalQty}
                  </span>
                )}
                {key === "orders" && orders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {orders.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {section === "menu" && (
          <MenuSection addToCart={addToCart} addedId={addedId} />
        )}
        {section === "cart" && (
          <CartSection
            cart={cart}
            onGoToMenu={() => setSection("menu")}
            onRemove={removeFromCart}
            onChangeQty={changeQty}
            onPlaceOrder={placeOrder}
          />
        )}
        {section === "orders" && (
          <OrdersSection orders={orders} onGoToMenu={() => setSection("menu")} />
        )}
        {section === "contacts" && (
          <ContactsSection />
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