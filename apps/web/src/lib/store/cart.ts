import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productoId: string;
  slug: string;
  nombre: string;
  categoria: string;
  talla: string;
  color: string;
  bordado: boolean;
  cantidad: number;
  precioUnitario: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productoId: string, talla: string, color: string) => void;
  updateQuantity: (productoId: string, talla: string, color: string, cantidad: number) => void;
  clear: () => void;
  total: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existente = get().items.find(
          (i) => i.productoId === item.productoId && i.talla === item.talla && i.color === item.color
        );
        if (existente) {
          set({
            items: get().items.map((i) =>
              i.productoId === item.productoId && i.talla === item.talla && i.color === item.color
                ? { ...i, cantidad: i.cantidad + item.cantidad }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (productoId, talla, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.productoId === productoId && i.talla === talla && i.color === color)
          ),
        });
      },
      updateQuantity: (productoId, talla, color, cantidad) => {
        set({
          items: get().items.map((i) =>
            i.productoId === productoId && i.talla === talla && i.color === color
              ? { ...i, cantidad }
              : i
          ),
        });
      },
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0),
      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
    }),
    { name: 'el-cacique-cart' }
  )
);
