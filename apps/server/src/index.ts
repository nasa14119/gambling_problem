import express from "express";
const PORT = process.env.SERVER_PORT ?? 3000;

const app = express();

app.get("/", (_, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`express server started in port: http://localhost:${PORT}`);
});
