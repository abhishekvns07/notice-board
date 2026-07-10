import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({
        where: { id },
      });
      if (!notice) return res.status(404).json({ error: 'Notice not found' });
      return res.status(200).json(notice);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch notice' });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const { title, body, category, priority, publishDate, imageUrl } = req.body;

      if (!title || !body || !category || !priority || !publishDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const parsedDate = new Date(publishDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const notice = await prisma.notice.update({
        where: { id },
        data: {
          title,
          body,
          category,
          priority,
          publishDate: parsedDate,
          imageUrl: imageUrl || null,
        },
      });
      return res.status(200).json(notice);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update notice' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.notice.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete notice' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
