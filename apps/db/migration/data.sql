DELETE FROM Mafia;
INSERT INTO Mafia (level_creadit, credit, rounds) VALUES
  (0, 500, 10),
  (1, 10000, 40), 
  (2, 100000, 80)
; 

DELETE FROM Ranks; 
INSERT INTO Ranks (rankUnlock, exploitID, levelUnlock) VALUES
  (2100, 'pick_other_player', 0), 
  (2500, 'no_shuffle', 0), 
  (3000, 'change_to_random', 0)
;