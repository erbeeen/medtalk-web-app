export type FormattedSchedule = {
  status?: string;
  batchId?: string;
  medicineName: string;
  measurement: string;
  startDate: Date | string;
  endDate: Date | string;
  intakeTimes: string[];
  actions?: string;
  assignedBy?: string;
};
