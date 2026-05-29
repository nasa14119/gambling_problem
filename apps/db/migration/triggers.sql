USE gambling_problem;

DROP TRIGGER IF EXISTS trgEarningInsert;
DELIMITER //
CREATE TRIGGER trgEarningInsert
BEFORE INSERT ON Runs
FOR EACH ROW
BEGIN
    SET NEW.earnings = COALESCE(NEW.moneyTotal, 0) - COALESCE(NEW.moneySpend, 0);
END //
DELIMITER ;

DROP TRIGGER IF EXISTS trgEarningUpdate;
DELIMITER //
CREATE TRIGGER trgEarningUpdate
BEFORE UPDATE ON Runs
FOR EACH ROW
BEGIN
    SET NEW.earnings = COALESCE(NEW.moneyTotal, 0) - COALESCE(NEW.moneySpend, 0);
END //
DELIMITER ;

DROP TRIGGER IF EXISTS trgEndRunLeaderboard;
DELIMITER //
CREATE TRIGGER trgEndRunLeaderboard
BEFORE UPDATE ON Runs
FOR EACH ROW
BEGIN
    IF COALESCE(@skipRunEndRefresh, FALSE) = FALSE
        AND OLD.isRunning = TRUE
        AND NEW.isRunning = FALSE
        AND NEW.metadataID IS NOT NULL THEN
        UPDATE Metadata
        SET endedAt = COALESCE(endedAt, CURRENT_TIMESTAMP)
        WHERE metadataID = NEW.metadataID
            AND endedAt IS NULL;
    END IF;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS trgEndRunBestPlayer;
DELIMITER //
CREATE TRIGGER trgEndRunBestPlayer
AFTER UPDATE ON Runs
FOR EACH ROW
BEGIN
    IF COALESCE(@skipRunEndRefresh, FALSE) = FALSE
        AND OLD.isRunning = TRUE
        AND NEW.isRunning = FALSE
        AND NEW.metadataID IS NOT NULL THEN
        UPDATE Metadata
        SET lastSavedAt = CURRENT_TIMESTAMP
        WHERE metadataID = NEW.metadataID;
    END IF;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS trgMetadataEndCleanup;
DELIMITER //
CREATE TRIGGER trgMetadataEndCleanup
AFTER UPDATE ON Metadata
FOR EACH ROW
BEGIN
    IF (OLD.typeEnd IS NULL OR OLD.typeEnd <> NEW.typeEnd)
        AND NEW.typeEnd IS NOT NULL THEN
        SET @skipRunEndRefresh = TRUE;

        DELETE ru
        FROM Running ru
        INNER JOIN Runs r
            ON r.runID = ru.runID
        WHERE r.metadataID = NEW.metadataID;

        UPDATE Runs
        SET isRunning = FALSE
        WHERE metadataID = NEW.metadataID
            AND isRunning = TRUE;

        SET @skipRunEndRefresh = FALSE;
    END IF;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS trgExploitBought;
DELIMITER //
CREATE TRIGGER trgExploitBought
AFTER INSERT ON ExploitsUsed
FOR EACH ROW
BEGIN
    UPDATE Runs r
    INNER JOIN ExploitsData e
        ON e.exploitID = NEW.exploitID
    SET r.moneySpend = COALESCE(r.moneySpend, 0) + COALESCE(e.price, 0) * NEW.quantity
    WHERE r.runID = NEW.runID;
END //
DELIMITER ;
