import { createCanvas, Image, loadImage } from "canvas";

export default async (req, res) => {
  const { columns, rows, collages } = req.body;
  const canvas = createCanvas(480 * columns, 480 * rows);
  const ctx = canvas.getContext("2d");
  for (let i = 0; i < columns * rows; i++) {
    console.log("now, " + i + "( " + columns + "," + rows + " )");
    console.log(collages[i]);
    if (!collages[i].url) {
      continue;
    }
    await loadImage(collages[i].url)
      .then((image) => {
        console.log(image);
        ctx.drawImage(
          image,
          (i % columns) * 480,
          Math.floor(i / columns) * 480,
          480,
          480
        );
      })
      .catch((e) => {
        console.log(e);
      });
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
