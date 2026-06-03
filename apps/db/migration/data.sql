DELETE FROM Mafia;
INSERT INTO Mafia (level_creadit, credit, rounds) VALUES
  (0, 500, 10),
  (1, 10000, 40), 
  (2, 100000, 80)
; 

DELETE FROM Ranks; 
INSERT INTO Ranks (unlockLevel, exploitID) VALUES
  (1, 'pick_other_player')
;