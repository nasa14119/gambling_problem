import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  varchar,
  decimal,
  text,
  index,
  foreignKey,
  int,
  mysqlEnum,
  timestamp,
  bigint,
  json,
  tinyint,
  char,
  unique,
  mysqlView,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const exploitsData = mysqlTable(
  "ExploitsData",
  {
    exploitId: varchar({ length: 30 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    price: decimal({ precision: 10, scale: 2, mode: "number" }).notNull(),
    type: varchar({ length: 20 }).notNull(),
    description: text().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.exploitId], name: "ExploitsData_exploitID" }),
  ],
);

export const exploitsUsed = mysqlTable(
  "ExploitsUsed",
  {
    runId: int()
      .notNull()
      .references(() => runs.runId, { onDelete: "cascade" }),
    exploitId: varchar({ length: 30 })
      .notNull()
      .references(() => exploitsData.exploitId, { onDelete: "cascade" }),
    username: varchar({ length: 50 }).references(() => users.username, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("runID").on(table.runId),
    index("exploitID").on(table.exploitId),
    index("username").on(table.username),
  ],
);

export const mafia = mysqlTable(
  "Mafia",
  {
    levelCreadit: int("level_creadit").notNull(),
    credit: int().notNull(),
    rounds: int().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.levelCreadit], name: "Mafia_level_creadit" }),
  ],
);

export const metadata = mysqlTable(
  "Metadata",
  {
    metadataId: int().autoincrement().notNull(),
    typeEnd: mysqlEnum(["WIN", "BANKRUPT", "TERMINATED", "DEATH"]),
    level: int(),
    startedAt: timestamp({ mode: "string" }).defaultNow(),
    endedAt: timestamp({ mode: "string" }),
    lastSavedAt: timestamp({ mode: "string" }),
    durationMinutes: bigint({ mode: "number" }),
  },
  (table) => [
    primaryKey({ columns: [table.metadataId], name: "Metadata_metadataID" }),
  ],
);

export const ranks = mysqlTable(
  "Ranks",
  {
    rankUnlock: int().notNull(),
    exploitId: varchar({ length: 30 })
      .notNull()
      .references(() => exploitsData.exploitId, { onDelete: "cascade" }),
    levelUnlock: int().notNull(),
  },
  (table) => [
    index("exploitID").on(table.exploitId),
    primaryKey({ columns: [table.rankUnlock], name: "Ranks_rankUnlock" }),
  ],
);

export const running = mysqlTable(
  "Running",
  {
    runId: int()
      .notNull()
      .references(() => runs.runId, { onDelete: "cascade" }),
    data: json(),
    sessionId: varchar({ length: 100 }),
    slot: tinyint({ unsigned: true }).default(1),
  },
  (table) => [primaryKey({ columns: [table.runId], name: "Running_runID" })],
);

export const runs = mysqlTable(
  "Runs",
  {
    runId: int().autoincrement().notNull().primaryKey(),
    userUuid: char({ length: 36 })
      .notNull()
      .references(() => users.userUuid, { onDelete: "cascade" }),
    moneyTotal: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
    moneySpend: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
    earnings: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
    isRunning: tinyint().default(1),
    metadataId: int().references(() => metadata.metadataId),
  },
  (table) => [primaryKey({ columns: [table.runId], name: "Runs_runID" })],
);

export const users = mysqlTable(
  "Users",
  {
    userUuid: char({ length: 36 }).notNull(),
    username: varchar({ length: 50 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userUuid], name: "Users_userUUID" }),
    unique("username").on(table.username),
  ],
);

export const whitelist = mysqlTable(
  "Whitelist",
  {
    userUuid: char({ length: 36 })
      .notNull()
      .references(() => users.userUuid, { onDelete: "cascade" }),
    exploitId: varchar({ length: 30 })
      .notNull()
      .references(() => exploitsData.exploitId, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.userUuid, table.exploitId],
      name: "Whitelist_userUUID_exploitID",
    }),
  ],
);
export const best50Activerunsview = mysqlView("best50activerunsview", {
  runId: int().default(0).notNull(),
  userUuid: char({ length: 36 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  moneyTotal: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
  moneySpend: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
  earnings: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
  startedAt: timestamp({ mode: "string" }).defaultNow(),
  lastSavedAt: timestamp({ mode: "string" }),
  activeSeconds: bigint({ mode: "number" }),
  sessionId: varchar({ length: 100 }),
  data: json(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`r\`.\`runID\` AS \`runId\`,\`r\`.\`userUUID\` AS \`userUuid\`,\`u\`.\`username\` AS \`username\`,\`r\`.\`moneyTotal\` AS \`moneyTotal\`,\`r\`.\`moneySpend\` AS \`moneySpend\`,\`r\`.\`earnings\` AS \`earnings\`,\`m\`.\`startedAt\` AS \`startedAt\`,\`m\`.\`lastSavedAt\` AS \`lastSavedAt\`,timestampdiff(SECOND,\`m\`.\`startedAt\`,now()) AS \`activeSeconds\`,\`ru\`.\`sessionID\` AS \`sessionID\`,\`ru\`.\`data\` AS \`data\` from (((\`gambling-problem\`.\`runs\` \`r\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUUID\` = \`r\`.\`userUUID\`))) left join \`gambling-problem\`.\`metadata\` \`m\` on((\`m\`.\`metadataID\` = \`r\`.\`metadataID\`))) left join \`gambling-problem\`.\`running\` \`ru\` on((\`ru\`.\`runID\` = \`r\`.\`runID\`))) where (\`r\`.\`isRunning\` = true) order by \`r\`.\`earnings\` desc,\`r\`.\`moneyTotal\` desc,\`r\`.\`runID\` limit 50`,
  );

export const exploitsusedinrunview = mysqlView("exploitsusedinrunview", {
  runId: int().default(0),
  exploitId: varchar({ length: 30 }).notNull(),
  exploitName: varchar("exploit_name", { length: 100 }).notNull(),
  quantityUsed: bigint("quantity_used", { mode: "number" }).notNull(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`r\`.\`runID\` AS \`runId\`,\`e\`.\`exploitID\` AS \`exploitID\`,\`e\`.\`name\` AS \`exploit_name\`,count(\`eu\`.\`exploitID\`) AS \`quantity_used\` from ((\`gambling-problem\`.\`exploitsdata\` \`e\` left join \`gambling-problem\`.\`exploitsused\` \`eu\` on((\`e\`.\`exploitID\` = \`eu\`.\`exploitID\`))) left join \`gambling-problem\`.\`runs\` \`r\` on((\`eu\`.\`runID\` = \`r\`.\`runID\`))) group by \`e\`.\`exploitID\`,\`e\`.\`name\`,\`r\`.\`runID\` order by \`r\`.\`runID\`,\`quantity_used\` desc`,
  );

export const top50Playersview = mysqlView("top50playersview", {
  runId: int().default(0).notNull(),
  username: varchar({ length: 50 }).notNull(),
  timePlayed: bigint({ mode: "number" }),
  moneyTotal: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
  moneySpend: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
  earnings: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
  mostUsedExploit: varchar({ length: 100 }),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`r\`.\`runID\` AS \`runId\`,\`u\`.\`username\` AS \`username\`,\`m\`.\`durationMinutes\` AS \`timePlayed\`,\`r\`.\`moneyTotal\` AS \`moneyTotal\`,\`r\`.\`moneySpend\` AS \`moneySpend\`,\`r\`.\`earnings\` AS \`earnings\`,(select \`gambling-problem\`.\`ev\`.\`exploit_name\` from \`gambling-problem\`.\`exploitsusedinrunview\` \`ev\` where ((\`gambling-problem\`.\`ev\`.\`runId\` = \`r\`.\`runID\`) and (\`gambling-problem\`.\`ev\`.\`quantity_used\` > 0)) order by \`gambling-problem\`.\`ev\`.\`quantity_used\` desc,\`gambling-problem\`.\`ev\`.\`exploit_name\` limit 1) AS \`mostUsedExploit\` from (((\`gambling-problem\`.\`runs\` \`r\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUUID\` = \`r\`.\`userUUID\`))) left join \`gambling-problem\`.\`metadata\` \`m\` on((\`m\`.\`metadataID\` = \`r\`.\`metadataID\`))) join (select \`gambling-problem\`.\`runs\`.\`userUUID\` AS \`userUuid\`,max(\`gambling-problem\`.\`runs\`.\`earnings\`) AS \`max_earning\` from \`gambling-problem\`.\`runs\` where (\`gambling-problem\`.\`runs\`.\`isRunning\` = false) group by \`gambling-problem\`.\`runs\`.\`userUUID\`) \`BestRuns\` on(((\`r\`.\`userUUID\` = \`bestruns\`.\`userUuid\`) and (\`r\`.\`earnings\` = \`bestruns\`.\`max_earning\`)))) order by \`r\`.\`earnings\` desc limit 50`,
  );

export const topexploitsusedview = mysqlView("topexploitsusedview", {
  exploitId: varchar({ length: 30 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  type: varchar({ length: 20 }).notNull(),
  price: decimal({ precision: 10, scale: 2, mode: "number" }).notNull(),
  totalUsed: bigint({ mode: "number" }).notNull(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`e\`.\`exploitID\` AS \`exploitID\`,\`e\`.\`name\` AS \`name\`,\`e\`.\`type\` AS \`type\`,\`e\`.\`price\` AS \`price\`,count(\`e\`.\`exploitID\`) AS \`totalUsed\` from (\`gambling-problem\`.\`exploitsdata\` \`e\` left join \`gambling-problem\`.\`exploitsused\` \`eu\` on((\`eu\`.\`exploitID\` = \`e\`.\`exploitID\`))) group by \`e\`.\`exploitID\`,\`e\`.\`name\`,\`e\`.\`type\`,\`e\`.\`price\` order by \`totalUsed\` desc`,
  );

export const userrunsmetadataview = mysqlView("userrunsmetadataview", {
  runId: int().default(0).notNull(),
  userUuid: char({ length: 36 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  moneyTotal: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
  moneySpend: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
  earnings: decimal({ precision: 10, scale: 2, mode: "number" }).default(0),
  isRunning: tinyint().default(1),
  typeEnd: mysqlEnum(["WIN", "BANKRUPT", "TERMINATED", "DEATH"]),
  level: int(),
  durationMinutes: bigint({ mode: "number" }),
  startedAt: timestamp({ mode: "string" }).defaultNow(),
  endedAt: timestamp({ mode: "string" }),
  lastSavedAt: timestamp({ mode: "string" }),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`r\`.\`runID\` AS \`runId\`,\`r\`.\`userUUID\` AS \`userUuid\`,\`u\`.\`username\` AS \`username\`,\`r\`.\`moneyTotal\` AS \`moneyTotal\`,\`r\`.\`moneySpend\` AS \`moneySpend\`,\`r\`.\`earnings\` AS \`earnings\`,\`r\`.\`isRunning\` AS \`isRunning\`,\`m\`.\`typeEnd\` AS \`typeEnd\`,\`m\`.\`level\` AS \`level\`,\`m\`.\`durationMinutes\` AS \`durationMinutes\`,\`m\`.\`startedAt\` AS \`startedAt\`,\`m\`.\`endedAt\` AS \`endedAt\`,\`m\`.\`lastSavedAt\` AS \`lastSavedAt\` from ((\`gambling-problem\`.\`runs\` \`r\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUUID\` = \`r\`.\`userUUID\`))) left join \`gambling-problem\`.\`metadata\` \`m\` on((\`m\`.\`metadataID\` = \`r\`.\`metadataID\`)))`,
  );

export const userunlockedexploitsview = mysqlView("userunlockedexploitsview", {
  userUuid: char({ length: 36 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  exploitId: varchar({ length: 30 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  type: varchar({ length: 20 }).notNull(),
  price: decimal({ precision: 10, scale: 2, mode: "number" }).notNull(),
  description: text().notNull(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`w\`.\`userUUID\` AS \`userUuid\`,\`u\`.\`username\` AS \`username\`,\`w\`.\`exploitID\` AS \`exploitID\`,\`e\`.\`name\` AS \`name\`,\`e\`.\`type\` AS \`type\`,\`e\`.\`price\` AS \`price\`,\`e\`.\`description\` AS \`description\` from ((\`gambling-problem\`.\`whitelist\` \`w\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUUID\` = \`w\`.\`userUUID\`))) join \`gambling-problem\`.\`exploitsdata\` \`e\` on((\`e\`.\`exploitID\` = \`w\`.\`exploitID\`)))`,
  );
