import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react";
import { type Order } from "@/components/OrdersSection";
import { PRODUCTS } from "@/components/shared/data";
import { toast } from "sonner";

interface OrdersContextType {
  orders: Order[];
  placeOrder: (items: { productId: number; qty: number }[], payment: "cash" | "transfer") => void;
  cancelOrder: (code: string) => void;
  updateOrderStatus: (code: string, status: Order["status"]) => void;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

function generateCode() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function playReadySound() {
  try {
    const ctx = new AudioContext();
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.3);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.3);
    });
  } catch (e) { void e; }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const updateOrderStatus = (code: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => o.code === code ? { ...o, status } : o));
  };

  const placeOrder = (items: { productId: number; qty: number }[], payment: "cash" | "transfer") => {
    const now = new Date();
    const total = items.reduce((s, i) => {
      const p = PRODUCTS.find((pr) => pr.id === i.productId);
      return s + (p?.price || 0) * i.qty;
    }, 0);
    const code = generateCode();
    const order: Order = {
      code,
      items,
      total,
      payment,
      status: "preparing",
      createdAt:
        now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) +
        ", " +
        now.toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
    };
    setOrders((prev) => [...prev, order]);
    timers.current[code] = setTimeout(() => {
      updateOrderStatus(code, "ready");
      playReadySound();
      toast.success(`Заказ #${code} готов! 🍋`, {
        description: "Подойдите на кассу для получения",
        duration: 8000,
      });
      timers.current[code] = setTimeout(() => {
        updateOrderStatus(code, "done");
      }, 30000);
    }, 60000);
    return code;
  };

  const cancelOrder = (code: string) => {
    clearTimeout(timers.current[code]);
    delete timers.current[code];
    updateOrderStatus(code, "cancelled");
  };

  useEffect(() => {
    const t = timers.current;
    return () => { Object.values(t).forEach(clearTimeout); };
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, cancelOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
