import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { type Order } from "@/components/OrdersSection";
import { PRODUCTS } from "@/components/shared/data";
import { toast } from "sonner";

const API = "https://functions.poehali.dev/6165fd1e-3fb7-4fe9-ace3-d8aa97601744";

interface OrdersContextType {
  orders: Order[];
  placeOrder: (items: { productId: number; qty: number }[], payment: "cash" | "transfer") => Promise<void>;
  cancelOrder: (code: string) => Promise<void>;
  updateOrderStatus: (code: string, status: Order["status"]) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

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

function mapOrder(r: Record<string, unknown>): Order {
  return {
    code: r.code as string,
    items: r.items as Order["items"],
    total: r.total as number,
    payment: r.payment as Order["payment"],
    status: r.status as Order["status"],
    createdAt: r.created_at as string,
  };
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setOrders((data as Record<string, unknown>[]).map(mapOrder));
  };

  const prevStatuses = useRef<Record<string, Order["status"]>>({});

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    orders.forEach((order) => {
      if (order.status === "ready") {
        const prev = prevStatuses.current[order.code];
        if (prev && prev !== "ready") {
          playReadySound();
          toast.success(`Заказ #${order.code} готов! 🍋`, {
            description: "Подойдите на кассу для получения",
            duration: 8000,
          });
        }
      }
      prevStatuses.current[order.code] = order.status;
    });
  }, [orders]);

  const updateOrderStatus = async (code: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => o.code === code ? { ...o, status } : o));
    await fetch(API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, status }),
    });
  };

  const placeOrder = async (items: { productId: number; qty: number }[], payment: "cash" | "transfer") => {
    const total = items.reduce((s, i) => {
      const p = PRODUCTS.find((pr) => pr.id === i.productId);
      return s + (p?.price || 0) * i.qty;
    }, 0);
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, total, payment }),
    });
    const { code } = await res.json();
    await fetchOrders();
    return code;
  };

  const cancelOrder = async (code: string) => {
    await updateOrderStatus(code, "cancelled");
  };

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