export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  zipCode?: string;
  district?: string;
  state?: string;
}

export interface Bill {
  id: string;
  title: string;
  summary: string;
  aiSummary?: string;
  status: string;
  introducedDate?: string;
  lastActionDate?: string;
  sponsor?: string;
  level: 'federal' | 'state';
  state?: string;
  chamber?: 'house' | 'senate';
  billNumber: string;
  fullTextUrl?: string;
  upvotes: number;
  downvotes: number;
}

export interface Amendment {
  id: string;
  billId: string;
  userId: string;
  content: string;
  cleanedContent?: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  BillDetail: { billId: string };
  AmendBill: { billId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Notifications: undefined;
  Profile: undefined;
};
