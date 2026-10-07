"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

export interface CartLine {
  /** slug + length, unique per line */
  id: string;
  slug: string;
  name: string;
  image: string;
  length: string;
  /** Colour name, when the product has colour options */
  color?: string;
  price: number;
  qty: number;
}

type State = { lines: CartLine[]; hydrated: boolean; open: boolean };

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: Omit<CartLine, "id"> }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "setOpen"; open: boolean };

const STORAGE_KEY = "roshni-cart-v1";
export const MAX_QTY = 10;

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n) || 1));

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, lines: action.lines, hydrated: true };
    case "add": {
      const id = [action.line.slug, action.line.length, action.line.color].filter(Boolean).join(":");
      const existing = state.lines.find((l) => l.id === id);
      const lines = existing
        ? state.lines.map((l) => (l.id === id ? { ...l, qty: clampQty(l.qty + action.line.qty) } : l))
        : [...state.lines, { ...action.line, id, qty: clampQty(action.line.qty) }];
      return { ...state, lines, open: true };
    }
    case "setQty":
      return { ...state, lines: state.lines.map((l) => (l.id === action.id ? { ...l, qty: clampQty(action.qty) } : l)) };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.id !== action.id) };
    case "clear":
      return { ...state, lines: [] };
    case "setOpen":
      return { ...state, open: action.open };
  }
}

function readStorage(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        typeof l?.id === "string" && typeof l?.slug === "string" && typeof l?.price === "number" && typeof l?.qty === "number",
    );
  } catch {
    return [];
  }
}

interface CartContextValue {
  lines: CartLine[];
  /** False until localStorage has been read. Render counts/totals only after this to avoid hydration mismatch. */
  hydrated: boolean;
  count: number;
  subtotal: number;
  isOpen: boolean;
  add: (line: Omit<CartLine, "id">) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Server and first client render both start empty, so markup matches.
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false, open: false });

  useEffect(() => {
    dispatch({ type: "hydrate", lines: readStorage() });
    // Keep tabs in sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: "hydrate", lines: readStorage() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage full or blocked: cart still works for this session
    }
  }, [state.lines, state.hydrated]);

  const add = useCallback((line: Omit<CartLine, "id">) => dispatch({ type: "add", line }), []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "setQty", id, qty }), []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const setOpen = useCallback((open: boolean) => dispatch({ type: "setOpen", open }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      hydrated: state.hydrated,
      count: state.lines.reduce((n, l) => n + l.qty, 0),
      subtotal: state.lines.reduce((n, l) => n + l.qty * l.price, 0),
      isOpen: state.open,
      add,
      setQty,
      remove,
      clear,
      setOpen,
    }),
    [state, add, setQty, remove, clear, setOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
