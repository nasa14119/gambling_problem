import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import authRouter from "./auth.ts";
import env from "./env.ts";
import sessionRouter from "./sessions/session.routes.ts";
import statsRouter from "./stats.ts";

if (env.MODE === "production" && !env.SERVER_PATH) {
  throw new Error("SERVER_PATH is required in production mode");
}
import { wsSever } from "./sessions/index.ts";
const PORT = process.env.SERVER_PORT ?? 3000;
const app = express();

// app level middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: env.SERVER_PATH,
  }),
);
// web socket server
wsSever(app);

// api routes / routers
app.use("/api", sessionRouter);
app.use("/api", authRouter);
app.use("/api/stats", statsRouter);

// Health check
app.get("/", (_, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`express server started in port: http://localhost:${PORT}`);
});
