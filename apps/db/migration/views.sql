DROP VIEW IF EXISTS TopExploitsUsedView;
CREATE VIEW TopExploitsUsedView AS
SELECT
    e.exploitID,
    e.name,
    e.type,
    e.price,
    COUNT(eu.exploitID) AS totalUsed
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

DROP VIEW IF EXISTS RunDurationsView;
CREATE VIEW RunDurationsView AS
SELECT
    r.runId,
    r.userUuid,
    u.username,
    r.isRunning,
    m.typeEnd,
    m.startedAt,
    m.endedAt,
    m.lastSavedAt,
    COALESCE(m.durationMinutes, 0) AS storedDurationMinutes,
    CASE
        WHEN r.isRunning = TRUE AND m.lastSavedAt IS NOT NULL THEN
            COALESCE(m.durationMinutes, 0) + TIMESTAMPDIFF(MINUTE, m.lastSavedAt, CURRENT_TIMESTAMP)
        WHEN m.endedAt IS NOT NULL AND m.startedAt IS NOT NULL THEN
            TIMESTAMPDIFF(MINUTE, m.startedAt, m.endedAt)
        ELSE
            COALESCE(m.durationMinutes, 0)
    END AS calculatedDurationMinutes
FROM Runs r
INNER JOIN Users u
    ON u.userUuid = r.userUuid
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID
ORDER BY calculatedDurationMinutes DESC, r.runId DESC;

DROP VIEW IF EXISTS ExploitsUsedInRunView;
CREATE VIEW ExploitsUsedInRunView AS
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

DROP VIEW IF EXISTS TopPlayersView;
CREATE VIEW TopPlayersView AS
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
    ) AS mostUsedExploit, 
    r.isRunning,
    r.metadataID
FROM Runs r
INNER JOIN Users u ON u.userUuid = r.userUuid
LEFT JOIN Metadata m ON m.metadataID = r.metadataID
INNER JOIN (
    SELECT userUuid, MAX(earnings) AS max_earning
    FROM Runs
    WHERE isRunning = FALSE
    GROUP BY userUuid
) BestRuns ON r.userUuid = BestRuns.userUuid AND r.earnings = BestRuns.max_earning
ORDER BY r.earnings DESC; 

DROP VIEW IF EXISTS TopActiveRunsView;
CREATE VIEW TopActiveRunsView AS
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
    ) AS mostUsedExploit,
    r.metadataID
FROM Runs r
INNER JOIN Users u
    ON u.userUuid = r.userUuid
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID
WHERE r.isRunning = TRUE
ORDER BY r.earnings DESC; 

DROP VIEW IF EXISTS TopRunsView; 
CREATE VIEW TopRunsView AS
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
    ) AS mostUsedExploit,
    r.isRunning,
    r.metadataID
FROM Runs r
INNER JOIN Users u
    ON u.userUuid = r.userUuid
LEFT JOIN Metadata m
    ON m.metadataID = r.metadataID
WHERE r.isRunning = FALSE
ORDER BY r.earnings DESC;

DROP VIEW IF EXISTS TopExploitsUsedRank;
CREATE VIEW TopExploitsUsedRank AS
SELECT
e.*,
COUNT(r.runId)  AS totalUsed
FROM ExploitsData e
LEFT JOIN ExploitsUsedInRunView eu
ON eu.exploitID = e.exploitID
LEFT JOIN TopRunsView r
ON eu.runId = r.runId
GROUP BY e.exploitID, e.name, e.type, e.price, e.description;

DROP VIEW IF EXISTS TopExploitsUsedPlayerRank; 
CREATE VIEW TopExploitsUsedPlayerRank AS
SELECT
e.*,
COUNT(r.runId) AS totalUsed
FROM ExploitsData e
LEFT JOIN ExploitsUsedInRunView eu
ON eu.exploitID = e.exploitID
LEFT JOIN TopPlayersView r
ON eu.runId = r.runId
GROUP BY e.exploitID, e.name, e.type, e.price, e.description;
