export type response = {
  status: number;
  message: string;
  data?: any;
  success?: boolean;
};

export type jwtPayload = {
  id: number;
  email: string;
  role: "user" | "admin";
};

export type notificationQueueData = {
  title: string;
  body: string;
  image_url?: string;
  user_ids: number[];
  do_save: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: jwtPayload;
    }
  }
}
declare module "socket.io" {
  interface Socket {
    userId: number;
    sessionId: string;
  }
}
export interface ImageUploadInput {
  modelName: string;
  field: string;
  id: string;
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  field: string;
  error?: any;
}

export type QueryTypes = {
  search?: string;
  page?: string | number;
  limit?: string | number;
  start_date?: string;
  end_date?: string;
  departmentId?: string;
  categoryId?: string;
  status?: string;
};

export type TestQueryTypes = QueryTypes;
export type CouponQueryTypes = Pick<
  QueryTypes,
  "search" | "page" | "limit" | "start_date" | "end_date"
>;
export type TransactionQueryTypes = Pick<
  QueryTypes,
  "search" | "page" | "limit" | "start_date" | "end_date" | "status"
>;
