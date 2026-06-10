DELETE FROM Mafia;
INSERT INTO Mafia (level_creadit, credit, rounds) VALUES
  (0, 500, 10),
  (1, 10000, 40), 
  (2, 100000, 80)
; 

DELETE FROM Ranks; 
INSERT INTO Ranks (rankUnlock, exploitID, levelUnlock) VALUES
  (2200, 'change_to_random', 0), 
  (3000, 'pick_other_player', 1), 
  (3500, 'no_shuffle', 1)
;