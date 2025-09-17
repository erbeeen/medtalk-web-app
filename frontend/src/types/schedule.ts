export type ScheduleType = {
  status?: string;
  _id?: string;
  batchId?: string;
  userID: string;
  medicineName: string;
  measurement: string;
  intakeInstruction: string;
  isTaken: string;
  date: Date | string;
  actions?: string
};
