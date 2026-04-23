import mongoose from "mongoose";

export type ScheduleType = {
  batchId: string;
  userID: mongoose.Types.ObjectId | string;
  medicineName: string;
  measurement: string;
  intakeInstruction?: string;
  isTaken: boolean;
  date: Date;
  assignedBy: string;
};

const scheduleSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
  },
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
  assignedBy: {
    type: String,
    required: true,
  },
});
scheduleSchema.set("timestamps", true);
scheduleSchema.index({ medicineName: 1, date: -1});

export type ScheduleDocument = ScheduleType & mongoose.Document;

const Schedule = mongoose.model("user_schedules", scheduleSchema);

export default Schedule;
