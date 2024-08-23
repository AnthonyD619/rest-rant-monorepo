import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models'; // Make sure this import matches your models' setup

const router: Router = express.Router();

interface SessionData {
  userId?: number; // or string, depending on your userId type
}

interface CustomRequest extends Request {
  session: SessionData;
}

router.post('/', async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
      res.status(404).json({
        message: `Could not find a user with the provided username and password`
      });
    } else {
      req.session.userId = user.userId;
      res.json({ user });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

router.get('/profile', async (req: CustomRequest, res: Response) => {
  console.log(req.session.userId);
  try {
    const user = await User.findOne({
      where: {
        userId: req.session.userId
      }
    });
    res.json(user || null);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

export default router;
