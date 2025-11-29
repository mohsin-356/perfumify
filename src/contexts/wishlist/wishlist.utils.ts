export interface Item {
  id: string | number;
  [key: string]: any;
}

export function addItem(items: Item[], item: Item) {
  const exists = items.find((i) => i.id === item.id);
  return exists ? items : [...items, item];
}

export function removeItem(items: Item[], id: Item["id"]) {
  return items.filter((i) => i.id !== id);
}

export function clearList() {
  return [] as Item[];
}
