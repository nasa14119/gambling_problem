import { running, runs } from "#schemas";
import { eq, sql } from "drizzle-orm";
import { db } from "../connection.ts";
import { RunDataGame } from "@repo/types/db";

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
        m.level = ${data.level}
      WHERE r.runID = ${runId}; 
    `);
    });
  } catch (e) {
    console.error(e);
    throw new Error("Error updating run");
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
