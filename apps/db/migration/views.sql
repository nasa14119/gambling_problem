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
    r.isRunning,
    r.metadataID,
    m.typeEnd,
    m.level,
    m.saveData,
    m.startedAt,
    m.endedAt,
    m.durationSeconds,
    (
        SELECT COALESCE(SUM(eu.quantity), 0)
        FROM ExploitsUsed eu
        WHERE eu.runID = r.runID
    ) AS totalExploitsUsed,
    (
        SELECT COUNT(DISTINCT eu.exploitID)
        FROM ExploitsUsed eu
        WHERE eu.runID = r.runID
    ) AS uniqueExploitsUsed,
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
    ON m.metadataID = r.metadataID;

DROP VIEW IF EXISTS TotalExploitsUsedPerRunView;
CREATE VIEW TotalExploitsUsedPerRunView AS
SELECT
    r.runID,
    r.userUUID,
    u.username,
    COALESCE(SUM(eu.quantity), 0) AS totalExploitsUsed,
    COUNT(DISTINCT eu.exploitID) AS uniqueExploitsUsed
FROM Runs r
INNER JOIN Users u
    ON u.userUUID = r.userUUID
LEFT JOIN ExploitsUsed eu
    ON eu.runID = r.runID
GROUP BY r.runID, r.userUUID, u.username;

DROP VIEW IF EXISTS TotalActivePlayersView;
CREATE VIEW TotalActivePlayersView AS
SELECT
    COUNT(DISTINCT r.userUUID) AS totalActivePlayers,
    COUNT(DISTINCT r.runID) AS totalActiveRuns,
    COUNT(DISTINCT CASE
        WHEN ru.sessionID IS NOT NULL THEN r.userUUID
    END) AS connectedPlayers
FROM Runs r
LEFT JOIN Running ru
    ON ru.runID = r.runID
WHERE r.isRunning = TRUE;

DROP VIEW IF EXISTS LossesByLevelView;
CREATE VIEW LossesByLevelView AS
SELECT
    m.level,
    COUNT(*) AS totalLosses,
    AVG(r.earnings) AS averageEarnings,
    AVG(m.durationSeconds) AS averageDurationSeconds
FROM Runs r
INNER JOIN Metadata m
    ON m.metadataID = r.metadataID
WHERE r.isRunning = FALSE
    AND m.typeEnd IS NOT NULL
    AND UPPER(m.typeEnd) <> 'WIN'
GROUP BY m.level
ORDER BY totalLosses DESC, m.level ASC;

DROP VIEW IF EXISTS PlayerOverallStatsView;
CREATE VIEW PlayerOverallStatsView AS
SELECT
    u.userUUID,
    u.username,
    COUNT(r.runID) AS totalRuns,
    COALESCE(SUM(r.isRunning = FALSE), 0) AS completedRuns,
    COALESCE(SUM(r.isRunning = TRUE), 0) AS activeRuns,
    COALESCE(SUM(UPPER(m.typeEnd) = 'WIN'), 0) AS totalWins,
    COALESCE(SUM(
        m.typeEnd IS NOT NULL
        AND UPPER(m.typeEnd) <> 'WIN'
    ), 0) AS totalLosses,
    COALESCE(SUM(r.moneyTotal), 0) AS totalMoney,
    COALESCE(SUM(r.moneySpend), 0) AS totalMoneySpent,
    COALESCE(SUM(r.earnings), 0) AS totalEarnings,
    COALESCE(MAX(r.earnings), 0) AS bestRunEarnings,
    COALESCE(AVG(r.earnings), 0) AS averageRunEarnings,
    COALESCE(SUM(m.durationSeconds), 0) AS totalTimePlayedSeconds,
    (
        SELECT COALESCE(SUM(eu.quantity), 0)
        FROM ExploitsUsed eu
        INNER JOIN Runs userRuns
            ON userRuns.runID = eu.runID
        WHERE userRuns.userUUID = u.userUUID
    ) AS totalExploitsUsed,
    (
        SELECT COUNT(*)
        FROM Whitelist w
        WHERE w.userUUID = u.userUUID
    ) AS totalExploitsUnlocked
FROM Users u
LEFT JOIN Runs r
    ON r.userUUID = u.userUUID
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID
GROUP BY u.userUUID, u.username;
