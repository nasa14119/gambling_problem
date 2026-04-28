import { validate_user_input } from "./user-validator";
import { test, expect } from "vitest";
test("User input empty", () => {
  let value = validate_user_input({});
  expect(value.success).toBe(false);
  value = validate_user_input(null);
  expect(value.success).toBe(false);
  value = validate_user_input(12);
  expect(value.success).toBe(false);
  value = validate_user_input({ user: "algo" });
  expect(value.success).toBe(false);
});
test("Just one is undefined", () => {
  let foo = validate_user_input({ user: "fkafjkañlfaj" });
  expect(foo.success).toBe(false);
  if (foo.success) return;
  expect(foo.error).toHaveProperty("password", "Password is not defined");
  foo = validate_user_input({ password: "fjlkafaljk54$" });
  expect(foo.success).toBe(false);
  if (foo.success) return;
  expect(foo.error).toHaveProperty("user", "User is not defined");
});
test("User not 8 characters", () => {
  let foo = validate_user_input({ user: "A", password: "contraseña123%" });
  expect(foo.success).toBe(false);
  if (foo.success) return;
  expect(foo.error).toHaveProperty("user", "User must be at least 5 caracters");
});
test("Password at leat 8 characters", () => {
  let foo = validate_user_input({ user: "Anastasia", password: "jikeo" });
  expect(foo.success).toBe(false);
  if (foo.success) return;
  expect(foo.error).toHaveProperty(
    "password",
    "Password must be at least 8 caracters",
  );
  expect(foo).not.toHaveProperty("user");
});
test("Password must have special charactres", () => {
  let foo = validate_user_input({
    user: "Anastasia",
    password: "contraseña123",
  });
  expect(foo.success).toBe(false);
  if (foo.success) return;
  expect(foo.error).not.toHaveProperty("user");
  expect(foo.error).toHaveProperty(
    "password",
    "Your password must contain at least one special caracter",
  );
});
test("Valid User", () => {
  let foo = validate_user_input({
    user: "NicolasAmaya",
    password: "pascoND2$%&#",
  });
  expect(foo.success).toBe(true);
  if (!foo.success) return;
  expect(foo.data).toEqual({
    user: "NicolasAmaya",
    password: "pascoND2$%&#",
  });
});
