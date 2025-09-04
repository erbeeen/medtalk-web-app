import mongoose from "mongoose";

export type SystemLogType = {
  _id?: string | mongoose.Types.ObjectId;
  timestamp: Date;
  level: string; 
  source: string;
  category: string;
  message: string;
  initiated_by: string;
  data?: any;
};

export type SystemLogDocument = SystemLogType & mongoose.Document;

const systemLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  level: {
    type: String,
    enum: ["info", "warn", "error", "debug"],
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  "initiated_by": {
    type: String,
    required: false,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  }
});

const SystemLog = mongoose.model("system_logs", systemLogSchema);

export default SystemLog;
