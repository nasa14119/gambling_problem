import {
  exploitsusedinrunview,
  metadata,
  runs,
  top50Playersview,
  topexploitsusedview,
} from "#schemas";
import { ExploitUsedStats, RunStats } from "@repo/types/db";
import { db } from "../connection.ts";
import { desc, eq } from "drizzle-orm";

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

export const getBestRuns = async (): Promise<RunStats[] | null> => {
  try {
    const querry = await db.select().from(top50Playersview);
    if (querry.length === 0) return null;
    return querry as RunStats[];
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getBestRunUser = async (userUUID: string) => {
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
      .where(eq(runs.userUuid, userUUID))
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
