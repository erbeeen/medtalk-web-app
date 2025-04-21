import mongoose from "mongoose";

export type ScheduleType = {
  userID: mongoose.Types.ObjectId | string;
  medicineName: string;
  dosageStrength: string;
  perWeekFrequency: string;
  perWeekOption?: string;
  daysPerWeek: Array<Number>;
  perDayFrequency: Number;
  perDayOption?: string;
  intakeTime: Array<Date>;
  intakeInstruction?: string;
  startDate: Date;
  endDate?: Date;
};

export type ScheduleDocument = ScheduleType & mongoose.Document;

const scheduleSchema = new mongoose.Schema({
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
  dosageStrength: {
    type: String,
    required: true,
  },
  perWeekFrequency: {
    type: String,
    required: true,
  },
  perWeekOption: {
    type: String,
  },
  daysPerWeek: {
    type: [Number],
    required: true,
  },
  perDayFrequency: {
    type: Number,
    required: true,
  },
  perDayOption: {
    type: String,
  },
  intakeTime: {
    type: [Date],
    required: true,
  },
  intakeInstruction: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
});

const Schedule = mongoose.model("user_schedules", scheduleSchema);

export default Schedule;
