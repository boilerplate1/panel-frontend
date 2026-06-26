import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PaymentStage =
  | 'idle'
  | 'selecting_method'
  | 'selecting_sub_method'
  | 'creating'
  | 'active'
  | 'success'
  | 'failed'
  | 'checking';

interface ActivePayment {
  id: string;
  planId: number;
  provider: string;
  status: string;
  invoiceUrl?: string;
}

interface PaymentState {
  stage: PaymentStage;
  activePayment: ActivePayment | null;
  setStage: (stage: PaymentStage) => void;
  setActivePayment: (payment: ActivePayment | null) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      stage: 'idle',
      activePayment: null,
      setStage: (stage) => set({ stage }),
      setActivePayment: (payment) => set({ activePayment: payment }),
      reset: () => set({ stage: 'idle', activePayment: null }),
    }),
    {
      name: 'hypex_payment_state',
    },
  ),
);
