import { initialBaseStats, StatsType } from "./stats";

export enum Team {
  Us,
  Opponent,
}

export type PlayByPlayType = {
  playerId: string;
  action: string;
};

export type Score = { us: number; opponent: number };

export type BoxScoreType = Record<string, StatsType>; //<playerId, stats>

//this is stored in the game store in a record <gameId,GameType>
export type GameType = {
  id: string;
  teamId: string; //to keep track of which games should be stored for which team
  opposingTeamName: string;

  //stat categories
  statTotals: { [Team.Us]: StatsType; [Team.Opponent]: StatsType }; //for quick access to game totals for both teams
  periods: Score[]; //for ONLY holding the quarter by quarter and total scores
  boxScore: BoxScoreType; //only for teamId's players
  playByPlay: PlayByPlayType[];
  isFinished: boolean;
};

export const createGame = (
  id: string,
  teamId: string,
  opposingTeamName: string,
): GameType => ({
  id: id,
  teamId: teamId,
  opposingTeamName: opposingTeamName,
  statTotals: {
    [Team.Us]: { ...initialBaseStats },
    [Team.Opponent]: { ...initialBaseStats },
  },
  periods: [],
  boxScore: {},
  playByPlay: [],
  isFinished: false,
});
