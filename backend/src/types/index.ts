import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  zipCode?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  zipCode?: string;
  district?: string;
  state?: string;
}

export interface VoteDTO {
  voteType: 'upvote' | 'downvote';
}

export interface CreateAmendmentDTO {
  content: string;
}

export interface BillFeedQuery {
  state?: string;
  district?: string;
  page?: string;
  limit?: string;
  level?: 'federal' | 'state';
}

export interface DistrictInfo {
  state: string;
  district: string;
  representatives: Representative[];
}

export interface Representative {
  name: string;
  party: string;
  chamber: 'house' | 'senate';
  district?: string;
}
