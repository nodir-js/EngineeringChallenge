import express from 'express';
import serverless from 'serverless-http';
import { connect } from 'mongoose';
import 'dotenv/config'
import machineHealthRoute from '../../../routes/machineHealthRoute'
import authRoute from '../../../routes/authRoute';
import verifyToken from '../../../middleware/authMiddleware';

connect(process.env.MONGODB_CONNECTION_STRING!, {
  dbName: 'engineering_challenge'
})
const api = express();

// Middleware to parse JSON request bodies
api.use(express.json());

api.use('/api/', authRoute)
api.use('/api/', verifyToken, machineHealthRoute);

export const handler = serverless(api);
