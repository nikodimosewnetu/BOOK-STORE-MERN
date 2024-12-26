import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' }); // Token valid for 1 hour
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userId; 
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
