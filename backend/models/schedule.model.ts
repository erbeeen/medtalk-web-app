import mongoose from "mongoose";

// NOTE: old schema
// export type ScheduleType = {
//   userID: mongoose.Types.ObjectId | string;
//   medicineName: string;
//   amount: string;
//   perWeekFrequency: string;
//   perWeekOption?: string;
//   daysPerWeek: Array<Number>;
//   perDayFrequency: Number;
//   perDayOption?: string;
//   intakeTime: Array<Date>;
//   intakeInstruction?: string;
//   startDate: Date;
//   endDate?: Date;
// };

// const scheduleSchema = new mongoose.Schema({
//   userID: {
//     type: mongoose.SchemaTypes.ObjectId,
//     required: true,
//   },
//   medicineName: {
//     type: String,
//     required: true,
//   },
//   amount: {
//     type: String,
//     required: true,
//   },
//   perWeekFrequency: {
//     type: String,
//     required: true,
//   },
//   perWeekOption: {
//     type: String,
//     required: false
//   },
//   daysPerWeek: {
//     type: [Number],
//     required: true,
//   },
//   perDayFrequency: {
//     type: Number,
//     required: true,
//   },
//   perDayOption: {
//     type: String,
//     required: false,
//   },
//   intakeTime: {
//     type: [Date],
//     required: true,
//   },
//   intakeInstruction: {
//     type: String,
//     required: false,
//   },
//   startDate: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
//   endDate: {
//     type: Date,
//   },
// });

// TODO: new data fields:
// UserID
// Medication name
// Measurement: g, mg, ml etc
// (tbd)Amount(?) 5 *measurement
// day
// intake time
// intake instruction (2 pills etc)
// (tbd) natake na yung gamot: true/false
// (tbd) date

export type ScheduleType = {
  userID: mongoose.Types.ObjectId | string;
  medicineName: string;
  measurement: string;
  intakeInstruction?: string;
  isTaken: boolean;
  date: Date;
};

const scheduleSchema = new mongoose.Schema({
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
  measurement: {
    type: String,
    required: true,
  },
  intakeInstruction: {
    type: String,
    required: false,
  },
  isTaken: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

export type ScheduleDocument = ScheduleType & mongoose.Document;

const Schedule = mongoose.model("user_schedules", scheduleSchema);

export default Schedule;
