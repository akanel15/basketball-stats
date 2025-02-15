import { SetType } from "./set";
import { initialBaseStats, Stat, StatsType } from "./stats";

export enum Team {
  Us,
  Opponent,
}

export enum PeriodType {
  Halves = 2,
  Quarters = 4,
}

export type PlayByPlayType = {
  playerId: string;
  action: Stat;
};

export type PeriodInfo = {
  [Team.Us]: number;
  [Team.Opponent]: number;
  playByPlay: PlayByPlayType[];
};

export type BoxScoreType = Record<string, StatsType>; //<playerId, stats>

//this is stored in the game store in a record <gameId,GameType>
export type GameType = {
  id: string;
  teamId: string; //to keep track of which games should be stored for which team
  opposingTeamName: string;
  activePlayers: string[]; //list of players
  activeSets: string[]; //list of sets
  gamePlayedList: string[]; //list of players who checked in the game for player stats
  periodType: PeriodType;

  //stat categories
  statTotals: { [Team.Us]: StatsType; [Team.Opponent]: StatsType }; //for quick access to all game stat totals for both teams
  periods: PeriodInfo[]; //for ONLY holding the quarter by quarter and total scores and playByPlay info
  boxScore: BoxScoreType; //only for teamId's players
  isFinished: boolean;

  //other stats
  sets: Record<string, SetType>;
};

export const createGame = (
  id: string,
  teamId: string,
  opposingTeamName: string,
  periodType: PeriodType,
): GameType => ({
  id: id,
  teamId: teamId,
  opposingTeamName: opposingTeamName,
  activePlayers: [],
  activeSets: [],
  gamePlayedList: [],
  periodType: periodType,

  statTotals: {
    [Team.Us]: { ...initialBaseStats },
    [Team.Opponent]: { ...initialBaseStats },
  },
  periods: [],
  boxScore: {},
  isFinished: false,

  sets: {},
});

//todo for game store and page
//set up quarters/periods in the view and allow play by play events to be displayed there
//ability to undo/delete a play
