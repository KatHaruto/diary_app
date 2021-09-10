import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
const handle = async (req, res) => {
  const { title, content, published, song } = req.body;

  const songExist =
    (await prisma.music.findUnique({
      where: {
        songId: song.id,
      },
    })) === null
      ? false
      : true;

  if (!songExist) {
    await prisma.music.create({
      data: {
        songId: song.id,
        songName: song.name,
        albumID: song.album.id,
        albumName: song.album.name,
        artistID: song.artists.id,
        artistName: song.artists.name,
        imageUrl: song.image_url,
        spotifyUrl: song.spotify_url,
      },
    });
  }

  const session = await getSession({ req });
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      published: published,
      createdAt: new Date(
        Date.now() - new Date().getTimezoneOffset() * 1000 * 60
      ),
      updatedAt: new Date(
        Date.now() - new Date().getTimezoneOffset() * 1000 * 60
      ),
      music: { connect: { songId: song.id } },
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
};

export default handle;
