import { Post } from ".prisma/client";
import prisma from "../../../lib/prisma";

// PUT /api/publish/:id
export default async function handle(
  req: { query: { id: any } },
  res: { json: (arg0: Post) => void }
) {
  const postId = req.query.id;
  const post = await prisma.post.update({
    where: { id: Number(postId) },
    data: {
      published: true,
      createdAt: new Date(
        Date.now() - new Date().getTimezoneOffset() * 1000 * 60
      ),
      updatedAt: new Date(
        Date.now() - new Date().getTimezoneOffset() * 1000 * 60
      ),
    },
  });
  res.json(post);
}
