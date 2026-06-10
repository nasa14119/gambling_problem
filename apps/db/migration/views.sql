DROP VIEW IF EXISTS topexploitsusedview;
CREATE VIEW topexploitsusedview AS
SELECT
    e.exploitID,
    e.name,
    e.type,
    e.price,
    COUNT(eu.exploitID) AS totalUsed
FROM exploitsdata e
LEFT JOIN exploitsused eu
    ON eu.exploitID = e.exploitID
GROUP BY e.exploitID, e.name, e.type, e.price
ORDER BY totalUsed DESC;

DROP VIEW IF EXISTS userunlockedexploitsview;
CREATE VIEW userunlockedexploitsview AS
SELECT
    w.userUuid,
    u.username,
    w.exploitID,
    e.name,
    e.type,
    e.price,
    e.description
FROM whitelist w
INNER JOIN users u
    ON u.userUuid = w.userUuid
INNER JOIN exploitsdata e
    ON e.exploitID = w.exploitID;

DROP VIEW IF EXISTS userrunsmetadataview;
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
FROM runs r
INNER JOIN users u
    ON u.userUuid = r.userUuid
LEFT JOIN metadata m
    ON m.metadataID = r.metadataID;

DROP VIEW IF EXISTS exploitsusedinrunview;
CREATE VIEW exploitsusedinrunview AS
SELECT 
    r.runId,
    e.exploitID,
    e.name AS exploit_name,
    COUNT(eu.exploitID) AS quantity_used
FROM exploitsdata e
LEFT JOIN exploitsused eu ON e.exploitID = eu.exploitID
LEFT JOIN runs r ON eu.runId = r.runId
GROUP BY e.exploitID, e.name, r.runId
ORDER BY r.runId, quantity_used DESC;

DROP VIEW IF EXISTS topplayersview;
CREATE VIEW topplayersview AS
SELECT
    r.runId,
    u.username,
    m.durationMinutes AS timePlayed,
    r.moneyTotal,
    r.moneySpend,
    r.earnings,
    (
        SELECT ev.exploit_name 
        FROM exploitsusedinrunview ev
        WHERE ev.runId = r.runId AND ev.quantity_used > 0
        ORDER BY ev.quantity_used DESC, ev.exploit_name ASC
        LIMIT 1
    ) AS mostusedexploit, 
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

DROP VIEW IF EXISTS ExploitCountPlayer; 
CREATE VIEW ExploitCountPlayer AS 
SELECT 
    r.runId, 
    CAST(SUM(quantity_used) AS UNSIGNED) as quantity_used
FROM Runs r 
LEFT JOIN ExploitsUsedInRunView eu 
ON r.runId = eu.runId 
GROUP BY r.runId;

DROP VIEW IF EXISTS PlayersAllTimeSumary; 
CREATE VIEW PlayersAllTimeSumary AS 
SELECT 
    u.username,
    COUNT(r.userUuid) as totalRuns,
    CAST(SUM(m.durationMinutes) AS UNSIGNED) as totalTimePlaingMinutes,
    CAST(SUM(COALESCE(ec.quantity_used, 0)) AS UNSIGNED) AS totalExploitsUsed
FROM Runs r
INNER JOIN Users u
    ON r.userUuid = u.userUuid
INNER JOIN Metadata m
    ON r.metadataID = m.metadataID
LEFT JOIN ExploitCountPlayer ec
    ON ec.runId = r.runId
GROUP BY u.username, r.userUuid
ORDER BY totalTimePlaingMinutes DESC;

