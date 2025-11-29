import React from "react";
import { useLocalStorage } from "@utils/use-local-storage";
import { addItem, removeItem, Item } from "./wishlist.utils";

interface State {
  items: Item[];
  isEmpty: boolean;
  totalUniqueItems: number;
}

interface WishlistProviderState extends State {
  addItemToWishlist: (item: Item) => void;
  removeItemFromWishlist: (id: Item["id"]) => void;
  isInWishlist: (id: Item["id"]) => boolean;
}

const initialState: State = {
  items: [],
  isEmpty: true,
  totalUniqueItems: 0,
};

export const wishlistContext = React.createContext<WishlistProviderState | undefined>(undefined);
wishlistContext.displayName = "WishlistContext";

export const useWishlist = () => {
  const context = React.useContext(wishlistContext);
  if (context === undefined) {
    throw new Error(`useWishlist must be used within a WishlistProvider`);
  }
  return context;
};

interface WishlistProviderProps {
  children: React.ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [saved, save] = useLocalStorage("royal-perfume-wishlist", JSON.stringify(initialState));
  const [state, setState] = React.useState<State>(JSON.parse(saved!));

  React.useEffect(() => {
    save(JSON.stringify(state));
  }, [state, save]);

  const addItemToWishlist = (item: Item) => {
    setState((prev) => {
      const items = addItem(prev.items, item);
      return generateState(items);
    });
  };

  const removeItemFromWishlist = (id: Item["id"]) => {
    setState((prev) => {
      const items = removeItem(prev.items, id);
      return generateState(items);
    });
  };

  const isInWishlist = (id: Item["id"]) => !!state.items.find((i) => i.id === id);

  const value = React.useMemo(
    () => ({ ...state, addItemToWishlist, removeItemFromWishlist, isInWishlist }),
    [state]
  );

  return <wishlistContext.Provider value={value}>{children}</wishlistContext.Provider>;
}

function generateState(items: Item[]): State {
  return {
    items,
    isEmpty: items.length === 0,
    totalUniqueItems: items.length,
  };
}
