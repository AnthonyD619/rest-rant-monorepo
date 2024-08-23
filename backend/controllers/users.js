import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models'; // Adjust the import path as needed

const router = express.Router();

// Define an interface for the request body
interface CreateUserRequest extends Request {
    body: {
        password: string;
        [key: string]: any; // Adjust this if you have a specific shape for your body
    };
}

router.post('/', async (req: CreateUserRequest, res: Response) => {
    const { password, ...rest } = req.body;
    const passwordDigest = await bcrypt.hash(password, 10);

    const user = await User.create({
        ...rest,
        passwordDigest
    });

    res.json(user);
});

router.get('/', async (req: Request, res: Response) => {
    const users = await User.findAll();
    res.json(users);
});

export default router;
