USE gambling_problem;

-- Password for every dummy user: Dummy123!
SET @dummy_password_hash = '$argon2id$v=19$m=65536,t=3,p=4$cTQwF5uHH3L+yRI5JQHnLQ$HmiZPrG39xBodh5n5Muu2f4c5/uw1DNjQC33GACh/2o';

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM ExploitsUsed;
DELETE FROM Whitelist;
DELETE FROM Running;
DELETE FROM Runs;
DELETE FROM Metadata;
DELETE FROM Users;
DELETE FROM Ranks;
DELETE FROM Mafia;
DELETE FROM ExploitsData;

ALTER TABLE Runs AUTO_INCREMENT = 1;
ALTER TABLE Metadata AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO ExploitsData (exploitID, name, price, type, description)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 50
)
SELECT
  CASE n
    WHEN 1 THEN 'see_flop'
    WHEN 2 THEN 'pick_other_player'
    WHEN 3 THEN 'no_shuffle'
    WHEN 4 THEN 'change_to_random'
    ELSE CONCAT('dummy_exploit_', LPAD(n, 2, '0'))
  END AS exploitID,
  CASE n
    WHEN 1 THEN 'See flop'
    WHEN 2 THEN 'Pick other player'
    WHEN 3 THEN 'Disable Card Shuffle'
    WHEN 4 THEN 'Change My Hand'
    ELSE CONCAT('Dummy Exploit ', n)
  END AS name,
  100 + (n * 25) AS price,
  CASE n % 3
    WHEN 0 THEN 'common'
    WHEN 1 THEN 'high'
    ELSE 'critical'
  END AS type,
  CONCAT('Dummy exploit description ', n) AS description
FROM seq;

INSERT INTO Users (userUUID, username, password)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 50
)
SELECT
  CONCAT('00000000-0000-0000-0000-', LPAD(n, 12, '0')) AS userUUID,
  CONCAT('dummy_user_', LPAD(n, 2, '0')) AS username,
  @dummy_password_hash AS password
FROM seq;

INSERT IGNORE INTO Whitelist (userUuid, exploitID)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 50
)
SELECT
  CONCAT('00000000-0000-0000-0000-', LPAD(n, 12, '0')) AS userUUID,
  'see_flop' AS exploitID
FROM seq;

INSERT INTO Runs (userUuid, moneyTotal, moneySpend, isRunning)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 50
)
SELECT
  CONCAT('00000000-0000-0000-0000-', LPAD(n, 12, '0')) AS userUUID,
  500 + (n * 175) AS moneyTotal,
  75 + (n * 31) AS moneySpend,
  CASE WHEN n <= 10 THEN TRUE ELSE FALSE END AS isRunning
FROM seq;

UPDATE Metadata m
INNER JOIN Runs r ON r.metadataID = m.metadataID
SET
  m.typeEnd = CASE
    WHEN r.isRunning = TRUE THEN NULL
    WHEN r.runId % 4 = 0 THEN 'WIN'
    WHEN r.runId % 4 = 1 THEN 'BANKRUPT'
    WHEN r.runId % 4 = 2 THEN 'TERMINATED'
    ELSE 'DEATH'
  END,
  m.level = 1 + (r.runId % 10),
  m.startedAt = NOW() - INTERVAL (r.runId * 13) MINUTE,
  m.endedAt = CASE
    WHEN r.isRunning = TRUE THEN NULL
    ELSE NOW() - INTERVAL (r.runId * 5) MINUTE
  END,
  m.lastSavedAt = NOW() - INTERVAL (r.runId * 3) MINUTE,
  m.durationMinutes = CASE
    WHEN r.isRunning = TRUE THEN 5 + (r.runId * 2)
    ELSE 20 + (r.runId * 4)
  END;

UPDATE Running ru
INNER JOIN Runs r ON r.runId = ru.runId
SET
  ru.data = JSON_OBJECT(
    'phase', CASE r.runId % 4
      WHEN 0 THEN 'river'
      WHEN 1 THEN 'shop'
      WHEN 2 THEN 'flop'
      ELSE 'boss'
    END,
    'chips', r.moneyTotal,
    'round', r.runId + 3
  ),
  ru.sessionID = CASE
    WHEN r.isRunning = TRUE THEN CONCAT('dummy_session_', LPAD(r.runId, 2, '0'))
    ELSE NULL
  END,
  ru.slot = 1;

INSERT INTO ExploitsUsed (runId, exploitID)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 50
)
SELECT
  n AS runId,
  CASE n % 4
    WHEN 0 THEN 'see_flop'
    WHEN 1 THEN 'pick_other_player'
    WHEN 2 THEN 'no_shuffle'
    ELSE 'change_to_random'
  END AS exploitID
FROM seq;

INSERT INTO Ranks (rankUnlock, exploitID, levelUnlock)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 50
)
SELECT
  2000 + (n * 100) AS rankUnlock,
  CASE n % 4
    WHEN 0 THEN 'see_flop'
    WHEN 1 THEN 'pick_other_player'
    WHEN 2 THEN 'no_shuffle'
    ELSE 'change_to_random'
  END AS exploitID,
  n - 1 AS levelUnlock
FROM seq;

INSERT INTO Mafia (level_creadit, credit, rounds)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 50
)
SELECT
  n - 1 AS level_creadit,
  500 + (n * 1500) AS credit,
  5 + n AS rounds
FROM seq;
