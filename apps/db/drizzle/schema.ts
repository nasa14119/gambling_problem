import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  varchar,
  decimal,
  text,
  foreignKey,
  int,
  timestamp,
  json,
  char,
  unique,
  mysqlView,
  bigint,
  boolean,
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
      .references(() => runs.runId),
    exploitId: varchar({ length: 30 })
      .notNull()
      .references(() => exploitsData.exploitId),
    quantity: int().default(1).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.runId, table.exploitId],
      name: "ExploitsUsed_runID_exploitID",
    }),
  ],
);

export const metadata = mysqlTable(
  "Metadata",
  {
    metadataId: int().autoincrement().notNull(),
    typeEnd: varchar({ length: 50 }),
    level: int(),
    startedAt: timestamp({ mode: "string" }).defaultNow(),
    endedAt: timestamp({ mode: "string" }),
    lastSavedAt: timestamp({ mode: "string" }),
    durationSeconds: int().generatedAlwaysAs(
      sql`timestampdiff(SECOND,\`startedAt\`,\`endedAt\`)`,
      { mode: "stored" },
    ),
  },
  (table) => [
    primaryKey({ columns: [table.metadataId], name: "Metadata_metadataID" }),
  ],
);

export const running = mysqlTable(
  "Running",
  {
    runId: int()
      .notNull()
      .references(() => runs.runId),
    data: json(),
    sessionId: varchar({ length: 100 }),
  },
  (table) => [primaryKey({ columns: [table.runId], name: "Running_runID" })],
);

export const runs = mysqlTable(
  "Runs",
  {
    runId: int().autoincrement().notNull(),
    userUUID: char({ length: 36 })
      .notNull()
      .references(() => users.userUUID),
    moneyTotal: decimal({ precision: 10, scale: 2 }).default("0.00"),
    moneySpend: decimal({ precision: 10, scale: 2 }).default("0.00"),
    earnings: decimal({ precision: 10, scale: 2 }).default("0.00"),
    isRunning: boolean().default(true),
    metadataId: int().references(() => metadata.metadataId),
  },
  (table) => [primaryKey({ columns: [table.runId], name: "Runs_runID" })],
);

export const users = mysqlTable(
  "Users",
  {
    userUUID: char({ length: 36 }).notNull(),
    username: varchar({ length: 50 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userUUID], name: "Users_userUUID" }),
    unique("username").on(table.username),
  ],
);

export const whitelist = mysqlTable(
  "Whitelist",
  {
    userUUID: char({ length: 36 })
      .notNull()
      .references(() => users.userUUID),
    exploitId: varchar({ length: 30 })
      .notNull()
      .references(() => exploitsData.exploitId),
  },
  (table) => [
    primaryKey({
      columns: [table.userUUID, table.exploitId],
      name: "Whitelist_userUUID_exploitID",
    }),
  ],
);
export const best50Activerunsview = mysqlView("best50activerunsview", {
  runId: int().default(0).notNull(),
  userUUID: char({ length: 36 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  moneyTotal: decimal({ precision: 10, scale: 2 }).default("0.00"),
  moneySpend: decimal({ precision: 10, scale: 2 }).default("0.00"),
  earnings: decimal({ precision: 10, scale: 2 }).default("0.00"),
  startedAt: timestamp({ mode: "string" }).defaultNow(),
  lastSavedAt: timestamp({ mode: "string" }),
  activeSeconds: bigint({ mode: "number" }),
  sessionId: varchar({ length: 100 }),
  data: json(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`r\`.\`runID\` AS \`runID\`,\`r\`.\`userUUID\` AS \`userUUID\`,\`u\`.\`username\` AS \`username\`,\`r\`.\`moneyTotal\` AS \`moneyTotal\`,\`r\`.\`moneySpend\` AS \`moneySpend\`,\`r\`.\`earnings\` AS \`earnings\`,\`m\`.\`startedAt\` AS \`startedAt\`,\`m\`.\`lastSavedAt\` AS \`lastSavedAt\`,timestampdiff(SECOND,\`m\`.\`startedAt\`,now()) AS \`activeSeconds\`,\`ru\`.\`sessionID\` AS \`sessionID\`,\`ru\`.\`data\` AS \`data\` from (((\`gambling-problem\`.\`runs\` \`r\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUUID\` = \`r\`.\`userUUID\`))) left join \`gambling-problem\`.\`metadata\` \`m\` on((\`m\`.\`metadataID\` = \`r\`.\`metadataID\`))) left join \`gambling-problem\`.\`running\` \`ru\` on((\`ru\`.\`runID\` = \`r\`.\`runID\`))) where (\`r\`.\`isRunning\` = true) order by \`r\`.\`earnings\` desc,\`r\`.\`moneyTotal\` desc,\`r\`.\`runID\` limit 50`,
  );

export const top50Playersview = mysqlView("top50playersview", {
  runId: int().default(0).notNull(),
  userUUID: char({ length: 36 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  timePlayedSeconds: int(),
  moneyTotal: decimal({ precision: 10, scale: 2 }).default("0.00"),
  moneySpend: decimal({ precision: 10, scale: 2 }).default("0.00"),
  earnings: decimal({ precision: 10, scale: 2 }).default("0.00"),
  mostUsedExploit: varchar({ length: 100 }),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`r\`.\`runID\` AS \`runID\`,\`r\`.\`userUUID\` AS \`userUUID\`,\`u\`.\`username\` AS \`username\`,\`m\`.\`durationSeconds\` AS \`timePlayedSeconds\`,\`r\`.\`moneyTotal\` AS \`moneyTotal\`,\`r\`.\`moneySpend\` AS \`moneySpend\`,\`r\`.\`earnings\` AS \`earnings\`,(select \`ed\`.\`name\` from (\`gambling-problem\`.\`exploitsused\` \`eu\` join \`gambling-problem\`.\`exploitsdata\` \`ed\` on((\`ed\`.\`exploitID\` = \`eu\`.\`exploitID\`))) where (\`eu\`.\`runID\` = \`r\`.\`runID\`) order by \`eu\`.\`quantity\` desc,\`ed\`.\`name\` limit 1) AS \`mostUsedExploit\` from ((\`gambling-problem\`.\`runs\` \`r\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUUID\` = \`r\`.\`userUUID\`))) left join \`gambling-problem\`.\`metadata\` \`m\` on((\`m\`.\`metadataID\` = \`r\`.\`metadataID\`))) where (\`r\`.\`isRunning\` = false) order by \`r\`.\`earnings\` desc,\`r\`.\`moneyTotal\` desc,\`r\`.\`runID\` limit 50`,
  );

export const topexploitsusedview = mysqlView("topexploitsusedview", {
  exploitId: varchar({ length: 30 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  type: varchar({ length: 20 }).notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull(),
  totalUsed: decimal({ precision: 32, scale: 0 }).default("0").notNull(),
  runsUsedIn: bigint({ mode: "number" }).notNull(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`e\`.\`exploitID\` AS \`exploitID\`,\`e\`.\`name\` AS \`name\`,\`e\`.\`type\` AS \`type\`,\`e\`.\`price\` AS \`price\`,coalesce(sum(\`eu\`.\`quantity\`),0) AS \`totalUsed\`,count(distinct \`eu\`.\`runID\`) AS \`runsUsedIn\` from (\`gambling-problem\`.\`exploitsdata\` \`e\` left join \`gambling-problem\`.\`exploitsused\` \`eu\` on((\`eu\`.\`exploitID\` = \`e\`.\`exploitID\`))) group by \`e\`.\`exploitID\`,\`e\`.\`name\`,\`e\`.\`type\`,\`e\`.\`price\` order by \`totalUsed\` desc,\`runsUsedIn\` desc,\`e\`.\`name\``,
  );

export const userrunsmetadataview = mysqlView("userrunsmetadataview", {
  runId: int().default(0).notNull(),
  userUUID: char({ length: 36 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  moneyTotal: decimal({ precision: 10, scale: 2 }).default("0.00"),
  moneySpend: decimal({ precision: 10, scale: 2 }).default("0.00"),
  earnings: decimal({ precision: 10, scale: 2 }).default("0.00"),
  isRunning: boolean().default(true),
  typeEnd: varchar({ length: 50 }),
  level: int(),
  durationSeconds: int(),
  startedAt: timestamp({ mode: "string" }).defaultNow(),
  endedAt: timestamp({ mode: "string" }),
  lastSavedAt: timestamp({ mode: "string" }),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`r\`.\`runID\` AS \`runID\`,\`r\`.\`userUUID\` AS \`userUUID\`,\`u\`.\`username\` AS \`username\`,\`r\`.\`moneyTotal\` AS \`moneyTotal\`,\`r\`.\`moneySpend\` AS \`moneySpend\`,\`r\`.\`earnings\` AS \`earnings\`,\`r\`.\`isRunning\` AS \`isRunning\`,\`m\`.\`typeEnd\` AS \`typeEnd\`,\`m\`.\`level\` AS \`level\`,\`m\`.\`durationSeconds\` AS \`durationSeconds\`,\`m\`.\`startedAt\` AS \`startedAt\`,\`m\`.\`endedAt\` AS \`endedAt\`,\`m\`.\`lastSavedAt\` AS \`lastSavedAt\` from ((\`gambling-problem\`.\`runs\` \`r\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUUID\` = \`r\`.\`userUUID\`))) left join \`gambling-problem\`.\`metadata\` \`m\` on((\`m\`.\`metadataID\` = \`r\`.\`metadataID\`)))`,
  );

export const userunlockedexploitsview = mysqlView("userunlockedexploitsview", {
  userUUID: char({ length: 36 }).notNull(),
  username: varchar({ length: 50 }).notNull(),
  exploitId: varchar({ length: 30 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  type: varchar({ length: 20 }).notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull(),
  description: text().notNull(),
})
  .algorithm("undefined")
  .sqlSecurity("definer")
  .as(
    sql`select \`w\`.\`userUUID\` AS \`userUUID\`,\`u\`.\`username\` AS \`username\`,\`w\`.\`exploitID\` AS \`exploitID\`,\`e\`.\`name\` AS \`name\`,\`e\`.\`type\` AS \`type\`,\`e\`.\`price\` AS \`price\`,\`e\`.\`description\` AS \`description\` from ((\`gambling-problem\`.\`whitelist\` \`w\` join \`gambling-problem\`.\`users\` \`u\` on((\`u\`.\`userUUID\` = \`w\`.\`userUUID\`))) join \`gambling-problem\`.\`exploitsdata\` \`e\` on((\`e\`.\`exploitID\` = \`w\`.\`exploitID\`)))`,
  );
