import {
  exploitsusedinrunview,
  metadata,
  runs,
  topactiverunsview,
  topexploitsusedplayerrank,
  topexploitsusedrank,
  topexploitsusedview,
  topplayersview,
  toprunsview,
  users,
} from "#schemas";
import { ExploitUsedStats, RunStats } from "@repo/types/db";
import { db } from "../connection.ts";
import { and, desc, eq, sql } from "drizzle-orm";
import { LastRun, UserSummary } from "@repo/types/server";

export const getMostUsedExploits = async (): Promise<
  ExploitUsedStats[] | null
> => {
  try {
    const querry = await db.select().from(topexploitsusedview);
    if (querry.length === 0) return null;
    return querry as ExploitUsedStats[];
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getExploitsUsedRank = async (): Promise<
  ExploitUsedStats[] | null
> => {
  try {
    const querry = await db.select().from(topexploitsusedrank).limit(50);
    if (querry.length === 0) return null;
    return querry as ExploitUsedStats[];
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getBestExploitsUsedPlayerRank = async (): Promise<
  ExploitUsedStats[] | null
> => {
  try {
    const querry = await db.select().from(topexploitsusedplayerrank).limit(50);
    if (querry.length === 0) return null;
    return querry as ExploitUsedStats[];
  } catch (e) {
    console.error(e);
    return null;
  }
};
export const getBestRuns = async (): Promise<RunStats[] | null> => {
  try {
    const querry = await db.select().from(toprunsview).limit(50);
    if (querry.length === 0) return null;
    return querry as RunStats[];
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getBestRunningRuns = async (): Promise<RunStats[] | null> => {
  try {
    const querry = await db.select().from(topactiverunsview).limit(50);
    if (querry.length === 0) return null;
    return querry as RunStats[];
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getPlayersBestRuns = async (): Promise<RunStats[] | null> => {
  try {
    const querry = await db
      .select()
      .from(topplayersview)
      .where(eq(topplayersview.isRunning, 0))
      .limit(50);
    if (querry.length === 0) return null;
    return querry as RunStats[];
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getBestRunUser = async (userUUID: string, isRunning = false) => {
  try {
    const [querry] = await db
      .select({
        runId: runs.runId,
        timePlayed: metadata.durationMinutes,
        moneySpend: runs.moneySpend,
        moneyTotal: runs.moneyTotal,
        earnings: runs.earnings,
      })
      .from(runs)
      .where(
        !isRunning
          ? and(
              eq(runs.userUuid, userUUID),
              eq(runs.isRunning, Number(isRunning)),
            )
          : eq(runs.userUuid, userUUID),
      )
      .innerJoin(metadata, eq(metadata.metadataId, runs.metadataId))
      .orderBy(desc(runs.earnings))
      .limit(1);
    if (!querry) return null;
    const [exploitsUsed] = await db
      .select({ mostUsedExploit: exploitsusedinrunview.exploitName })
      .from(exploitsusedinrunview)
      .where(eq(exploitsusedinrunview.runId, querry.runId))
      .orderBy(desc(exploitsusedinrunview.quantityUsed))
      .limit(1);
    const mostUsedExploit = exploitsUsed?.mostUsedExploit ?? null;
    return { ...querry, mostUsedExploit } as Omit<RunStats, "username">;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getLastStat = async (user: string): Promise<LastRun> => {
  const [res] = await db
    .select({
      exploitsUsed: exploitsusedinrunview.quantityUsed,
      finalScore: runs.earnings,
      moneySpend: runs.moneySpend,
      moneyTotal: runs.moneyTotal,
      typeEnd: metadata.typeEnd,
    })
    .from(runs)
    .innerJoin(metadata, eq(runs.metadataId, metadata.metadataId))
    .leftJoin(
      exploitsusedinrunview,
      eq(exploitsusedinrunview.runId, runs.runId),
    )
    .where(and(eq(runs.userUuid, user), eq(runs.isRunning, 0)))
    .orderBy(desc(runs.runId));
  if (res === null) return null;
  res["exploitsUsed"] = res["exploitsUsed"] ?? 0;
  if (Object.values(res).some((v) => v === null)) {
    return null;
  }
  return res as LastRun;
};

export const getUserSummary = async (
  userUUID: string,
): Promise<UserSummary> => {
  try {
    const [summary] = await db
      .select({
        username: sql<string>`MAX(${users.username})`,
        totalRuns: sql<number>`CAST(COUNT(${runs.runId}) AS UNSIGNED)`,
        totalTimePlayingMinutes: sql<number>`CAST(COALESCE(SUM(${metadata.durationMinutes}), 0) AS UNSIGNED)`,
        totalMoneySpend: sql<number>`COALESCE(SUM(${runs.moneySpend}), 0)`,
        totalMoneyWon: sql<number>`COALESCE(SUM(${runs.moneyTotal}), 0)`,
        totalScore: sql<number>`COALESCE(SUM(${runs.earnings}), 0)`,
      })
      .from(runs)
      .innerJoin(metadata, eq(runs.metadataId, metadata.metadataId))
      .innerJoin(users, eq(runs.userUuid, users.userUuid))
      .where(and(eq(runs.userUuid, userUUID), eq(runs.isRunning, 0)));

    if (!summary || Number(summary.totalRuns) === 0) return null;

    const [exploitSummary] = await db
      .select({
        totalExploitsUsed: sql<number>`CAST(COALESCE(SUM(${exploitsusedinrunview.quantityUsed}), 0) AS UNSIGNED)`,
      })
      .from(runs)
      .innerJoin(
        exploitsusedinrunview,
        eq(exploitsusedinrunview.runId, runs.runId),
      )
      .where(and(eq(runs.userUuid, userUUID), eq(runs.isRunning, 0)));

    return {
      username: String(summary.username),
      totalRuns: Number(summary.totalRuns),
      totalTimePlayingMinutes: Number(summary.totalTimePlayingMinutes),
      totalExploitsUsed: Number(exploitSummary?.totalExploitsUsed ?? 0),
      totalMoneySpend: Number(summary.totalMoneySpend),
      totalMoneyWon: Number(summary.totalMoneyWon),
      totalScore: Number(summary.totalScore),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};
