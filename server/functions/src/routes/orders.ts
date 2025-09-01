import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

const db = admin.firestore();

export const orderRoutes = async (request: Request, response: Response) => {
  const path = request.path;
  const method = request.method;

  try {
    // GET /orders - Get user orders
    if (method === 'GET' && path === '/orders') {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      const ordersSnapshot = await db.collection('orders')
        .where('userId', '==', decodedToken.uid)
        .orderBy('createdAt', 'desc')
        .get();

      const orders: any[] = [];
      ordersSnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });

      response.json(orders);
      return;
    }

    // GET /orders/:id - Get single order
    if (method === 'GET' && path.match(/^\/orders\/[^\/]+$/)) {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const orderId = path.split('/')[2];

      const orderDoc = await db.collection('orders').doc(orderId).get();

      if (!orderDoc.exists) {
        response.status(404).json({ error: 'Order not found' });
        return;
      }

      const orderData = orderDoc.data();
      if (orderData?.userId !== decodedToken.uid) {
        response.status(403).json({ error: 'Access denied' });
        return;
      }

      response.json({
        id: orderDoc.id,
        ...orderData
      });
      return;
    }

    // POST /orders - Create new order
    if (method === 'POST' && path === '/orders') {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const orderData = request.body;

      // Validate required fields
      if (!orderData.items || !orderData.shippingAddress || !orderData.totalAmount) {
        response.status(400).json({ error: 'Items, shipping address, and total amount are required' });
        return;
      }

      const newOrder = await db.collection('orders').add({
        ...orderData,
        userId: decodedToken.uid,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      response.status(201).json({
        id: newOrder.id,
        message: 'Order created successfully'
      });
      return;
    }

    // PUT /orders/:id/status - Update order status (admin only)
    if (method === 'PUT' && path.match(/^\/orders\/[^\/]+\/status$/)) {
      const orderId = path.split('/')[2];
      const { status } = request.body;

      if (!status) {
        response.status(400).json({ error: 'Status is required' });
        return;
      }

      await db.collection('orders').doc(orderId).update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      response.json({ message: 'Order status updated successfully' });
      return;
    }

    // If no matching route
    response.status(404).json({ error: 'Order endpoint not found' });

  } catch (error) {
    logger.error('Order route error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};
