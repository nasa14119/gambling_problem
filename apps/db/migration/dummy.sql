USE gambling_problem;

INSERT INTO Users (userUUID, username, password) VALUES
('11111111-1111-1111-1111-111111111111', 'alice', 'hash_dummy_alice'),
('22222222-2222-2222-2222-222222222222', 'bob', 'hash_dummy_bob'),
('33333333-3333-3333-3333-333333333333', 'carol', 'hash_dummy_carol'),
('44444444-4444-4444-4444-444444444444', 'dave', 'hash_dummy_dave')
ON DUPLICATE KEY UPDATE
    username = VALUES(username),
    password = VALUES(password);

INSERT INTO Metadata (metadataID, typeEnd, level, saveData, startedAt, endedAt, lastSavedAt) VALUES
(1, NULL, 7, '{"phase":"boss","result":"running"}', NOW(), NULL, NOW()),
(2, NULL, 4, '{"phase":"shop","result":"running"}', NOW(), NULL, NOW()),
(3, NULL, 9, '{"phase":"river","result":"running"}', NOW(), NULL, NOW()),
(4, 'lose', 6, '{"reason":"bankrupt","handsPlayed":18}', NOW(), NULL, NULL),
(5, 'win', 10, '{"reason":"jackpot","handsPlayed":31}', NOW(), NULL, NULL),
(6, 'lose', 3, '{"reason":"bad_bet","handsPlayed":9}', NOW(), NULL, NULL),
(7, 'quit', 5, '{"reason":"player_left","handsPlayed":12}', NOW(), NULL, NULL),
(8, 'lose', 8, '{"reason":"dealer_blackjack","handsPlayed":22}', NOW(), NULL, NULL)
ON DUPLICATE KEY UPDATE
    typeEnd = VALUES(typeEnd),
    level = VALUES(level),
    saveData = VALUES(saveData),
    startedAt = VALUES(startedAt),
    endedAt = VALUES(endedAt),
    lastSavedAt = VALUES(lastSavedAt);

INSERT INTO Runs (runID, userUUID, moneyTotal, moneySpend, isRunning, metadataID) VALUES
(1, '11111111-1111-1111-1111-111111111111', 1200.00, 120.00, TRUE, 1),
(2, '22222222-2222-2222-2222-222222222222', 780.00, 80.00, TRUE, 2),
(3, '33333333-3333-3333-3333-333333333333', 1550.00, 210.00, TRUE, 3),
(4, '11111111-1111-1111-1111-111111111111', 900.00, 340.00, FALSE, 4),
(5, '11111111-1111-1111-1111-111111111111', 2800.00, 600.00, FALSE, 5),
(6, '22222222-2222-2222-2222-222222222222', 500.00, 260.00, FALSE, 6),
(7, '33333333-3333-3333-3333-333333333333', 1300.00, 420.00, FALSE, 7),
(8, '44444444-4444-4444-4444-444444444444', 1700.00, 510.00, FALSE, 8)
ON DUPLICATE KEY UPDATE
    userUUID = VALUES(userUUID),
    moneyTotal = VALUES(moneyTotal),
    moneySpend = VALUES(moneySpend),
    isRunning = VALUES(isRunning),
    metadataID = VALUES(metadataID);

UPDATE Metadata SET
    startedAt = NOW() - INTERVAL 35 MINUTE,
    endedAt = NULL,
    lastSavedAt = NOW() - INTERVAL 1 MINUTE
WHERE metadataID = 1;

UPDATE Metadata SET
    startedAt = NOW() - INTERVAL 18 MINUTE,
    endedAt = NULL,
    lastSavedAt = NOW() - INTERVAL 3 MINUTE
WHERE metadataID = 2;

UPDATE Metadata SET
    startedAt = NOW() - INTERVAL 50 MINUTE,
    endedAt = NULL,
    lastSavedAt = NOW() - INTERVAL 30 SECOND
WHERE metadataID = 3;

UPDATE Metadata SET
    startedAt = NOW() - INTERVAL 2 HOUR,
    endedAt = NOW() - INTERVAL 95 MINUTE,
    lastSavedAt = NOW() - INTERVAL 96 MINUTE
WHERE metadataID = 4;

UPDATE Metadata SET
    startedAt = NOW() - INTERVAL 75 MINUTE,
    endedAt = NOW() - INTERVAL 15 MINUTE,
    lastSavedAt = NOW() - INTERVAL 16 MINUTE
WHERE metadataID = 5;

UPDATE Metadata SET
    startedAt = NOW() - INTERVAL 1 DAY - INTERVAL 40 MINUTE,
    endedAt = NOW() - INTERVAL 1 DAY - INTERVAL 10 MINUTE,
    lastSavedAt = NOW() - INTERVAL 1 DAY - INTERVAL 11 MINUTE
WHERE metadataID = 6;

UPDATE Metadata SET
    startedAt = NOW() - INTERVAL 3 HOUR,
    endedAt = NOW() - INTERVAL 2 HOUR - INTERVAL 20 MINUTE,
    lastSavedAt = NOW() - INTERVAL 2 HOUR - INTERVAL 21 MINUTE
WHERE metadataID = 7;

UPDATE Metadata SET
    startedAt = NOW() - INTERVAL 45 MINUTE,
    endedAt = NOW() - INTERVAL 5 MINUTE,
    lastSavedAt = NOW() - INTERVAL 6 MINUTE
WHERE metadataID = 8;

INSERT INTO Running (runID, data, sessionID) VALUES
(1, '{"phase":"boss","hand":["AS","KH"],"chips":1200,"round":14}', 'session_alice_live'),
(2, '{"phase":"shop","chips":780,"round":7}', 'session_bob_live'),
(3, '{"phase":"river","hand":["10H","10D"],"chips":1550,"round":20}', 'session_carol_live')
ON DUPLICATE KEY UPDATE
    data = VALUES(data),
    sessionID = VALUES(sessionID);

INSERT INTO ExploitsData (exploitID, name, price, type, description) VALUES
(1, 'Card Peek', 100.00, 'info', 'Reveal one hidden card.'),
(2, 'Double Bet', 200.00, 'money', 'Double the current bet.'),
(3, 'Undo Loss', 300.00, 'defense', 'Cancel one losing round.'),
(4, 'Lucky Draw', 150.00, 'chance', 'Improve the next draw.'),
(5, 'House Edge Hack', 500.00, 'rare', 'Reduce house edge for one round.')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    price = VALUES(price),
    type = VALUES(type),
    description = VALUES(description);

INSERT INTO Whitelist (userUUID, exploitID) VALUES
('11111111-1111-1111-1111-111111111111', 1),
('11111111-1111-1111-1111-111111111111', 2),
('11111111-1111-1111-1111-111111111111', 5),
('22222222-2222-2222-2222-222222222222', 1),
('22222222-2222-2222-2222-222222222222', 3),
('33333333-3333-3333-3333-333333333333', 1),
('33333333-3333-3333-3333-333333333333', 2),
('33333333-3333-3333-3333-333333333333', 4),
('44444444-4444-4444-4444-444444444444', 2),
('44444444-4444-4444-4444-444444444444', 5)
ON DUPLICATE KEY UPDATE
    exploitID = VALUES(exploitID);

INSERT INTO ExploitsUsed (runID, exploitID, quantity) VALUES
(1, 1, 2),
(1, 4, 1),
(2, 1, 1),
(2, 3, 1),
(3, 2, 3),
(3, 4, 2),
(4, 1, 1),
(4, 2, 1),
(5, 1, 4),
(5, 5, 2),
(6, 3, 1),
(7, 4, 3),
(8, 2, 2),
(8, 5, 1)
ON DUPLICATE KEY UPDATE
    quantity = VALUES(quantity);

UPDATE Runs r
LEFT JOIN (
    SELECT
        eu.runID,
        SUM(eu.quantity * e.price) AS exploitCost
    FROM ExploitsUsed eu
    INNER JOIN ExploitsData e
        ON e.exploitID = eu.exploitID
    GROUP BY eu.runID
) costs
    ON costs.runID = r.runID
SET r.moneySpend = CASE r.runID
    WHEN 1 THEN 120.00
    WHEN 2 THEN 80.00
    WHEN 3 THEN 210.00
    WHEN 4 THEN 340.00
    WHEN 5 THEN 600.00
    WHEN 6 THEN 260.00
    WHEN 7 THEN 420.00
    WHEN 8 THEN 510.00
    ELSE r.moneySpend
END + COALESCE(costs.exploitCost, 0)
WHERE r.runID IN (1, 2, 3, 4, 5, 6, 7, 8);
