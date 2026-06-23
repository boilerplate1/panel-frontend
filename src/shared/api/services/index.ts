import { AuthService } from './auth.service';
import { BillingService } from './billing.service';
import { DevicesService } from './devices.service';
import { SystemService } from './system.service';

export const authService = new AuthService();
export const billingService = new BillingService();
export const devicesService = new DevicesService();
export const systemService = new SystemService();
