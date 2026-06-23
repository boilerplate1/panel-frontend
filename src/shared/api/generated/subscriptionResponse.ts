export interface SubscriptionResponse {
  id: number;
  planId: number;
  planName: string;
  remnaUserId: string;
  remnaSubLink: string;
  shortId: string;
  authKey: string;
  trafficTotal: number;
  trafficUsed: number;
  maxDevices: number;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELED' | 'SUSPENDED';
  createdAt: string;
  remnaSquads: { squadId: string; name: string }[];
}
