import express from 'express';
import { connect } from 'mongoose';
import 'dotenv/config'
import machineHealthRoute from './routes/machineHealthRoute';
import authRoute from './routes/authRoute';
import verifyToken from './middleware/authMiddleware';

connect(process.env.MONGODB_CONNECTION_STRING!, {
  dbName: 'engineering_challenge'
})
const app = express();
const port = 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

app.use('/api/', authRoute)
app.use('/api/', verifyToken, machineHealthRoute);

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}/api`);
});
