import {Router} from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';

const authRoute = Router();

authRoute.post('/auth/register', async (req, res) => {
	const [username, password] = [req.body?.username, req.body?.password];

	if(!username || !password) {
		return res.status(400).json({ error: 'Invalid username or password!'})
	}

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
		// @ts-ignore
		if (error?.code === 11000) {
			return res.status(409).json({ error: `Username: ${username} is already taken, please use a different one!`})
		}
    return res.status(500).json({ error: 'Registration failed!' });
  }
});

authRoute.post('/auth/login', async (req, res) => {
	const [username, password] = [req.body?.username, req.body?.password];

	if(!username || !password) {
		return res.status(400).json({ error: 'Invalid username or password!'})
	}

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });

    res.status(200).json({ token, username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default authRoute