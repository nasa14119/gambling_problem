import {
  validate_user_input,
  UserCreationInput,
} from "@repo/validator/user-validator";
import { db } from "../connection.ts";
import { autorizedUsers, users } from "#schemas";
import { eq } from "drizzle-orm";
import crp from "argon2";
import { randomUUID } from "node:crypto";

export const userNameExits = async (user: string) => {
  const results = await db
    .select()
    .from(users)
    .where(eq(users.username, user))
    .limit(1);
  return results.length > 0;
};
export abstract class AuthError extends Error {
  abstract user: Partial<UserCreationInput>;
  abstract code: 400 | 500;
}
class UserCreation extends AuthError {
  constructor(
    public user: Partial<UserCreationInput>,
    public code: AuthError["code"] = 400,
  ) {
    super("Error creating user");
  }
}
class PasswordError extends AuthError {
  public code: AuthError["code"] = 400;
  public user = {
    user: "User or password is incorrect",
    password: "User or password is incorrect",
  };
  constructor() {
    super("The password is invalid");
  }
}
function validateInput(user: UserCreationInput) {
  const { success, error } = validate_user_input(user);
  if (!success) {
    throw new UserCreation(error);
  }
}
export const createUser = async (user: UserCreationInput) => {
  validateInput(user);
  if (await userNameExits(user.user)) {
    throw new UserCreation({ user: "User already exists" });
  }
  const password = await crp.hash(user.password).catch(() => {
    throw new UserCreation({ password: "Error hashing password" }, 500);
  });
  const uuid = randomUUID();
  try {
    await db.insert(users).values({
      userUuid: uuid,
      username: user.user,
      password: password,
    });
    return { userUUID: uuid, username: user.user };
  } catch {
    throw new UserCreation(
      { user: "Error inserting user", password: "Error inserting user" },
      500,
    );
  }
};

type ChangePass = { username: string; password: string };
export const changePass = async ({ username, password }: ChangePass) => {
  const encripted = await crp.hash(password).catch(() => {
    throw new UserCreation({ password: "Error hashing password" }, 500);
  });
  await db
    .update(users)
    .set({ password: encripted })
    .where(eq(users.username, username));
};

export const loginUser = async (user: UserCreationInput) => {
  validateInput(user);
  const results = await db
    .select()
    .from(users)
    .where(eq(users.username, user.user));
  if (results.length <= 0) {
    return await createUser(user);
  }
  const userDB = results[0];
  const isOk = await crp.verify(userDB.password, user.password);
  if (!isOk) {
    throw new PasswordError();
  }
  const permition = (await isAdmin(userDB.userUuid)) ? "admin" : "user";
  return {
    userUUID: userDB.userUuid,
    username: userDB.username,
    permition: permition,
  } as UserAuth;
};

export type UserAuth = {
  userUUID: `${string}-${string}-${string}-${string}-${string}`;
  username: string;
  permition: string;
};

export const UserExists = async (user: UserAuth["userUUID"]) => {
  const results = await db
    .select()
    .from(users)
    .where(eq(users.userUuid, user))
    .limit(1);
  return results.length > 0;
};

export const isAdmin = async (user: string) => {
  const items = await db
    .select()
    .from(autorizedUsers)
    .where(eq(autorizedUsers.userUuid, user));
  return items.length > 0;
};

export const deleteUser = async (user: string) => {
  if (typeof user !== "string")
    throw new Error(`Recibed ${user} of type ${typeof user} expected string`);
  await db.delete(users).where(eq(users.username, user));
};

export const getUsersTable = async () => {
  return await db.select().from(users);
};
