import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { Review } from "../types";

const db = admin.firestore();

export const reviewRoutes = async (request: Request, response: Response) => {
  const path = request.path;
  const method = request.method;

  try {
    // GET /reviews/product/:productId - Get reviews for a product
    if (method === 'GET' && path.match(/^\/reviews\/product\/[^\/]+$/)) {
      const productId = path.split('/')[3];
      
      const reviewsSnapshot = await db.collection('reviews')
        .where('productId', '==', productId)
        .orderBy('createdAt', 'desc')
        .get();

      const reviews: Review[] = [];
      reviewsSnapshot.forEach((doc) => {
        reviews.push({
          id: doc.id,
          ...doc.data()
        } as Review);
      });

      response.json(reviews);
      return;
    }

    // POST /reviews - Add a new review
    if (method === 'POST' && path === '/reviews') {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const reviewData = request.body;

      // Validate required fields
      if (!reviewData.productId || !reviewData.rating || !reviewData.text) {
        response.status(400).json({ error: 'Product ID, rating, and text are required' });
        return;
      }

      // Validate rating
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        response.status(400).json({ error: 'Rating must be between 1 and 5' });
        return;
      }

      // Check if user already reviewed this product
      const existingReview = await db.collection('reviews')
        .where('productId', '==', reviewData.productId)
        .where('userId', '==', decodedToken.uid)
        .get();

      if (!existingReview.empty) {
        response.status(400).json({ error: 'You have already reviewed this product' });
        return;
      }

      // Create new review
      const newReview = await db.collection('reviews').add({
        productId: reviewData.productId,
        userId: decodedToken.uid,
        rating: reviewData.rating,
        text: reviewData.text,
        createdAt: new Date().toISOString()
      });

      // Update product average rating
      await updateProductRating(reviewData.productId);

      response.status(201).json({
        id: newReview.id,
        message: 'Review added successfully'
      });
      return;
    }

    // PUT /reviews/:id - Update review
    if (method === 'PUT' && path.match(/^\/reviews\/[^\/]+$/)) {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const reviewId = path.split('/')[2];
      const updateData = request.body;

      // Check if review exists and belongs to user
      const reviewDoc = await db.collection('reviews').doc(reviewId).get();
      
      if (!reviewDoc.exists) {
        response.status(404).json({ error: 'Review not found' });
        return;
      }

      const reviewData = reviewDoc.data();
      if (reviewData?.userId !== decodedToken.uid) {
        response.status(403).json({ error: 'You can only update your own reviews' });
        return;
      }

      // Update review
      await db.collection('reviews').doc(reviewId).update({
        rating: updateData.rating,
        text: updateData.text,
        updatedAt: new Date().toISOString()
      });

      // Update product average rating
      await updateProductRating(reviewData.productId);

      response.json({ message: 'Review updated successfully' });
      return;
    }

    // DELETE /reviews/:id - Delete review
    if (method === 'DELETE' && path.match(/^\/reviews\/[^\/]+$/)) {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const reviewId = path.split('/')[2];

      // Check if review exists and belongs to user
      const reviewDoc = await db.collection('reviews').doc(reviewId).get();
      
      if (!reviewDoc.exists) {
        response.status(404).json({ error: 'Review not found' });
        return;
      }

      const reviewData = reviewDoc.data();
      if (reviewData?.userId !== decodedToken.uid) {
        response.status(403).json({ error: 'You can only delete your own reviews' });
        return;
      }

      // Delete review
      await db.collection('reviews').doc(reviewId).delete();

      // Update product average rating
      await updateProductRating(reviewData.productId);

      response.json({ message: 'Review deleted successfully' });
      return;
    }

    // If no matching route
    response.status(404).json({ error: 'Review endpoint not found' });

  } catch (error) {
    logger.error('Review route error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to update product average rating
async function updateProductRating(productId: string) {
  const reviewsSnapshot = await db.collection('reviews')
    .where('productId', '==', productId)
    .get();

  let totalRating = 0;
  let reviewCount = 0;

  reviewsSnapshot.forEach((doc) => {
    const review = doc.data();
    totalRating += review.rating;
    reviewCount++;
  });

  const avgRating = reviewCount > 0 ? totalRating / reviewCount : 0;

  await db.collection('products').doc(productId).update({
    avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
    reviewCount: reviewCount
  });
}
