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
        m.lastSavedAt,
        r.isRunning,
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
        m.durationMinutes AS timePlayedMinutes,
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

DROP PROCEDURE IF EXISTS killSession;
DELIMITER //
CREATE PROCEDURE killSession(IN sessionId VARCHAR(36))
BEGIN
    DECLARE new_time BIGINT; 
    DECLARE v_runID INT;
    IF sessionId IS NOT NULL THEN
        SELECT ru.runID INTO v_runID FROM Running as ru 
        WHERE ru.sessionID = sessionId ;

        SELECT TIMESTAMPDIFF(MINUTE, m.lastSavedAt, NOW()) 
            INTO new_time 
            FROM Runs AS r INNER JOIN 
                Metadata AS m
                USING (metadataID)
            WHERE r.runID = v_runID LIMIT 1; 
        
        UPDATE Metadata AS m INNER JOIN Runs AS r 
            USING (metadataID)
            SET lastSavedAt = NULL, m.durationMinutes = COALESCE(m.durationMinutes, 0) + new_time 
            WHERE r.runID = v_runID; 

        UPDATE Running as ru 
        SET sessionId = NULL 
        WHERE ru.sessionID = sessionId;
    END IF; 
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS endGame;
DELIMITER //
CREATE PROCEDURE endGame(IN runID INT, IN typeEnd ENUM("WIN", "BANKRUPT", "TERMINATED", "DEATH"))
BEGIN
    UPDATE Metadata as m SET m.typeEnd = typeEnd WHERE m.metadataID = (SELECT metadataID FROM Runs AS r WHERE r.runID = runID);
END //
DELIMITER ;