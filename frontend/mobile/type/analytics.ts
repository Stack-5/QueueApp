export type AnalyticsData = {
  [stationID: string]: {
    total: number;
    successful: number;
    unsuccessful: number;
  };
}
