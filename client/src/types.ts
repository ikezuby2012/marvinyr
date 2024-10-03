// src/pages/types.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  accessRole: "USER" | "AUTHOR" | "AFFILIATOR" | "ADMIN";
}

export interface ReferralLink {
  _id: string;
  AffliateId: string;
  CourseId: string;
  Link: string;
  expired?: boolean;
  expired_at?: Date;
  isSoftDeleted: boolean;
}
