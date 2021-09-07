import { Post } from '.prisma/client';
import prisma from '../../../lib/prisma';

// PUT /api/publish/:id
export default async function handle(req: { query: { id: any; }; }, res: { json: (arg0: Post) => void; }) {
  const postId = req.query.id;
  const post = await prisma.post.update({
    where: { id: Number(postId) },
    data: { published: true },
  });
  res.json(post);
}