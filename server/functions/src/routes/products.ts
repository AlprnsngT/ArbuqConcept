import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { Product } from "../types";

const db = admin.firestore();

export const productRoutes = async (request: Request, response: Response) => {
  const path = request.path;
  const method = request.method;

  try {
    // GET /products - Get all products with optional filters
    if (method === 'GET' && path === '/products') {
      const { color, scented, minPrice, maxPrice, search } = request.query;
      
      let query: any = db.collection('products');
      
      // Apply filters
      if (color) {
        query = query.where('color', '==', color);
      }
      if (scented !== undefined) {
        query = query.where('scented', '==', scented === 'true');
      }
      if (minPrice) {
        query = query.where('price', '>=', Number(minPrice));
      }
      if (maxPrice) {
        query = query.where('price', '<=', Number(maxPrice));
      }

      const productsSnapshot = await query.get();
      let products: Product[] = [];
      
      productsSnapshot.forEach((doc: any) => {
        const product = {
          id: doc.id,
          ...doc.data()
        } as Product;
        
        // Apply search filter if provided
        if (search && !product.name.toLowerCase().includes(search.toString().toLowerCase())) {
          return;
        }
        
        products.push(product);
      });

      response.json(products);
      return;
    }

    // GET /products/featured - Get featured products
    if (method === 'GET' && path === '/products/featured') {
      const productsSnapshot = await db.collection('products')
        .where('featured', '==', true)
        .limit(6)
        .get();
      
      const products: Product[] = [];
      productsSnapshot.forEach((doc: any) => {
        products.push({
          id: doc.id,
          ...doc.data()
        } as Product);
      });

      response.json(products);
      return;
    }

    // GET /products/campaign - Get campaign products
    if (method === 'GET' && path === '/products/campaign') {
      const productsSnapshot = await db.collection('products')
        .where('inCampaign', '==', true)
        .get();
      
      const products: Product[] = [];
      productsSnapshot.forEach((doc: any) => {
        products.push({
          id: doc.id,
          ...doc.data()
        } as Product);
      });

      response.json(products);
      return;
    }

    // GET /products/:slug - Get single product by slug
    if (method === 'GET' && path.match(/^\/products\/[^\/]+$/)) {
      const slug = path.split('/')[2];
      const productSnapshot = await db.collection('products')
        .where('slug', '==', slug)
        .limit(1)
        .get();

      if (productSnapshot.empty) {
        response.status(404).json({ error: 'Product not found' });
        return;
      }

      const productDoc = productSnapshot.docs[0];
      response.json({
        id: productDoc.id,
        ...productDoc.data()
      });
      return;
    }

    // POST /products - Create new product (admin only)
    if (method === 'POST' && path === '/products') {
      const productData = request.body;
      
      // Validate required fields
      if (!productData.name || !productData.price || !productData.slug) {
        response.status(400).json({ error: 'Name, price, and slug are required' });
        return;
      }

      // Check if slug already exists
      const existingProduct = await db.collection('products')
        .where('slug', '==', productData.slug)
        .get();

      if (!existingProduct.empty) {
        response.status(400).json({ error: 'Product with this slug already exists' });
        return;
      }

      const newProduct = await db.collection('products').add({
        ...productData,
        avgRating: 0,
        reviewCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      response.status(201).json({
        id: newProduct.id,
        message: 'Product created successfully'
      });
      return;
    }

    // PUT /products/:id - Update product (admin only)
    if (method === 'PUT' && path.match(/^\/products\/[^\/]+$/)) {
      const productId = path.split('/')[2];
      const updateData = request.body;

      await db.collection('products').doc(productId).update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      response.json({ message: 'Product updated successfully' });
      return;
    }

    // DELETE /products/:id - Delete product (admin only)
    if (method === 'DELETE' && path.match(/^\/products\/[^\/]+$/)) {
      const productId = path.split('/')[2];
      
      await db.collection('products').doc(productId).delete();

      response.json({ message: 'Product deleted successfully' });
      return;
    }

    // If no matching route
    response.status(404).json({ error: 'Product endpoint not found' });

  } catch (error) {
    logger.error('Product route error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};
