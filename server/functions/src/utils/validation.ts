export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 6 characters
  return password.length >= 6;
};

export const validateProduct = (product: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!product.name || typeof product.name !== 'string' || product.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!product.price || typeof product.price !== 'number' || product.price <= 0) {
    errors.push('Valid product price is required');
  }

  if (!product.description || typeof product.description !== 'string' || product.description.trim().length === 0) {
    errors.push('Product description is required');
  }

  if (!product.category || typeof product.category !== 'string' || product.category.trim().length === 0) {
    errors.push('Product category is required');
  }

  if (typeof product.inStock !== 'boolean') {
    errors.push('Product stock status is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateOrder = (order: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push('Order must contain at least one item');
  }

  if (!order.shippingAddress) {
    errors.push('Shipping address is required');
  } else {
    const address = order.shippingAddress;
    if (!address.firstName || !address.lastName || !address.address || !address.city || !address.zipCode) {
      errors.push('Complete shipping address is required');
    }
  }

  if (!order.totalAmount || typeof order.totalAmount !== 'number' || order.totalAmount <= 0) {
    errors.push('Valid total amount is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCartItem = (item: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!item.productId || typeof item.productId !== 'string') {
    errors.push('Product ID is required');
  }

  if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
    errors.push('Valid quantity is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
