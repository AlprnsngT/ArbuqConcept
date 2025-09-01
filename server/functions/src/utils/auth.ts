import { Request } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const verifyAuth = async (request: Request): Promise<admin.auth.DecodedIdToken | null> => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    return decodedToken;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
};

export const requireAuth = async (request: Request): Promise<admin.auth.DecodedIdToken> => {
  const user = await verifyAuth(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
};

export const isAdmin = async (request: Request): Promise<boolean> => {
  try {
    const user = await verifyAuth(request);
    
    if (!user) {
      return false;
    }

    // Check if user has admin role in custom claims
    const userRecord = await admin.auth().getUser(user.uid);
    return userRecord.customClaims?.role === 'admin';
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
};
