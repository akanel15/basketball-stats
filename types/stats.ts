export enum Stat {
  Points,
  Assists,
  DefensiveRebounds,
  OffensiveRebounds,
  Steals,
  Deflections,
  Blocks,
  Turnovers,
  TwoPointMakes,
  TwoPointAttempts,
  ThreePointMakes,
  ThreePointAttempts,
  FreeThrowsMade,
  FreeThrowsAttempted,
  FoulsCommitted,
  FoulsDrawn,
}

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
