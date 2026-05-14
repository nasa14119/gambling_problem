import cors from "cors";
import express from "express";
import { wsSever } from "sessions";

const PORT = process.env.SERVER_PORT ?? 3000;
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
  }),
);
wsSever(app);
app.get("/", (_, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`express server started in port: http://localhost:${PORT}`);
});
