import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
const handle = async (req, res) {
  const { title, content,published } = req.body;

  const session = await getSession({ req });
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      published: published,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}

export default handle;