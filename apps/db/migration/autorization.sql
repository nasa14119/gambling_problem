CREATE TABLE IF NOT EXISTS autorizedUsers(
  userUuid VARCHAR(36) NOT NULL,

  CONSTRAINT fkUser
    FOREIGN KEY (userUuid)
    REFERENCES Users(userUuid)
    ON DELETE CASCADE
);

DROP PROCEDURE IF EXISTS autorizeUser;

DELIMITER //

CREATE PROCEDURE autorizeUser(
    IN p_username CHAR(50)
)
BEGIN
  DECLARE v_userId VARCHAR(36);

  SELECT u.userUuid INTO v_userId
  FROM Users u
  WHERE u.username = p_username;

  INSERT INTO autorizedUsers (userUuid) VALUES (v_userId);
END //

DELIMITER ;