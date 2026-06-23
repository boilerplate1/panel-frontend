export interface PaginatedDeviceResponse {
  items: Array<{
    id: string;
    name: string;
    type: string;
    lastSeen: string;
    authorizedAt: string;
    status: string;
    expiresAt: string | null;
    countryCode: string | null;
    ipAddress: string | null;
    isPrimary: boolean;
    isCurrent: boolean;
    activeSessionsCount: number;
  }>;
  total: number;
  page: number;
  totalPages: number;
}
