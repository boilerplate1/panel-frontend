import { Suspense, type ReactNode } from 'react';
import { Loader } from '../Loader/Loader';

interface LazyLoadProps {
  children: ReactNode;
}

export function LazyLoad({ children }: LazyLoadProps) {
  return <Suspense fallback={<Loader fullPage />}>{children}</Suspense>;
}
