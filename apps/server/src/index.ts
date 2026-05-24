import cors from "cors";
import express from "express";

import env from "./env.ts";

if (env.MODE === "production" && !env.SERVER_PATH) {
  throw new Error("SERVER_PATH is required in production mode");
}
import { wsSever } from "./sessions/index.ts";
import sessionRouter from "./sessions/session.routes.ts";
const PORT = process.env.SERVER_PORT ?? 3000;
const app = express();
app.use(
  cors({
    credentials: true,
    origin: env.SERVER_PATH,
  }),
);
wsSever(app);
app.use(sessionRouter);
app.get("/", (_, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`express server started in port: http://localhost:${PORT}`);
});
