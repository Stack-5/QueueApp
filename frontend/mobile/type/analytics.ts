export type AnalyticsData = {
  [date: string]: {
    total: number;
    successful: number;
    unsuccessful: number;
  };
}
