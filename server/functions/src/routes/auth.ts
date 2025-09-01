import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { AuthUser } from "../types";

const db = admin.firestore();

export const authRoutes = async (request: Request, response: Response) => {
  const path = request.path;
  const method = request.method;

  try {
    // POST /auth/register - User registration
    if (method === 'POST' && path === '/auth/register') {
      const { email, password, name } = request.body;

      // Validate required fields
      if (!email || !password || !name) {
        response.status(400).json({ error: 'Email, password, and name are required' });
        return;
      }

      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });

      // Create user profile in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        id: userRecord.uid,
        name: name,
        email: email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      response.status(201).json({
        message: 'User registered successfully',
        user: {
          id: userRecord.uid,
          name: name,
          email: email
        } as AuthUser
      });
      return;
    }

    // POST /auth/login - User login
    if (method === 'POST' && path === '/auth/login') {
      const { email, password } = request.body;

      if (!email || !password) {
        response.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // Note: Firebase Auth handles login on the client side
      // This endpoint can be used for additional server-side logic
      response.json({ message: 'Login successful' });
      return;
    }

    // GET /auth/profile - Get user profile
    if (method === 'GET' && path === '/auth/profile') {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);

      const userDoc = await db.collection('users').doc(decodedToken.uid).get();

      if (!userDoc.exists) {
        response.status(404).json({ error: 'User profile not found' });
        return;
      }

      const userData = userDoc.data();
      response.json({
        id: decodedToken.uid,
        name: userData?.name,
        email: userData?.email
      } as AuthUser);
      return;
    }

    // PUT /auth/profile - Update user profile
    if (method === 'PUT' && path === '/auth/profile') {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response.status(401).json({ error: 'Authorization token required' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const updateData = request.body;

      await db.collection('users').doc(decodedToken.uid).update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      response.json({ message: 'Profile updated successfully' });
      return;
    }

    // POST /auth/google - Google sign in
    if (method === 'POST' && path === '/auth/google') {
      const { idToken } = request.body;

      if (!idToken) {
        response.status(400).json({ error: 'Google ID token is required' });
        return;
      }

      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        // Check if user exists in Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();

        if (!userDoc.exists) {
          // Create new user profile
          await db.collection('users').doc(decodedToken.uid).set({
            id: decodedToken.uid,
            name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Google User',
            email: decodedToken.email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }

        response.json({
          message: 'Google sign in successful',
          user: {
            id: decodedToken.uid,
            name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Google User',
            email: decodedToken.email
          } as AuthUser
        });
      } catch (error) {
        response.status(401).json({ error: 'Invalid Google token' });
      }
      return;
    }

    // If no matching route
    response.status(404).json({ error: 'Auth endpoint not found' });

  } catch (error) {
    logger.error('Auth route error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
};
