export type ScheduleType = {
  status?: string;
  _id?: string;
  userID: string;
  medicineName: string;
  measurement: string;
  intakeInstruction: string;
  isTaken: string;
  date: Date;
  actions?: string
};
