declare global {
  namespace Express {
    interface Request {
      adminAuth?: {
        id: string;
        email: string;
      };
    }
  }
}

export {};
