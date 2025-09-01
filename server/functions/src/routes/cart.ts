import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { Cart, CartItem, Product } from "../types";

const db = admin.firestore();

export const cartRoutes = async (request: Request, response: Response) => {
  const path = request.path;
  const method = request.method;

  try {
    // GET /cart - Get user cart
    if (method === 'GET' && path === '/cart') {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      const cartDoc = await db.collection('carts').doc(decodedToken.uid).get();

      if (!cartDoc.exists) {
        // Create empty cart if it doesn't exist
        await db.collection('carts').doc(decodedToken.uid).set({
          userId: decodedToken.uid,
          items: [],
          total: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        response.json({ items: [], total: 0 });
        return;
      }

      response.json(cartDoc.data());
      return;
    }

    // POST /cart/add - Add item to cart
    if (method === 'POST' && path === '/cart/add') {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { productId, quantity = 1 } = request.body;

      if (!productId) {
        response.status(400).json({ error: 'Product ID is required' });
        return;
      }

      // Get product details
      const productDoc = await db.collection('products').doc(productId).get();
      if (!productDoc.exists) {
        response.status(404).json({ error: 'Product not found' });
        return;
      }

      const productData = productDoc.data() as Product;
      const cartRef = db.collection('carts').doc(decodedToken.uid);
      const cartDoc = await cartRef.get();

      if (!cartDoc.exists) {
        // Create new cart
        await cartRef.set({
          userId: decodedToken.uid,
          items: [{
            product: productData,
            quantity: quantity
          }],
          total: productData.price * quantity,
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
          newTotal += productData.price * quantity;
        } else {
          // Add new item
          newItems.push({
            product: productData,
            quantity: quantity
          });
          newTotal += productData.price * quantity;
        }

        await cartRef.update({
          items: newItems,
          total: newTotal,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      response.json({ message: 'Item added to cart successfully' });
      return;
    }

    // PUT /cart/update - Update cart item quantity
    if (method === 'PUT' && path === '/cart/update') {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { productId, quantity } = request.body;

      if (!productId || quantity === undefined) {
        response.status(400).json({ error: 'Product ID and quantity are required' });
        return;
      }

      const cartRef = db.collection('carts').doc(decodedToken.uid);
      const cartDoc = await cartRef.get();

      if (!cartDoc.exists) {
        response.status(404).json({ error: 'Cart not found' });
        return;
      }

      const cartData = cartDoc.data() as Cart;
      const itemIndex = cartData.items?.findIndex((item: CartItem) => item.product.id === productId);

      if (itemIndex === -1) {
        response.status(404).json({ error: 'Item not found in cart' });
        return;
      }

      let newItems = [...(cartData.items || [])];
      let newTotal = cartData.total || 0;

      if (quantity <= 0) {
        // Remove item
        newTotal -= newItems[itemIndex].product.price * newItems[itemIndex].quantity;
        newItems.splice(itemIndex, 1);
      } else {
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

      response.json({ message: 'Cart updated successfully' });
      return;
    }

    // DELETE /cart/remove/:productId - Remove item from cart
    if (method === 'DELETE' && path.match(/^\/cart\/remove\/[^\/]+$/)) {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const productId = path.split('/')[3];

      const cartRef = db.collection('carts').doc(decodedToken.uid);
      const cartDoc = await cartRef.get();

      if (!cartDoc.exists) {
        response.status(404).json({ error: 'Cart not found' });
        return;
      }

      const cartData = cartDoc.data() as Cart;
      const itemIndex = cartData.items?.findIndex((item: CartItem) => item.product.id === productId);

      if (itemIndex === -1) {
        response.status(404).json({ error: 'Item not found in cart' });
        return;
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

      response.json({ message: 'Item removed from cart successfully' });
      return;
    }

    // DELETE /cart/clear - Clear cart
    if (method === 'DELETE' && path === '/cart/clear') {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      await db.collection('carts').doc(decodedToken.uid).update({
        items: [],
        total: 0,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      response.json({ message: 'Cart cleared successfully' });
      return;
    }

    // If no matching route
    response.status(404).json({ error: 'Cart endpoint not found' });

  } catch (error) {
    logger.error('Cart route error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};
