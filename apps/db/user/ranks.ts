import { exploitsData, ranks, users, whitelist } from "#schemas";
import {
  and,
  asc,
  between,
  eq,
  getTableColumns,
  gt,
  gte,
  lt,
} from "drizzle-orm";
import { db } from "../connection.ts";
import { ExploitData } from "@repo/types/db";
import { ExploitId } from "@repo/types";

export type NextRank = ExploitData & { rank: number; level: number };
type RankPayload = { currentLevel: number; prevRank: number };
export const getRank = async ({
  currentLevel,
  prevRank,
}: RankPayload): Promise<NextRank[] | null> => {
  let val = await db
    .select({
      ...getTableColumns(exploitsData),
      rank: ranks.rankUnlock,
      level: ranks.levelUnlock,
    })
    .from(ranks)
    .where(
      and(gt(ranks.rankUnlock, prevRank), lt(ranks.rankUnlock, currentLevel)),
    )
    .innerJoin(exploitsData, eq(ranks.exploitId, exploitsData.exploitId))
    .orderBy(asc(ranks.rankUnlock));
  const sub = await db
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
  const res = [...val, ...sub];
  if (res.length <= 0) return null;
  return res as NextRank[];
};
export const getUserWhiteList = async (userName: string) => {
  const [{ userUUID }] = await db
    .select()
    .from(users)
    .where(eq(users.username, userName))
    .limit(1);
  if (!userUUID) throw new Error("User not found");
  return (await db
    .select({ ...getTableColumns(exploitsData) })
    .from(whitelist)
    .where(eq(whitelist.userUUID, userUUID))
    .innerJoin(
      exploitsData,
      eq(whitelist.exploitId, exploitsData.exploitId),
    )) as ExploitData[];
};

type UnlockExploit = { exploitId: ExploitId; username: string };
export const saveRank = async ({ exploitId, username }: UnlockExploit) => {
  const [{ userUUID }] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (!userUUID) throw new Error("User not found");
  const existing = await db
    .select()
    .from(whitelist)
    .where(
      and(eq(whitelist.userUUID, userUUID), eq(whitelist.exploitId, exploitId)),
    )
    .limit(1);

  if (existing.length === 0) {
    await db.insert(whitelist).values({
      userUUID,
      exploitId,
    });
  }
};

type GetRandomExploit = { userUUID: string };
export const getRandomFromUnlock = async ({ userUUID }: GetRandomExploit) => {
  const res = await db
    .select({ exploitId: exploitsData.exploitId })
    .from(whitelist)
    .innerJoin(exploitsData, eq(whitelist.exploitId, exploitsData.exploitId))
    .where(eq(whitelist.userUUID, userUUID));
  if (!res || res.length <= 0) return null;
  if (res.length === 1) return res[0].exploitId as ExploitId;
  const randomIndex = Math.floor(Math.random() * res.length);
  return res[randomIndex].exploitId as ExploitId;
};
