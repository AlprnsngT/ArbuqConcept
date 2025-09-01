import * as admin from "firebase-admin";
import { Cart, CartItem } from "../types";
import { ProductService } from "./products";

const db = admin.firestore();

export class CartService {
  // Get user cart
  static async getUserCart(userId: string): Promise<Cart> {
    const cartDoc = await db.collection('carts').doc(userId).get();

    if (!cartDoc.exists) {
      // Create empty cart
      const emptyCart: Cart = {
        userId,
        items: [],
        total: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('carts').doc(userId).set(emptyCart);
      return emptyCart;
    }

    return cartDoc.data() as Cart;
  }

  // Add item to cart
  static async addToCart(userId: string, productId: string, quantity: number = 1): Promise<void> {
    // Get product details
    const product = await ProductService.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check stock
    if (!(await ProductService.isInStock(productId, quantity))) {
      throw new Error('Product is out of stock');
    }

    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      // Create new cart
      await cartRef.set({
        userId,
        items: [{
          product,
          quantity
        }],
        total: product.price * quantity,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Update existing cart
      const cartData = cartDoc.data() as Cart;
      const existingItemIndex = cartData.items?.findIndex((item: CartItem) => item.product.id === productId);

      let newItems = [...(cartData.items || [])];
      let newTotal = cartData.total || 0;

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        newItems[existingItemIndex].quantity += quantity;
        newTotal += product.price * quantity;
      } else {
        // Add new item
        newItems.push({
          product,
          quantity
        });
        newTotal += product.price * quantity;
      }

      await cartRef.update({
        items: newItems,
        total: newTotal,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  // Update cart item quantity
  static async updateCartItem(userId: string, productId: string, quantity: number): Promise<void> {
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      throw new Error('Cart not found');
    }

    const cartData = cartDoc.data() as Cart;
    const itemIndex = cartData.items?.findIndex((item: CartItem) => item.product.id === productId);

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    let newItems = [...(cartData.items || [])];
    let newTotal = cartData.total || 0;

    if (quantity <= 0) {
      // Remove item
      newTotal -= newItems[itemIndex].product.price * newItems[itemIndex].quantity;
      newItems.splice(itemIndex, 1);
    } else {
      // Check stock for new quantity
      if (!(await ProductService.isInStock(productId, quantity))) {
        throw new Error('Product is out of stock');
      }

      // Update quantity
      newTotal -= newItems[itemIndex].product.price * newItems[itemIndex].quantity;
      newItems[itemIndex].quantity = quantity;
      newTotal += newItems[itemIndex].product.price * quantity;
    }

    await cartRef.update({
      items: newItems,
      total: newTotal,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Remove item from cart
  static async removeFromCart(userId: string, productId: string): Promise<void> {
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      throw new Error('Cart not found');
    }

    const cartData = cartDoc.data() as Cart;
    const itemIndex = cartData.items?.findIndex((item: CartItem) => item.product.id === productId);

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    let newItems = [...(cartData.items || [])];
    let newTotal = cartData.total || 0;

    // Remove item
    newTotal -= newItems[itemIndex].product.price * newItems[itemIndex].quantity;
    newItems.splice(itemIndex, 1);

    await cartRef.update({
      items: newItems,
      total: newTotal,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Clear cart
  static async clearCart(userId: string): Promise<void> {
    await db.collection('carts').doc(userId).update({
      items: [],
      total: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Get cart total
  static async getCartTotal(userId: string): Promise<number> {
    const cart = await this.getUserCart(userId);
    return cart.total || 0;
  }

  // Get cart item count
  static async getCartItemCount(userId: string): Promise<number> {
    const cart = await this.getUserCart(userId);
    return cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  // Check if cart is empty
  static async isCartEmpty(userId: string): Promise<boolean> {
    const cart = await this.getUserCart(userId);
    return cart.items?.length === 0 || false;
  }
}
