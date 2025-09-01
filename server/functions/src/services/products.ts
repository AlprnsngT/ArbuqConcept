import * as admin from "firebase-admin";
import { Product, ProductFilters } from "../types";

const db = admin.firestore();

export class ProductService {
  // Get all products with filters
  static async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    let query: any = db.collection('products');
    
    // Apply filters
    if (filters?.color) {
      query = query.where('color', '==', filters.color);
    }
    if (filters?.scented !== undefined) {
      query = query.where('scented', '==', filters.scented);
    }
    if (filters?.minPrice) {
      query = query.where('price', '>=', filters.minPrice);
    }
    if (filters?.maxPrice) {
      query = query.where('price', '<=', filters.maxPrice);
    }

    const snapshot = await query.get();
    const products: Product[] = [];
    
    snapshot.forEach((doc: any) => {
      const product = {
        id: doc.id,
        ...doc.data()
      } as Product;
      
      // Apply search filter if provided
      if (filters?.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return;
      }
      
      products.push(product);
    });

    return products;
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    const snapshot = await db.collection('products')
      .where('featured', '==', true)
      .limit(limit)
      .get();
    
    const products: Product[] = [];
    snapshot.forEach((doc: any) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });

    return products;
  }

  // Get campaign products
  static async getCampaignProducts(): Promise<Product[]> {
    const snapshot = await db.collection('products')
      .where('inCampaign', '==', true)
      .get();
    
    const products: Product[] = [];
    snapshot.forEach((doc: any) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });

    return products;
  }

  // Get product by slug
  static async getProductBySlug(slug: string): Promise<Product | null> {
    const snapshot = await db.collection('products')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Product;
  }

  // Get product by ID
  static async getProductById(id: string): Promise<Product | null> {
    const doc = await db.collection('products').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as Product;
  }

  // Create new product
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Check if slug already exists
    const existingProduct = await db.collection('products')
      .where('slug', '==', productData.slug)
      .get();

    if (!existingProduct.empty) {
      throw new Error('Product with this slug already exists');
    }

    const docRef = await db.collection('products').add({
      ...productData,
      avgRating: 0,
      reviewCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return docRef.id;
  }

  // Update product
  static async updateProduct(id: string, updateData: Partial<Product>): Promise<void> {
    await db.collection('products').doc(id).update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    await db.collection('products').doc(id).delete();
  }

  // Update product stock
  static async updateStock(id: string, quantity: number): Promise<void> {
    const product = await this.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const newStock = Math.max(0, product.stock - quantity);
    await this.updateProduct(id, { stock: newStock });
  }

  // Check if product is in stock
  static async isInStock(id: string, quantity: number = 1): Promise<boolean> {
    const product = await this.getProductById(id);
    if (!product) {
      return false;
    }

    return product.stock >= quantity;
  }
}
