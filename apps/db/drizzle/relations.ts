import { relations } from "drizzle-orm/relations";
import { runs, exploitsUsed, exploitsData, ranks, running, metadata, users, whitelist } from "./schema";

export const exploitsUsedRelations = relations(exploitsUsed, ({one}) => ({
	run: one(runs, {
		fields: [exploitsUsed.runId],
		references: [runs.runId]
	}),
	exploitsDatum: one(exploitsData, {
		fields: [exploitsUsed.exploitId],
		references: [exploitsData.exploitId]
	}),
}));

export const runsRelations = relations(runs, ({one, many}) => ({
	exploitsUseds: many(exploitsUsed),
	runnings: many(running),
	metadatum: one(metadata, {
		fields: [runs.metadataId],
		references: [metadata.metadataId]
	}),
	user: one(users, {
		fields: [runs.userUuid],
		references: [users.userUuid]
	}),
}));

export const exploitsDataRelations = relations(exploitsData, ({many}) => ({
	exploitsUseds: many(exploitsUsed),
	ranks: many(ranks),
	whitelists: many(whitelist),
}));

export const ranksRelations = relations(ranks, ({one}) => ({
	exploitsDatum: one(exploitsData, {
		fields: [ranks.exploitId],
		references: [exploitsData.exploitId]
	}),
}));

export const runningRelations = relations(running, ({one}) => ({
	run: one(runs, {
		fields: [running.runId],
		references: [runs.runId]
	}),
}));

export const metadataRelations = relations(metadata, ({many}) => ({
	runs: many(runs),
}));

export const usersRelations = relations(users, ({many}) => ({
	runs: many(runs),
	whitelists: many(whitelist),
}));

export const whitelistRelations = relations(whitelist, ({one}) => ({
	exploitsDatum: one(exploitsData, {
		fields: [whitelist.exploitId],
		references: [exploitsData.exploitId]
	}),
	user: one(users, {
		fields: [whitelist.userUuid],
		references: [users.userUuid]
	}),
}));