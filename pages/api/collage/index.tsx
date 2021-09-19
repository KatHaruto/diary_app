import { createCanvas, Image, loadImage } from "canvas";

export default async (req, res) => {
  const { columns, rows, collages } = req.body;
  const canvas = createCanvas(640 * columns, 640 * rows);
  const ctx = canvas.getContext("2d");
  for (let i = 0; i < columns * rows; i++) {
    if (!collages[i].url) {
      continue;
    } else {
      await loadImage(collages[i].url)
        .then((image) => {
          ctx.drawImage(
            image,
            (i % columns) * 640,
            Math.floor(i / rows) * 640,
            640,
            640
          );
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  const buf = canvas.toBuffer("image/jpeg");
  const cacheAge = 7 * 24 * 60;
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Length", buf.length);
  res.setHeader("Cache-Control", `public, max-age=${cacheAge}`);
  res.setHeader("Expires", new Date(Date.now() + cacheAge).toUTCString());
  res.status(200).end(buf);
};
