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
