import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../services/databaseService.js';

const router = express.Router();


router.get('/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

router.post('/users', async (req, res) => {
    try {
        const userData = req.body;
        const userId = await createUser(userData);
        res.status(201).json({ message: 'User created', userId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        const modifiedCount = await updateUser(userId, updateData);
        if (modifiedCount === 0) {
            return res.status(404).json({ error: 'User not found or no changes made' });
        }
        res.status(200).json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedCount = await deleteUser(userId);
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;
