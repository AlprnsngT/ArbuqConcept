/**
 * ArbuqConcept E-commerce Firebase Functions
 * 
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Import route handlers
import { productRoutes } from "./routes/products";
import { reviewRoutes } from "./routes/reviews";
import { authRoutes } from "./routes/auth";
import { orderRoutes } from "./routes/orders";
import { cartRoutes } from "./routes/cart";

// Main API handler
export const api = onRequest((request, response) => {
  // Enable CORS
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }

  const path = request.path;
  const method = request.method;

  logger.info(`API Request: ${method} ${path}`, {structuredData: true});

  try {
    // Route to appropriate handler
    if (path.startsWith('/products')) {
      productRoutes(request, response);
    } else if (path.startsWith('/reviews')) {
      reviewRoutes(request, response);
    } else if (path.startsWith('/auth')) {
      authRoutes(request, response);
    } else if (path.startsWith('/orders')) {
      orderRoutes(request, response);
    } else if (path.startsWith('/cart')) {
      cartRoutes(request, response);
    } else {
      response.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    logger.error('API Error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
export const healthCheck = onRequest((request, response) => {
  response.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'ArbuqConcept E-commerce API'
  });
});
