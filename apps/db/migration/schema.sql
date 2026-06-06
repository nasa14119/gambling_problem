CREATE TABLE IF NOT EXISTS Users (
    userUuid CHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Metadata (
    metadataID INT AUTO_INCREMENT PRIMARY KEY,
    typeEnd ENUM("WIN", "BANKRUPT", "TERMINATED", "DEATH") DEFAULT NULL,
    level INT,
    startedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endedAt TIMESTAMP NULL,
    lastSavedAt TIMESTAMP NULL,
    durationMinutes BIGINT DEFAULT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Runs (
    runId INT AUTO_INCREMENT PRIMARY KEY,
    userUuid CHAR(36) NOT NULL,
    moneyTotal DECIMAL(10,2) DEFAULT 0,
    moneySpend DECIMAL(10,2) DEFAULT 0,
    earnings DECIMAL(10,2) DEFAULT 0,
    isRunning BOOLEAN DEFAULT TRUE,
    metadataID INT,

    CONSTRAINT fkRunsUser
        FOREIGN KEY (userUuid)
        REFERENCES Users(userUuid)
        ON DELETE CASCADE,

    CONSTRAINT fkRunsMetadata
        FOREIGN KEY (metadataID)
        REFERENCES Metadata(metadataID)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Running (
    runId INT PRIMARY KEY,
    data JSON,
    sessionID VARCHAR(100),
    slot TINYINT UNSIGNED DEFAULT 1, 

    CONSTRAINT fkRunningRun
        FOREIGN KEY (runId)
        REFERENCES Runs(runId)
        ON DELETE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ExploitsData (
    exploitID VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    description TEXT NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ExploitsUsed (
    runId INT NOT NULL,
    exploitID VARCHAR(30) NOT NULL,
    username VARCHAR(50) DEFAULT NULL, 
    FOREIGN KEY (runId) REFERENCES Runs(runId) ON DELETE CASCADE,
    FOREIGN KEY (exploitID) REFERENCES ExploitsData(exploitID) ON DELETE CASCADE , 
    FOREIGN KEY (username) REFERENCES Users(username) ON DELETE SET NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Whitelist (
    userUuid CHAR(36) NOT NULL,
    exploitID VARCHAR(30) NOT NULL,

    PRIMARY KEY (userUuid, exploitID),

    CONSTRAINT fk_whitelist_user
        FOREIGN KEY (userUuid)
        REFERENCES Users(userUuid)
        ON DELETE CASCADE,

    CONSTRAINT fk_whitelist_exploit
        FOREIGN KEY (exploitID)
        REFERENCES ExploitsData(exploitID)
        ON DELETE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Ranks(
    rankUnlock INT PRIMARY KEY,
    exploitID VARCHAR(30) NOT NULL,
    levelUnlock INT NOT NULL, 
    FOREIGN KEY (exploitID) REFERENCES ExploitsData(exploitID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 

CREATE TABLE IF NOT EXISTS Mafia(
    level_creadit INT PRIMARY KEY,
    credit INT NOT NULL,
    rounds INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 