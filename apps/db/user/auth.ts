import {
  validate_user_input,
  UserCreationInput,
} from "@repo/validator/user-validator";
import { db } from "../connection.ts";
import { users } from "#schemas";
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
      userUUID: uuid,
      username: user.user,
      password: password,
    });
    return { userUUID: uuid, username: user.user };
  } catch {
    console.log("Error inserting user");
    throw new UserCreation(
      { user: "Error inserting user", password: "Error inserting user" },
      500,
    );
  }
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
  return { userUUID: userDB.userUUID, username: userDB.username };
};

export type UserAuth = {
  userUUID: `${string}-${string}-${string}-${string}-${string}`;
  username: string;
};

export const UserExists = async (user: UserAuth["userUUID"]) => {
  const results = await db
    .select()
    .from(users)
    .where(eq(users.userUUID, user))
    .limit(1);
  return results.length > 0;
};
