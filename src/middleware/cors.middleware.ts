import { Request, Response, NextFunction } from 'express';

export const customCors = (req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins = ['http://localhost:8100', 'http://localhost:4200'];
    const origin = req.headers.origin as string;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Manejar pre-flight (peticiones OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
};