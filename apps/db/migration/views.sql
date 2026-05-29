USE gambling_problem;

DROP VIEW IF EXISTS Top50PlayersView;
CREATE VIEW Top50PlayersView AS
SELECT
    r.runID,
    r.userUUID,
    u.username,
    m.durationSeconds AS timePlayedSeconds,
    r.moneyTotal,
    r.moneySpend,
    r.earnings,
    (
        SELECT ed.name
        FROM ExploitsUsed eu
        INNER JOIN ExploitsData ed
            ON ed.exploitID = eu.exploitID
        WHERE eu.runID = r.runID
        ORDER BY eu.quantity DESC, ed.name ASC
        LIMIT 1
    ) AS mostUsedExploit
FROM Runs r
INNER JOIN Users u
    ON u.userUUID = r.userUUID
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID
WHERE r.isRunning = FALSE
ORDER BY r.earnings DESC, r.moneyTotal DESC, r.runID ASC
LIMIT 50;

DROP VIEW IF EXISTS Best50ActiveRunsView;
CREATE VIEW Best50ActiveRunsView AS
SELECT
    r.runID,
    r.userUUID,
    u.username,
    r.moneyTotal,
    r.moneySpend,
    r.earnings,
    m.startedAt,
    m.lastSavedAt,
    TIMESTAMPDIFF(SECOND, m.startedAt, CURRENT_TIMESTAMP) AS activeSeconds,
    ru.sessionID,
    ru.data
FROM Runs r
INNER JOIN Users u
    ON u.userUUID = r.userUUID
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID
LEFT JOIN Running ru
    ON ru.runID = r.runID
WHERE r.isRunning = TRUE
ORDER BY r.earnings DESC, r.moneyTotal DESC, r.runID ASC
LIMIT 50;

DROP VIEW IF EXISTS TopExploitsUsedView;
CREATE VIEW TopExploitsUsedView AS
SELECT
    e.exploitID,
    e.name,
    e.type,
    e.price,
    COALESCE(SUM(eu.quantity), 0) AS totalUsed,
    COUNT(DISTINCT eu.runID) AS runsUsedIn
FROM ExploitsData e
LEFT JOIN ExploitsUsed eu
    ON eu.exploitID = e.exploitID
GROUP BY e.exploitID, e.name, e.type, e.price
ORDER BY totalUsed DESC, runsUsedIn DESC, e.name ASC;

DROP VIEW IF EXISTS UserUnlockedExploitsView;
CREATE VIEW UserUnlockedExploitsView AS
SELECT
    w.userUUID,
    u.username,
    w.exploitID,
    e.name,
    e.type,
    e.price,
    e.description
FROM Whitelist w
INNER JOIN Users u
    ON u.userUUID = w.userUUID
INNER JOIN ExploitsData e
    ON e.exploitID = w.exploitID;

DROP VIEW IF EXISTS UserRunsMetadataView;
CREATE VIEW UserRunsMetadataView AS
SELECT
    r.runID,
    r.userUUID,
    u.username,
    r.moneyTotal,
    r.moneySpend,
    r.earnings,
    r.isRunning,
    r.metadataID,
    m.typeEnd,
    m.level,
    m.saveData,
    m.startedAt,
    m.endedAt,
    m.lastSavedAt,
    m.durationSeconds
FROM Runs r
INNER JOIN Users u
    ON u.userUUID = r.userUUID
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID;

DROP VIEW IF EXISTS RunRecapView;
CREATE VIEW RunRecapView AS
SELECT
    r.runID,
    r.userUUID,
    u.username,
    r.moneyTotal,
    r.moneySpend,
    r.earnings,
    m.typeEnd,
    m.level,
    m.saveData,
    m.startedAt,
    m.endedAt,
    m.lastSavedAt,
    m.durationSeconds
FROM Runs r
INNER JOIN Users u
    ON u.userUUID = r.userUUID
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID
WHERE r.isRunning = FALSE;

DROP VIEW IF EXISTS RunExploitTotalsView;
CREATE VIEW RunExploitTotalsView AS
SELECT
    r.runID,
    r.userUUID,
    u.username,
    COALESCE(SUM(eu.quantity), 0) AS totalExploitsUsed,
    COALESCE(SUM(eu.quantity * e.price), 0) AS totalExploitCost
FROM Runs r
INNER JOIN Users u
    ON u.userUUID = r.userUUID
LEFT JOIN ExploitsUsed eu
    ON eu.runID = r.runID
LEFT JOIN ExploitsData e
    ON e.exploitID = eu.exploitID
GROUP BY r.runID, r.userUUID, u.username;

DROP VIEW IF EXISTS TotalActivePlayersView;
CREATE VIEW TotalActivePlayersView AS
SELECT
    COUNT(DISTINCT userUUID) AS totalActivePlayers,
    COUNT(runID) AS totalActiveRuns
FROM Runs
WHERE isRunning = TRUE;

DROP VIEW IF EXISTS LoseLevelStatsView;
CREATE VIEW LoseLevelStatsView AS
SELECT
    m.level,
    m.typeEnd,
    COUNT(r.runID) AS totalRuns
FROM Metadata m
INNER JOIN Runs r
    ON r.metadataID = m.metadataID
WHERE r.isRunning = FALSE
    AND m.typeEnd IS NOT NULL
GROUP BY m.level, m.typeEnd
ORDER BY totalRuns DESC, m.level ASC;

DROP VIEW IF EXISTS PlayerOverallStatsView;
CREATE VIEW PlayerOverallStatsView AS
SELECT
    u.userUUID,
    u.username,
    COUNT(r.runID) AS totalRuns,
    SUM(CASE WHEN r.isRunning = TRUE THEN 1 ELSE 0 END) AS activeRuns,
    SUM(CASE WHEN r.isRunning = FALSE THEN 1 ELSE 0 END) AS finishedRuns,
    COALESCE(MAX(CASE WHEN r.isRunning = FALSE THEN r.earnings END), 0) AS bestScore,
    COALESCE(AVG(CASE WHEN r.isRunning = FALSE THEN r.earnings END), 0) AS averageScore,
    COALESCE(SUM(r.moneyTotal), 0) AS totalMoney,
    COALESCE(SUM(r.moneySpend), 0) AS totalMoneySpend,
    COALESCE(SUM(r.earnings), 0) AS totalEarnings,
    COALESCE(SUM(m.durationSeconds), 0) AS totalPlaySeconds
FROM Users u
LEFT JOIN Runs r
    ON r.userUUID = u.userUUID
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID
GROUP BY u.userUUID, u.username;
