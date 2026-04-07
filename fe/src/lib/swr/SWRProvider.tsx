'use client';

import * as React from 'react';
import { SWRConfig } from 'swr';
import { swrFetcher } from './swrFetcher';

interface Props {
  children: React.ReactNode;
}
export default function SWRProvider({ children }: Props) {
  return <SWRConfig value={{ fetcher: swrFetcher }}>{children}</SWRConfig>;
}
