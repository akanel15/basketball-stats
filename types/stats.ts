export enum Stat {
  Points = "Points",
  Assists = "assist",
  DefensiveRebounds = "defensive rebound",
  OffensiveRebounds = "offensive rebound",
  Steals = "steal",
  Deflections = "deflection",
  Blocks = "block",
  Turnovers = "turnover",
  TwoPointMakes = "2pt made",
  TwoPointAttempts = "2pt miss",
  ThreePointMakes = "3pt made",
  ThreePointAttempts = "3pt missed",
  FreeThrowsMade = "free throw made",
  FreeThrowsAttempted = "free throw missed",
  FoulsCommitted = "foul committed",
  FoulsDrawn = "foul drawn",
  PlusMinus = "plus/minus",
}

export enum ActionType {
  ShootingMake = "ShootingMake",
  ShootingMiss = "ShootingMiss",
  ReboundAssist = "ReboundAssist",
  FoulTurnover = "FoulTurnover",
  DefensivePlay = "DefensivePlay",
}

export enum ShootingStatMake {
  FreeThrowMake = "FT Make",
  TwoPointMake = "2PT Make",
  ThreePointMake = "3PT Make",
}
export enum ShootingStatMiss {
  FreeThrowMiss = "FT Miss",
  TwoPointMiss = "2PT Miss",
  ThreePointMiss = "3PT Miss",
}

export enum ReboundAssistStat {
  Assist = "Assist",
  OffensiveRebound = "Offensive Rebound",
  DefensiveRebound = "Defensive Rebound",
}

export enum FoulTurnoverStat {
  Turnover = "Turnover",
  FoulCommitted = "Foul Committed",
  FoulDrawn = "Foul Drawn",
}

export enum DefensiveStat {
  Steal = "Steal",
  Block = "Block",
  Deflection = "Deflection",
}

export const StatMapping: Record<ActionType, Record<string, Stat[]>> = {
  [ActionType.ShootingMake]: {
    [ShootingStatMake.FreeThrowMake]: [
      Stat.FreeThrowsMade,
      Stat.FreeThrowsAttempted,
    ],
    [ShootingStatMake.TwoPointMake]: [
      Stat.TwoPointMakes,
      Stat.TwoPointAttempts,
    ],
    [ShootingStatMake.ThreePointMake]: [
      Stat.ThreePointMakes,
      Stat.ThreePointAttempts,
    ],
  },
  [ActionType.ShootingMiss]: {
    [ShootingStatMiss.FreeThrowMiss]: [Stat.FreeThrowsAttempted],
    [ShootingStatMiss.TwoPointMiss]: [Stat.TwoPointAttempts],
    [ShootingStatMiss.ThreePointMiss]: [Stat.ThreePointAttempts],
  },
  [ActionType.ReboundAssist]: {
    [ReboundAssistStat.Assist]: [Stat.Assists],
    [ReboundAssistStat.OffensiveRebound]: [Stat.OffensiveRebounds],
    [ReboundAssistStat.DefensiveRebound]: [Stat.DefensiveRebounds],
  },
  [ActionType.FoulTurnover]: {
    [FoulTurnoverStat.Turnover]: [Stat.Turnovers],
    [FoulTurnoverStat.FoulCommitted]: [Stat.FoulsCommitted],
    [FoulTurnoverStat.FoulDrawn]: [Stat.FoulsDrawn],
  },
  [ActionType.DefensivePlay]: {
    [DefensiveStat.Steal]: [Stat.Steals],
    [DefensiveStat.Block]: [Stat.Blocks],
    [DefensiveStat.Deflection]: [Stat.Deflections],
  },
};

export type StatsType = {
  [Stat.Points]: number;
  [Stat.Assists]: number;
  [Stat.DefensiveRebounds]: number;
  [Stat.OffensiveRebounds]: number;
  [Stat.Steals]: number;
  [Stat.Deflections]: number;
  [Stat.Blocks]: number;
  [Stat.Turnovers]: number;
  [Stat.TwoPointMakes]: number;
  [Stat.TwoPointAttempts]: number;
  [Stat.ThreePointMakes]: number;
  [Stat.ThreePointAttempts]: number;
  [Stat.FreeThrowsMade]: number;
  [Stat.FreeThrowsAttempted]: number;
  [Stat.FoulsCommitted]: number;
  [Stat.FoulsDrawn]: number;
  [Stat.PlusMinus]: number;
};

export const initialBaseStats: StatsType = {
  [Stat.Points]: 0,
  [Stat.Assists]: 0,
  [Stat.DefensiveRebounds]: 0,
  [Stat.OffensiveRebounds]: 0,
  [Stat.Steals]: 0,
  [Stat.Deflections]: 0,
  [Stat.Blocks]: 0,
  [Stat.Turnovers]: 0,
  [Stat.TwoPointMakes]: 0,
  [Stat.TwoPointAttempts]: 0,
  [Stat.ThreePointMakes]: 0,
  [Stat.ThreePointAttempts]: 0,
  [Stat.FreeThrowsMade]: 0,
  [Stat.FreeThrowsAttempted]: 0,
  [Stat.FoulsCommitted]: 0,
  [Stat.FoulsDrawn]: 0,
  [Stat.PlusMinus]: 0,
};
