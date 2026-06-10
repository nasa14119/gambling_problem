import {
  changePass,
  deleteUser,
  getRunsMetadata,
  getUsersTable,
  type UserAuth,
} from "db";
import { RequestHandler, Router } from "express";

import { getUserFromToken } from "./middleware/auth.ts";

const router = Router();
router.use(getUserFromToken);
const home: RequestHandler = (_, res, next) => {
  if (!res.locals.user) {
    res.redirect("/login");
    return;
  }
  const { permition } = res.locals.user as UserAuth;
  if (permition !== "admin") {
    console.log(res.locals.user);
    res.redirect("/user");
    return;
  }
  next();
};
const validate: RequestHandler = (_, res, next) => {
  if (!res.locals.user || res.locals.user.permition !== "admin") {
    if (res.locals.user !== null) console.log(res.locals.user);
    res.sendStatus(401);
    return;
  }
  next();
};
router.all("/", home);

router.get("/stats", async (_, res) => {
  if (!res.locals.user || res.locals.user.permition !== "admin") {
    res.sendStatus(401);
    return;
  }
  const data = await getRunsMetadata();
  if (!data) {
    res.sendStatus(204);
    return;
  }
  res.send(data);
});

router.put("/change-pass", validate, async (req, res) => {
  const { password, username } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .send({ error: username ? "password undefined" : "user not defined" });
    return;
  }
  try {
    await changePass({ password, username });
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete("/user", validate, async (req, res) => {
  try {
    await deleteUser(req.body.username);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/users", validate, async (_, res) => {
  try {
    const data = await getUsersTable();
    res.send(data);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});
export default router;
