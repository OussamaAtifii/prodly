export interface Summary {
  completed: SummaryItem;
  inProcess: SummaryItem;
  created: SummaryItem;
}

export interface SummaryItem {
  previous: number;
  current: number;
  percentage: number;
}
