import {Router} from 'express';
import { getMachineHealth } from '../machineHealth';

const machineHealthRoute = Router();

machineHealthRoute.get('/hello', (_, res) => res.send('Hello World!'));

machineHealthRoute.post('/machine-health', (req, res) => {
  const result = getMachineHealth(req);
  if (result.error) {
    res.status(400).json(result);
  } else {
    res.json(result);
  }
});

export default machineHealthRoute