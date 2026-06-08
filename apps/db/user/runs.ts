import { running, runs, users, metadata, exploitsUsed } from "#schemas";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "../connection.ts";
import { RunDataGame } from "@repo/types/db";
import type { SavedGame } from "@repo/types/server";
export const startNewRun = async (userUuid: string) => {
  const [res] = await db
    .insert(runs)
    .values({
      userUuid: userUuid,
    })
    .$returningId();
  return res.runId;
};

export const setRunSession = async (runId: number, sessionId: string) => {
  if (typeof runId !== "number" || Number.isNaN(runId))
    throw new Error("RunId not a number");
  const updating = sessionId.replace(/^user:/, "");
  try {
    await db
      .update(running)
      .set({
        sessionId: updating,
      })
      .where(eq(running.runId, runId));
  } catch (e) {
    console.log(e);
    throw new Error("Error saving session id");
  }
};

export const terminateGame = async (userUuid: string) => {
  try {
    await db.execute(sql`
      UPDATE Runs r
      INNER JOIN Metadata m
        USING (metadataId)
      SET
        m.typeEnd = 'TERMINATED',
        m.endedAt = CURRENT_TIMESTAMP,
        r.isRunning = FALSE
      WHERE r.userUuid = ${userUuid}
        AND r.isRunning = TRUE
  `);
  } catch (e) {
    console.log(e);
    throw new Error("Error killing saved game");
  }
};

export const updateSessionStart = async (runId: number) => {
  try {
    await db.execute(sql`
      UPDATE Runs r 
      INNER JOIN Metadata m
      USING (metadataId)
      SET 
      m.lastSavedAt = CURRENT_TIMESTAMP
      WHERE r.runId = ${runId}
      `);
  } catch {
    throw new Error("Error updating session start");
  }
};
export const terminateSession = async (sessionId: string) => {
  const updating = sessionId.replace(/^user:/, "");
  try {
    await db.execute(sql`
        CALL killSession(${updating}); 
      `);
  } catch {
    throw new Error("Error killing session");
  }
};
export const saveAndTerminateRun = async (runId: number, data: RunDataGame) => {
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
        WHERE r.runId = ${runId};
    `);
      await t.execute(sql`
      UPDATE Metadata m
      INNER JOIN Runs r
      USING (metadataID)
      SET 
        m.typeEnd = ${data.typeEnd},
        m.level = ${data.level}, 
        m.endedAt = CURRENT_TIMESTAMP
      WHERE r.runId = ${runId}; 
    `);
    });
  } catch (e) {
    console.error(e);
    throw new Error("Error updating run");
  }
};

type SaveSessionPayload = { sessionId: string; data: SavedGame };
export const saveSession = async ({ sessionId, data }: SaveSessionPayload) => {
  const updating = sessionId.replace(/^user:/, "");
  try {
    const [{ runId }] = await db
      .select({ runId: running.runId })
      .from(running)
      .where(eq(running.sessionId, updating));
    if (!runId) throw new Error("No runId");
    await terminateSession(sessionId);
    await updateSessionStart(runId);
    await db.update(running).set({ data }).where(eq(running.runId, runId));
  } catch (e) {
    console.error(e);
  }
};

export const getCurrentRun = async (userUuid: string) => {
  const result = await db
    .select({
      runId: runs.runId,
      userUuid: runs.userUuid,
      username: users.username,
      moneyTotal: runs.moneyTotal,
      moneySpend: runs.moneySpend,
      earnings: runs.earnings,
      lastSavedAt: metadata.lastSavedAt,
      isRunning: runs.isRunning,
      sessionId: running.sessionId,
      data: running.data,
    })
    .from(runs)
    .innerJoin(users, eq(users.userUuid, runs.userUuid))
    .leftJoin(metadata, eq(metadata.metadataId, runs.metadataId))
    .leftJoin(running, eq(running.runId, runs.runId))
    .where(eq(runs.userUuid, userUuid))
    .orderBy(desc(metadata.startedAt), desc(runs.runId))
    .limit(1);

  return result[0] ?? null;
};

export const clearSession = async (sessionId: string) => {
  const updating = sessionId.replace(/^user:/, "");
  await db
    .update(running)
    .set({ sessionId: null })
    .where(eq(running.sessionId, updating));
};

export const updateRun = async (
  runId: number,
  data: Omit<RunDataGame, "typeEnd">,
) => {
  if (typeof runId !== "number" || Number.isNaN(runId))
    throw new Error("RunId not a number");
  try {
    await db.execute(sql`
        UPDATE Runs r 
        JOIN Metadata m
          USING (metadataID)
        SET 
          r.moneyTotal = ${data.moneyTotal},
          r.moneySpend = ${data.moneySpend}, 
          m.level = ${data.level}
        WHERE r.runId = ${runId};
    `);
  } catch (e) {
    console.error(e);
    throw new Error("Error updating run");
  }
};

export const useExploit = async (runId: number, exploitID: string) => {
  try {
    await db.insert(exploitsUsed).values({
      exploitId: exploitID,
      runId: runId,
    });
  } catch (e) {
    console.error(e);
    throw new Error("Error adding exploit used");
  }
};

type SoftSafePayload = {
  runId: string;
  data: SavedGame;
  moneyTotal: number;
  moneySpend: number;
  level: number;
};
export const softSafe = async ({
  runId,
  data,
  moneyTotal,
  moneySpend,
  level,
}: SoftSafePayload) => {
  const id = Number(runId);
  if (!Number.isFinite(id)) throw new Error("RunId not a number");
  try {
    await db.transaction(async (t) => {
      await t
        .update(runs)
        .set({ moneyTotal, moneySpend })
        .where(eq(runs.runId, id));
      await t
        .update(metadata)
        .set({ level })
        .where(eq(metadata.metadataId, id));
      await t.update(running).set({ data }).where(eq(running.runId, id));
    });
  } catch (e) {
    console.log(e);
    throw new Error("Error killing saved game");
  }
};
