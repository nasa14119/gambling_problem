import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  varchar,
  float,
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
    price: float().notNull(),
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
  },
  (table) => [
    index("runId").on(table.runId),
    index("exploitID").on(table.exploitId),
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
    rankUnlock: int().notNull().primaryKey(),
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
  (table) => [primaryKey({ columns: [table.runId], name: "Running_runId" })],
);

export const runs = mysqlTable(
  "Runs",
  {
    runId: int().autoincrement().notNull().primaryKey(),
    userUuid: char({ length: 36 })
      .notNull()
      .references(() => users.userUuid, { onDelete: "cascade" }),
    moneyTotal: float(),
    moneySpend: float(),
    earnings: float(),
    isRunning: tinyint().default(1),
    metadataId: int().references(() => metadata.metadataId),
  },
  (table) => [primaryKey({ columns: [table.runId], name: "Runs_runId" })],
);

export const users = mysqlTable(
  "Users",
  {
    userUuid: char({ length: 36 }).notNull(),
    username: varchar({ length: 50 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userUuid], name: "Users_userUuid" }),
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
      name: "Whitelist_userUuid_exploitID",
    }),
  ],
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
    sql`select \`r\`.\`runId\` AS \`runId\`,\`e\`.\`exploitID\` AS \`exploitID\`,\`e\`.\`name\` AS \`exploit_name\`,count(\`eu\`.\`exploitID\`) AS \`quantity_used\` from ((\`gambling-problem\`.\`exploitsdata\` \`e\` left join \`gambling-problem\`.\`exploitsused\` \`eu\` on((\`e\`.\`exploitID\` = \`eu\`.\`exploitID\`))) left join \`gambling-problem\`.\`runs\` \`r\` on((\`eu\`.\`runId\` = \`r\`.\`runId\`))) group by \`e\`.\`exploitID\`,\`e\`.\`name\`,\`r\`.\`runId\` order by \`r\`.\`runId\`,\`quantity_used\` desc`,
  );

export const topactiverunsview = mysqlView("topactiverunsview", {
  runId: int().default(0).notNull(),
  username: varchar({ length: 50 }).notNull(),
  timePlayed: bigint({ mode: "number" }),
  moneyTotal: float(),
  moneySpend: float(),
  earnings: float(),
  mostUsedExploit: varchar({ length: 100 }),
  metadataId: int(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`r\`.\`runId\` AS \`runId\`,\`u\`.\`username\` AS \`username\`,\`m\`.\`durationMinutes\` AS \`timePlayed\`,\`r\`.\`moneyTotal\` AS \`moneyTotal\`,\`r\`.\`moneySpend\` AS \`moneySpend\`,\`r\`.\`earnings\` AS \`earnings\`,(select \`gambling-problem\`.\`ev\`.\`exploit_name\` from \`gambling-problem\`.\`exploitsusedinrunview\` \`ev\` where ((\`gambling-problem\`.\`ev\`.\`runId\` = \`r\`.\`runId\`) and (\`gambling-problem\`.\`ev\`.\`quantity_used\` > 0)) order by \`gambling-problem\`.\`ev\`.\`quantity_used\` desc,\`gambling-problem\`.\`ev\`.\`exploit_name\` limit 1) AS \`mostUsedExploit\`,\`r\`.\`metadataID\` AS \`metadataID\` from ((\`gambling-problem\`.\`runs\` \`r\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUuid\` = \`r\`.\`userUuid\`))) left join \`gambling-problem\`.\`metadata\` \`m\` on((\`m\`.\`metadataID\` = \`r\`.\`metadataID\`))) where (\`r\`.\`isRunning\` = true) order by \`r\`.\`earnings\` desc`,
  );

export const topexploitsusedplayerrank = mysqlView(
  "topexploitsusedplayerrank",
  {
    exploitId: varchar({ length: 30 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    price: float().notNull(),
    type: varchar({ length: 20 }).notNull(),
    description: text().notNull(),
    totalUsed: bigint({ mode: "number" }).notNull(),
  },
)
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`e\`.\`exploitID\` AS \`exploitID\`,\`e\`.\`name\` AS \`name\`,\`e\`.\`price\` AS \`price\`,\`e\`.\`type\` AS \`type\`,\`e\`.\`description\` AS \`description\`,count(\`gambling-problem\`.\`r\`.\`runId\`) AS \`totalUsed\` from ((\`gambling-problem\`.\`exploitsdata\` \`e\` left join \`gambling-problem\`.\`exploitsusedinrunview\` \`eu\` on((\`gambling-problem\`.\`eu\`.\`exploitID\` = \`e\`.\`exploitID\`))) join \`gambling-problem\`.\`topplayersview\` \`r\` on((\`gambling-problem\`.\`eu\`.\`runId\` = \`gambling-problem\`.\`r\`.\`runId\`))) group by \`e\`.\`exploitID\`,\`e\`.\`name\`,\`e\`.\`type\`,\`e\`.\`price\`,\`e\`.\`description\``,
  );

export const topexploitsusedrank = mysqlView("topexploitsusedrank", {
  exploitId: varchar({ length: 30 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  price: float().notNull(),
  type: varchar({ length: 20 }).notNull(),
  description: text().notNull(),
  totalUsed: bigint({ mode: "number" }).notNull(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`e\`.\`exploitID\` AS \`exploitID\`,\`e\`.\`name\` AS \`name\`,\`e\`.\`price\` AS \`price\`,\`e\`.\`type\` AS \`type\`,\`e\`.\`description\` AS \`description\`,count(\`gambling-problem\`.\`r\`.\`runId\`) AS \`totalUsed\` from ((\`gambling-problem\`.\`exploitsdata\` \`e\` left join \`gambling-problem\`.\`exploitsusedinrunview\` \`eu\` on((\`gambling-problem\`.\`eu\`.\`exploitID\` = \`e\`.\`exploitID\`))) join \`gambling-problem\`.\`toprunsview\` \`r\` on((\`gambling-problem\`.\`eu\`.\`runId\` = \`gambling-problem\`.\`r\`.\`runId\`))) group by \`e\`.\`exploitID\`,\`e\`.\`name\`,\`e\`.\`type\`,\`e\`.\`price\`,\`e\`.\`description\``,
  );

export const topexploitsusedview = mysqlView("topexploitsusedview", {
  exploitId: varchar({ length: 30 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  type: varchar({ length: 20 }).notNull(),
  price: float().notNull(),
  totalUsed: bigint({ mode: "number" }).notNull(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`e\`.\`exploitID\` AS \`exploitID\`,\`e\`.\`name\` AS \`name\`,\`e\`.\`type\` AS \`type\`,\`e\`.\`price\` AS \`price\`,count(\`eu\`.\`exploitID\`) AS \`totalUsed\` from (\`gambling-problem\`.\`exploitsdata\` \`e\` left join \`gambling-problem\`.\`exploitsused\` \`eu\` on((\`eu\`.\`exploitID\` = \`e\`.\`exploitID\`))) group by \`e\`.\`exploitID\`,\`e\`.\`name\`,\`e\`.\`type\`,\`e\`.\`price\` order by \`totalUsed\` desc`,
  );

export const topplayersview = mysqlView("topplayersview", {
  runId: int().default(0).notNull(),
  username: varchar({ length: 50 }).notNull(),
  timePlayed: bigint({ mode: "number" }),
  moneyTotal: float(),
  moneySpend: float(),
  earnings: float(),
  mostUsedExploit: varchar({ length: 100 }),
  isRunning: tinyint().default(1),
  metadataId: int(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`r\`.\`runId\` AS \`runId\`,\`u\`.\`username\` AS \`username\`,\`m\`.\`durationMinutes\` AS \`timePlayed\`,\`r\`.\`moneyTotal\` AS \`moneyTotal\`,\`r\`.\`moneySpend\` AS \`moneySpend\`,\`r\`.\`earnings\` AS \`earnings\`,(select \`gambling-problem\`.\`ev\`.\`exploit_name\` from \`gambling-problem\`.\`exploitsusedinrunview\` \`ev\` where ((\`gambling-problem\`.\`ev\`.\`runId\` = \`r\`.\`runId\`) and (\`gambling-problem\`.\`ev\`.\`quantity_used\` > 0)) order by \`gambling-problem\`.\`ev\`.\`quantity_used\` desc,\`gambling-problem\`.\`ev\`.\`exploit_name\` limit 1) AS \`mostUsedExploit\`,\`r\`.\`isRunning\` AS \`isRunning\`,\`r\`.\`metadataID\` AS \`metadataID\` from (((\`gambling-problem\`.\`runs\` \`r\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUuid\` = \`r\`.\`userUuid\`))) left join \`gambling-problem\`.\`metadata\` \`m\` on((\`m\`.\`metadataID\` = \`r\`.\`metadataID\`))) join (select \`gambling-problem\`.\`runs\`.\`userUuid\` AS \`userUuid\`,max(\`gambling-problem\`.\`runs\`.\`earnings\`) AS \`max_earning\` from \`gambling-problem\`.\`runs\` where (\`gambling-problem\`.\`runs\`.\`isRunning\` = false) group by \`gambling-problem\`.\`runs\`.\`userUuid\`) \`BestRuns\` on(((\`r\`.\`userUuid\` = \`bestruns\`.\`userUuid\`) and (\`r\`.\`earnings\` = \`bestruns\`.\`max_earning\`)))) order by \`r\`.\`earnings\` desc`,
  );

export const toprunsview = mysqlView("toprunsview", {
  runId: int().default(0).notNull(),
  username: varchar({ length: 50 }).notNull(),
  timePlayed: bigint({ mode: "number" }),
  moneyTotal: float(),
  moneySpend: float(),
  earnings: float(),
  mostUsedExploit: varchar({ length: 100 }),
  isRunning: tinyint().default(1),
  metadataId: int(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`r\`.\`runId\` AS \`runId\`,\`u\`.\`username\` AS \`username\`,\`m\`.\`durationMinutes\` AS \`timePlayed\`,\`r\`.\`moneyTotal\` AS \`moneyTotal\`,\`r\`.\`moneySpend\` AS \`moneySpend\`,\`r\`.\`earnings\` AS \`earnings\`,(select \`gambling-problem\`.\`ev\`.\`exploit_name\` from \`gambling-problem\`.\`exploitsusedinrunview\` \`ev\` where ((\`gambling-problem\`.\`ev\`.\`runId\` = \`r\`.\`runId\`) and (\`gambling-problem\`.\`ev\`.\`quantity_used\` > 0)) order by \`gambling-problem\`.\`ev\`.\`quantity_used\` desc,\`gambling-problem\`.\`ev\`.\`exploit_name\` limit 1) AS \`mostUsedExploit\`,\`r\`.\`isRunning\` AS \`isRunning\`,\`r\`.\`metadataID\` AS \`metadataID\` from ((\`gambling-problem\`.\`runs\` \`r\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUuid\` = \`r\`.\`userUuid\`))) left join \`gambling-problem\`.\`metadata\` \`m\` on((\`m\`.\`metadataID\` = \`r\`.\`metadataID\`))) where (\`r\`.\`isRunning\` = false) order by \`r\`.\`earnings\` desc`,
  );

export const userrunsmetadataview = mysqlView("userrunsmetadataview", {
  runId: int().default(0).notNull(),
  userUuid: char({ length: 36 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  moneyTotal: float(),
  moneySpend: float(),
  earnings: float(),
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
    sql`select \`r\`.\`runId\` AS \`runId\`,\`r\`.\`userUuid\` AS \`userUuid\`,\`u\`.\`username\` AS \`username\`,\`r\`.\`moneyTotal\` AS \`moneyTotal\`,\`r\`.\`moneySpend\` AS \`moneySpend\`,\`r\`.\`earnings\` AS \`earnings\`,\`r\`.\`isRunning\` AS \`isRunning\`,\`m\`.\`typeEnd\` AS \`typeEnd\`,\`m\`.\`level\` AS \`level\`,\`m\`.\`durationMinutes\` AS \`durationMinutes\`,\`m\`.\`startedAt\` AS \`startedAt\`,\`m\`.\`endedAt\` AS \`endedAt\`,\`m\`.\`lastSavedAt\` AS \`lastSavedAt\` from ((\`gambling-problem\`.\`runs\` \`r\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUuid\` = \`r\`.\`userUuid\`))) left join \`gambling-problem\`.\`metadata\` \`m\` on((\`m\`.\`metadataID\` = \`r\`.\`metadataID\`)))`,
  );

export const userunlockedexploitsview = mysqlView("userunlockedexploitsview", {
  userUuid: char({ length: 36 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  exploitId: varchar({ length: 30 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  type: varchar({ length: 20 }).notNull(),
  price: float().notNull(),
  description: text().notNull(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`w\`.\`userUuid\` AS \`userUuid\`,\`u\`.\`username\` AS \`username\`,\`w\`.\`exploitID\` AS \`exploitID\`,\`e\`.\`name\` AS \`name\`,\`e\`.\`type\` AS \`type\`,\`e\`.\`price\` AS \`price\`,\`e\`.\`description\` AS \`description\` from ((\`gambling-problem\`.\`whitelist\` \`w\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUuid\` = \`w\`.\`userUuid\`))) join \`gambling-problem\`.\`exploitsdata\` \`e\` on((\`e\`.\`exploitID\` = \`w\`.\`exploitID\`)))`,
  );
