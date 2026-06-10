DROP PROCEDURE IF EXISTS updLeaderboard;
DELIMITER //
CREATE PROCEDURE updLeaderboard(
    IN p_runId INT,
    IN p_moneyTotal FLOAT,
    IN p_moneySpend FLOAT
)
BEGIN
    UPDATE Runs
    SET
        moneyTotal = p_moneyTotal,
        moneySpend = p_moneySpend
    WHERE runId = p_runId;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getCurrentRun;
DELIMITER //
CREATE PROCEDURE getCurrentRun(IN p_userUuid CHAR(36))
BEGIN
    SELECT
        r.runId,
        r.userUuid,
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
        ON u.userUuid = r.userUuid
    LEFT JOIN Metadata m
        ON m.metadataID = r.metadataID
    LEFT JOIN Running ru
        ON ru.runId = r.runId
    WHERE r.userUuid = p_userUuid
    ORDER BY m.startedAt DESC, r.runId DESC
    LIMIT 1;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS updPersonalBest;
DELIMITER //
CREATE PROCEDURE updPersonalBest(IN p_userUuid CHAR(36))
BEGIN
    SELECT
        r.runId,
        r.userUuid,
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
            WHERE eu.runId = r.runId
            GROUP BY ed.exploitID, ed.name
            ORDER BY COUNT(*) DESC, ed.name ASC
            LIMIT 1
        ) AS mostUsedExploit
    FROM Runs r
    INNER JOIN Users u
        ON u.userUuid = r.userUuid
    LEFT JOIN Metadata m
        ON m.metadataID = r.metadataID
    WHERE r.userUuid = p_userUuid
        AND r.isRunning = FALSE
    ORDER BY r.earnings DESC, r.moneyTotal DESC, r.runId ASC
    LIMIT 1;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getLastRuns;
DELIMITER //
CREATE PROCEDURE getLastRuns(
    IN p_userUuid CHAR(36),
    IN p_limit INT
)
BEGIN
    DECLARE safeLimit INT DEFAULT 10;
    SET safeLimit = IF(p_limit IS NULL OR p_limit < 1, 10, p_limit);

    SELECT
        runId,
        username,
        moneyTotal,
        moneySpend,
        earnings,
        isRunning,
        metadataID,
        typeEnd,
        level,
        startedAt,
        endedAt,
        lastSavedAt,
        durationMinutes
    FROM UserRunsMetadataView
    WHERE userUuid = p_userUuid
    ORDER BY startedAt DESC, runId DESC
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
        r.runId,
        r.userUuid,
        u.username,
        r.moneyTotal,
        r.moneySpend,
        r.earnings,
        m.typeEnd,
        m.level,
        m.startedAt,
        m.endedAt,
        m.durationMinutes
    FROM Runs r
    INNER JOIN Users u
        ON u.userUuid = r.userUuid
    LEFT JOIN Metadata m
        ON m.metadataID = r.metadataID
    WHERE r.isRunning = FALSE
        AND DATE(COALESCE(m.endedAt, m.startedAt)) = CURRENT_DATE()
    ORDER BY r.earnings DESC, r.moneyTotal DESC, r.runId ASC
    LIMIT safeLimit;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS updateTimePlayed; 
DELIMITER //
CREATE PROCEDURE updateTimePlayed(IN p_runId INT)
BEGIN
    DECLARE new_time BIGINT; 

    SELECT TIMESTAMPDIFF(MINUTE, m.lastSavedAt, CURRENT_TIMESTAMP)
        INTO new_time 
        FROM Runs AS r INNER JOIN 
            Metadata AS m
            USING (metadataID)
        WHERE r.runId = p_runId LIMIT 1; 
    
    UPDATE Metadata m
    INNER JOIN Runs r
        USING (metadataID)
    SET
        m.durationMinutes = COALESCE(m.durationMinutes, 0) + new_time ,
        m.lastSavedAt = CURRENT_TIMESTAMP
    WHERE r.runId = p_runId;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS killSession;
DELIMITER //
CREATE PROCEDURE killSession(IN p_sessionID VARCHAR(36))
BEGIN
    DECLARE v_runId INT;
    DECLARE new_time BIGINT; 

    IF p_sessionID IS NOT NULL THEN
        SELECT ru.runId INTO v_runId FROM Running as ru 
        WHERE ru.sessionID = p_sessionID ;


        SELECT TIMESTAMPDIFF(MINUTE, m.lastSavedAt, NOW()) 
            INTO new_time 
            FROM Runs AS r INNER JOIN 
                Metadata AS m
                USING (metadataID)
            WHERE r.runId = v_runId LIMIT 1; 
        
        UPDATE Metadata AS m INNER JOIN Runs AS r 
            USING (metadataID)
            SET lastSavedAt = NULL, m.durationMinutes = COALESCE(m.durationMinutes, 0) + new_time 
            WHERE r.runId = v_runId; 

        UPDATE Running as ru 
        SET sessionID = NULL 
        WHERE ru.sessionID = p_sessionID;
    END IF; 
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS endGame;
DELIMITER //
CREATE PROCEDURE endGame(IN runId INT, IN typeEnd varchar(20))
BEGIN
    UPDATE Metadata as m SET m.typeEnd = typeEnd WHERE m.metadataID = (SELECT metadataID FROM Runs AS r WHERE r.runId = runId);
END //
DELIMITER ;