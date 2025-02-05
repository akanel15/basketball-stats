export enum Stat {
  Points = "Points",
  Assists = "Assists",
  DefensiveRebounds = "DefensiveRebounds",
  OffensiveRebounds = "OffensiveRebounds",
  Steals = "Steals",
  Deflections = "Deflections",
  Blocks = "Blocks",
  Turnovers = "Turnovers",
  TwoPointMakes = "TwoPointMakes",
  TwoPointAttempts = "TwoPointAttempts",
  ThreePointMakes = "ThreePointMakes",
  ThreePointAttempts = "ThreePointAttempts",
  FreeThrowsMade = "FreeThrowsMade",
  FreeThrowsAttempted = "FreeThrowsAttempted",
  FoulsCommitted = "FoulsCommitted",
  FoulsDrawn = "FoulsDrawn",
}

export enum ShootingMakes {
  FreeThrowsMake = "FT Make",
  TwoPointMake = "2PT Make",
  ThreePointMake = "3PT Make",
}
export enum ShootingMiss {
  FreeThrowsMiss = "FT Miss",
  TwoPointMiss = "2PT Miss",
  ThreePointMiss = "3PT Miss",
}

export enum RebAst {
  Assists = "Assist",
  OffensiveRebound = "Off Rebound",
  DefensiveRebound = "Def Rebound",
}

export enum FoulTO {
  Turnover = "Turnover",
  FoulCommitted = "Foul Committed",
  FoulsDrawn = "Fould Drawn",
}

export enum Defensive {
  Steal = "Steal",
  Block = "Block",
  Deflection = "Deflection",
}

export const StatMapping: Record<
  ShootingMakes | ShootingMiss | RebAst | FoulTO | Defensive,
  Stat[]
> = {
  // Makes
  [ShootingMakes.FreeThrowsMake]: [
    Stat.FreeThrowsMade,
    Stat.FreeThrowsAttempted,
  ],
  [ShootingMakes.TwoPointMake]: [Stat.TwoPointMakes, Stat.TwoPointAttempts],
  [ShootingMakes.ThreePointMake]: [
    Stat.ThreePointMakes,
    Stat.ThreePointAttempts,
  ],

  // Misses
  [ShootingMiss.FreeThrowsMiss]: [Stat.FreeThrowsAttempted],
  [ShootingMiss.TwoPointMiss]: [Stat.TwoPointAttempts],
  [ShootingMiss.ThreePointMiss]: [Stat.ThreePointAttempts],

  // Rebounds & Assists
  [RebAst.Assists]: [Stat.Assists],
  [RebAst.OffensiveRebound]: [Stat.OffensiveRebounds],
  [RebAst.DefensiveRebound]: [Stat.DefensiveRebounds],

  // Fouls & Turnovers
  [FoulTO.Turnover]: [Stat.Turnovers],
  [FoulTO.FoulCommitted]: [Stat.FoulsCommitted],
  [FoulTO.FoulsDrawn]: [Stat.FoulsDrawn],

  // Defensive Plays
  [Defensive.Steal]: [Stat.Steals],
  [Defensive.Block]: [Stat.Blocks],
  [Defensive.Deflection]: [Stat.Deflections],
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
};
