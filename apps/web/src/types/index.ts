export interface User {
  id: string;
  email: string;
  name?: string;
}

export type ItemType = 'SUBSCRIPTION' | 'ACCOUNT';
export type Duration = 'MONTHLY' | 'SEMIANNUAL' | 'ANNUAL';

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  email?: string;
  value?: number;
  billingDay?: number;
  duration?: Duration;
  notes?: string;
  iconPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemInput {
  type: ItemType;
  name: string;
  email?: string;
  password?: string;
  value?: number;
  billingDay?: number;
  duration?: Duration;
  notes?: string;
  icon?: File;
}

export interface DashboardStats {
  monthlyTotal: number;
  upcomingBillings: {
    id: string;
    name: string;
    value: number;
    billingDay: number;
    duration: Duration;
  }[];
}
