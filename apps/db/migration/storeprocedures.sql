DROP PROCEDURE IF EXISTS updLeaderboard;
DELIMITER //
CREATE PROCEDURE updLeaderboard(
    IN p_runID INT,
    IN p_moneyTotal DECIMAL(10,2),
    IN p_moneySpend DECIMAL(10,2)
)
BEGIN
    UPDATE Runs
    SET
        moneyTotal = p_moneyTotal,
        moneySpend = p_moneySpend
    WHERE runID = p_runID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getCurrentRun;
DELIMITER //
CREATE PROCEDURE getCurrentRun(IN p_userUUID CHAR(36))
BEGIN
    SELECT
        r.runID,
        r.userUUID,
        u.username,
        r.moneyTotal,
        r.moneySpend,
        r.earnings,
        r.metadataID,
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
    WHERE r.userUUID = p_userUUID
        AND r.isRunning = TRUE
    ORDER BY m.startedAt DESC, r.runID DESC
    LIMIT 1;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS updPersonalBest;
DELIMITER //
CREATE PROCEDURE updPersonalBest(IN p_userUUID CHAR(36))
BEGIN
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
    WHERE r.userUUID = p_userUUID
        AND r.isRunning = FALSE
    ORDER BY r.earnings DESC, r.moneyTotal DESC, r.runID ASC
    LIMIT 1;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getLastRuns;
DELIMITER //
CREATE PROCEDURE getLastRuns(
    IN p_userUUID CHAR(36),
    IN p_limit INT
)
BEGIN
    DECLARE safeLimit INT DEFAULT 10;
    SET safeLimit = IF(p_limit IS NULL OR p_limit < 1, 10, p_limit);

    SELECT
        runID,
        userUUID,
        username,
        moneyTotal,
        moneySpend,
        earnings,
        isRunning,
        metadataID,
        typeEnd,
        level,
        saveData,
        startedAt,
        endedAt,
        lastSavedAt,
        durationSeconds
    FROM UserRunsMetadataView
    WHERE userUUID = p_userUUID
    ORDER BY startedAt DESC, runID DESC
    LIMIT safeLimit;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getBestRunsDay;
DELIMITER //
CREATE PROCEDURE getBestRunsDay(IN p_limit INT)
BEGIN
    DECLARE safeLimit INT DEFAULT 10;
    SET safeLimit = IF(p_limit IS NULL OR p_limit < 1, 10, p_limit);

    SELECT
        r.runID,
        r.userUUID,
        u.username,
        r.moneyTotal,
        r.moneySpend,
        r.earnings,
        m.typeEnd,
        m.level,
        m.startedAt,
        m.endedAt,
        m.durationSeconds
    FROM Runs r
    INNER JOIN Users u
        ON u.userUUID = r.userUUID
    LEFT JOIN Metadata m
        ON m.metadataID = r.metadataID
    WHERE r.isRunning = FALSE
        AND DATE(COALESCE(m.endedAt, m.startedAt)) = CURRENT_DATE()
    ORDER BY r.earnings DESC, r.moneyTotal DESC, r.runID ASC
    LIMIT safeLimit;
END //
DELIMITER ;

