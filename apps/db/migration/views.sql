DROP VIEW IF EXISTS Best50ActiveRunsView;
CREATE VIEW Best50ActiveRunsView AS
SELECT
    r.runId,
    r.userUuid,
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
    ON u.userUuid = r.userUuid
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID
LEFT JOIN Running ru
    ON ru.runId = r.runId
WHERE r.isRunning = TRUE
ORDER BY r.earnings DESC, r.moneyTotal DESC, r.runId ASC
LIMIT 50;

DROP VIEW IF EXISTS TopExploitsUsedView;
CREATE VIEW TopExploitsUsedView AS
SELECT
    e.exploitID,
    e.name,
    e.type,
    e.price,
    COUNT(e.exploitID) AS totalUsed
FROM ExploitsData e
LEFT JOIN ExploitsUsed eu
    ON eu.exploitID = e.exploitID
GROUP BY e.exploitID, e.name, e.type, e.price
ORDER BY totalUsed DESC;

DROP VIEW IF EXISTS UserUnlockedExploitsView;
CREATE VIEW UserUnlockedExploitsView AS
SELECT
    w.userUuid,
    u.username,
    w.exploitID,
    e.name,
    e.type,
    e.price,
    e.description
FROM Whitelist w
INNER JOIN Users u
    ON u.userUuid = w.userUuid
INNER JOIN ExploitsData e
    ON e.exploitID = w.exploitID;

DROP VIEW IF EXISTS UserRunsMetadataView;
CREATE VIEW UserRunsMetadataView AS
SELECT
    r.runId,
    r.userUuid,
    u.username,
    r.moneyTotal,
    r.moneySpend,
    r.earnings,
    r.isRunning,
    m.typeEnd,
    m.level,
    m.durationMinutes,
    m.startedAt,
    m.endedAt,
    m.lastSavedAt
FROM Runs r
INNER JOIN Users u
    ON u.userUuid = r.userUuid
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID;

DROP VIEW IF EXISTS exploitsUsedInRunView;
CREATE VIEW exploitsUsedInRunView AS
SELECT 
    r.runId,
    e.exploitID,
    e.name AS exploit_name,
    COUNT(eu.exploitID) AS quantity_used
FROM ExploitsData e
LEFT JOIN ExploitsUsed eu ON e.exploitID = eu.exploitID
LEFT JOIN Runs r ON eu.runId = r.runId
GROUP BY e.exploitID, e.name, r.runId
ORDER BY r.runId, quantity_used DESC;

DROP VIEW IF EXISTS Top50PlayersView;
CREATE VIEW Top50PlayersView AS
SELECT
    r.runId,
    u.username,
    m.durationMinutes AS timePlayed,
    r.moneyTotal,
    r.moneySpend,
    r.earnings,
    (
        SELECT ev.exploit_name 
        FROM exploitsUsedInRunView ev
        WHERE ev.runId = r.runId AND ev.quantity_used > 0
        ORDER BY ev.quantity_used DESC, ev.exploit_name ASC
        LIMIT 1
    ) AS mostUsedExploit
FROM Runs r
INNER JOIN Users u ON u.userUuid = r.userUuid
LEFT JOIN Metadata m ON m.metadataID = r.metadataID
INNER JOIN (
    SELECT userUuid, MAX(earnings) AS max_earning
    FROM Runs
    WHERE isRunning = FALSE
    GROUP BY userUuid
) BestRuns ON r.userUuid = BestRuns.userUuid AND r.earnings = BestRuns.max_earning
ORDER BY r.earnings DESC
LIMIT 50;