import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';

const verifyToken: RequestHandler = (req, res, next) => {
	let token = req.header('Authorization');

	if (!token) {
		return res.status(401).json({ error: 'Access denied' });
	}

	if(token.startsWith('Bearer ')) {
		token = token.replace('Bearer ', '').trim();
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
		// @ts-ignore
		req.userId = decoded.userId;
		return next();
	} catch (error) {
		// @ts-ignore
		if (error?.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token expired, please sign in again!' });
		}
		return res.status(401).json({ error: 'Invalid token' });
	}
};

export default verifyToken;