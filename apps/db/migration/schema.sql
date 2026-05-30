CREATE TABLE IF NOT EXISTS Users (
    userUUID CHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Metadata (
    metadataID INT AUTO_INCREMENT PRIMARY KEY,
    typeEnd VARCHAR(50),
    level INT,
    startedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endedAt TIMESTAMP NULL,
    lastSavedAt TIMESTAMP NULL,
    durationSeconds INT GENERATED ALWAYS AS (
        TIMESTAMPDIFF(SECOND, startedAt, endedAt)
    ) STORED
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Runs (
    runID INT AUTO_INCREMENT PRIMARY KEY,
    userUUID CHAR(36) NOT NULL,
    moneyTotal DECIMAL(10,2) DEFAULT 0,
    moneySpend DECIMAL(10,2) DEFAULT 0,
    earnings DECIMAL(10,2) DEFAULT 0,
    isRunning BOOLEAN DEFAULT TRUE,
    metadataID INT,

    CONSTRAINT fkRunsUser
        FOREIGN KEY (userUUID)
        REFERENCES Users(userUUID),

    CONSTRAINT fkRunsMetadata
        FOREIGN KEY (metadataID)
        REFERENCES Metadata(metadataID)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Running (
    runID INT PRIMARY KEY,
    data JSON,
    sessionID VARCHAR(100),

    CONSTRAINT fkRunningRun
        FOREIGN KEY (runID)
        REFERENCES Runs(runID)
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

CREATE TABLE IF NOT EXISTS  ExploitsUsed (
    runID INT NOT NULL,
    exploitID VARCHAR(30) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    PRIMARY KEY (runID, exploitID),

    CONSTRAINT fkExploitUsedRun
        FOREIGN KEY (runID)
        REFERENCES Runs(runID),

    CONSTRAINT fkExploitUsedExploit
        FOREIGN KEY (exploitID)
        REFERENCES ExploitsData(exploitID)
	
    
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Whitelist (
    userUUID CHAR(36) NOT NULL,
    exploitID VARCHAR(30) NOT NULL,

    PRIMARY KEY (userUUID, exploitID),

    CONSTRAINT fk_whitelist_user
        FOREIGN KEY (userUUID)
        REFERENCES Users(userUUID),

    CONSTRAINT fk_whitelist_exploit
        FOREIGN KEY (exploitID)
        REFERENCES ExploitsData(exploitID)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;
