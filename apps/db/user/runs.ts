import { running, runs, users, metadata } from "#schemas";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "../connection.ts";
import { RunDataGame } from "@repo/types/db";
import { SavedGame } from "core/types";

export const startNewRun = async (userUUID: string) => {
  const [res] = await db
    .insert(runs)
    .values({
      userUUID: userUUID,
    })
    .$returningId();
  return res.runId;
};

export const setRunSession = async (runId: number, sessionId: string) => {
  if (typeof runId !== "number" || Number.isNaN(runId))
    throw new Error("RunId not a number");
  try {
    await db
      .update(running)
      .set({
        sessionID: sessionId.replace("user:", ""),
      })
      .where(eq(running.runId, runId));
  } catch (e) {
    console.log(e);
    throw new Error("Error saving session id");
  }
};

export const terminateSession = async (sessionId: string) => {
  try {
    await db.execute(sql`
        CALL killSession(${sessionId.replace("user:", "")}); 
      `);
  } catch {
    throw new Error("Error killing session");
  }
};
export const updateRun = async (runId: number, data: RunDataGame) => {
  if (typeof runId !== "number" || Number.isNaN(runId))
    throw new Error("RunId not a number");
  try {
    await db.transaction(async (t) => {
      await t.execute(sql`
        UPDATE Runs r 
        SET 
          r.moneyTotal = ${data.moneyTotal},
          r.moneySpend = ${data.moneySpend}, 
          r.isRunning = FALSE
        WHERE r.runID = ${runId};
    `);
      await t.execute(sql`
      UPDATE Metadata m
      INNER JOIN Runs r
      USING (metadataID)
      SET 
        m.typeEnd = ${data.typeEnd},
        m.level = ${data.level}, 
        m.endedAt = CURRENT_TIMESTAMP
      WHERE r.runID = ${runId}; 
    `);
    });
  } catch (e) {
    console.error(e);
    throw new Error("Error updating run");
  }
};

type SaveSessionPayload = { sessionId: string; data: SavedGame };
export const saveSession = async ({ sessionId, data }: SaveSessionPayload) => {
  try {
    await db
      .update(running)
      .set({ data })
      .where(eq(running.sessionID, sessionId));
    await terminateSession(sessionId);
  } catch (e) {
    console.error(e);
  }
};

export const getCurrentRun = async (userUUID: string) => {
  const result = await db
    .select({
      runId: runs.runId,
      userUUID: runs.userUUID,
      username: users.username,
      moneyTotal: runs.moneyTotal,
      moneySpend: runs.moneySpend,
      earnings: runs.earnings,
      lastSavedAt: metadata.lastSavedAt,
      isRunning: runs.isRunning,
      sessionId: running.sessionID,
      data: running.data,
    })
    .from(runs)
    .innerJoin(users, eq(users.userUUID, runs.userUUID))
    .leftJoin(metadata, eq(metadata.metadataId, runs.metadataId))
    .leftJoin(running, eq(running.runId, runs.runId))
    .where(eq(runs.userUUID, userUUID))
    .orderBy(desc(metadata.startedAt), desc(runs.runId))
    .limit(1);

  return result[0] ?? null;
};

export const clearSession = async (sessionId: string) => {
  await db
    .update(running)
    .set({ sessionID: null })
    .where(eq(running.sessionID, sessionId));
};
