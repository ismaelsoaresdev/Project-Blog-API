import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

// GET comments for a post (Public)
router.get('/', async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(postId) },
            orderBy: { createdAt: 'desc' }
        });
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST a comment (Public - no token required)
router.post('/', async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, name } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Comment content is required' });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                name: name || 'Anonymous',
                postId: parseInt(postId)
            }
        });

        res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;