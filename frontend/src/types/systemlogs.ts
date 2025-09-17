export type SystemLogType = {
  _id?: string;
  timestamp: Date;
  level: string;
  source: string;
  category: string;
  message: string;
  initiated_by: string;
  data: any;
};
