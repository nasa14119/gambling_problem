import { mafia } from "#schemas";
import { eq } from "drizzle-orm";
import { db } from "../connection.ts";

export const getMafiaCredits = async ({ level }: { level: number }) => {
  const [res] = await db
    .select({ credit: mafia.credit, rounds: mafia.rounds })
    .from(mafia)
    .where(eq(mafia.levelCreadit, level))
    .limit(1);
  return res ?? null;
};
