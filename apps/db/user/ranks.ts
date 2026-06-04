import { exploitsData, ranks, users, whitelist } from "#schemas";
import { asc, eq, getTableColumns, gte } from "drizzle-orm";
import { db } from "../connection.ts";
import { ExploitData } from "@repo/types/db";
import { ExploitId } from "@repo/types";

export type NextRank = ExploitData & { rank: number; level: number };
type RankPayload = { currentLevel: number };
export const getRank = async ({
  currentLevel,
}: RankPayload): Promise<NextRank | null> => {
  const [res] = await db
    .select({
      ...getTableColumns(exploitsData),
      rank: ranks.rankUnlock,
      level: ranks.levelUnlock,
    })
    .from(ranks)
    .innerJoin(exploitsData, eq(ranks.exploitId, exploitsData.exploitId))
    .where(gte(ranks.rankUnlock, currentLevel))
    .orderBy(asc(ranks.rankUnlock))
    .limit(1);
  if (!res) return null;
  return res as NextRank;
};

export const getUserWhiteList = async (userName: string) => {
  const [{ userUUID }] = await db
    .select()
    .from(users)
    .where(eq(users.username, userName))
    .limit(1);
  if (!userUUID) throw new Error("User not found");
  return await db
    .select()
    .from(whitelist)
    .where(eq(whitelist.userUUID, userUUID))
    .innerJoin(exploitsData, eq(whitelist.exploitId, exploitsData.exploitId));
};

type UnlockExploit = { exploitId: ExploitId; username: string };
export const saveRank = async ({ exploitId, username }: UnlockExploit) => {
  const [{ userUUID }] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (!userUUID) throw new Error("User not found");
  await db.insert(whitelist).values({
    userUUID,
    exploitId: exploitId,
  });
};
