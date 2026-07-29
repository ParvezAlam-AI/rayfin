import { CartItem } from './CartItem.js';
import { Product } from './Product.js';
import { StoreOrder } from './StoreOrder.js';
import { WishlistItem } from './WishlistItem.js';

export type StoreSchema = {
  Product: Product;
  CartItem: CartItem;
  WishlistItem: WishlistItem;
  StoreOrder: StoreOrder;
};

export const schema = [Product, CartItem, WishlistItem, StoreOrder];
