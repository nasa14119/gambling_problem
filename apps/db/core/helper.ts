import { NewDebt } from "@repo/types/db";
type QuerryRank = () => Promise<NewDebt>;
export const getQuerryRank: QuerryRank = (() => {
  let i = 0;
  const newRank: NewDebt = {
    credit: 1_000,
    rounds: 10,
  };
  return async () => ({
    credit: newRank.credit * 10 ** ++i,
    rounds: newRank.rounds * 2 ** i,
  });
})();
