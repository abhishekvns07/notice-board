import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          {
            priority: 'desc', // 'Urgent' > 'Normal' so 'desc' puts Urgent first
          },
          {
            publishDate: 'desc',
          },
        ],
      });
      return res.status(200).json(notices);
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to fetch notices', details: String(error?.message || error) });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, body, category, priority, publishDate, imageUrl } = req.body;

      if (!title || !body || !category || !priority || !publishDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const parsedDate = new Date(publishDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const notice = await prisma.notice.create({
        data: {
          title,
          body,
          category,
          priority,
          publishDate: parsedDate,
          imageUrl: imageUrl || null,
        },
      });
      return res.status(201).json(notice);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create notice' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
