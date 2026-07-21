import { createContext, useContext, useMemo, type ComponentType, type ReactNode } from 'react';
import type { NetworkClient } from '@sudobility/types';

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

export interface SiderUiConfig {
  networkClient: NetworkClient;
  /** Firebase ID token; empty string when unauthenticated. */
  token: string;
  /** API base URL, e.g. `http://localhost:8090`. */
  apiUrl: string;
  SeoHead?: ComponentType<SEOHeadProps>;
}

const SiderUiConfigContext = createContext<SiderUiConfig | null>(null);

export function SiderUiProvider({
  children,
  networkClient,
  token,
  apiUrl,
  SeoHead,
}: SiderUiConfig & { children: ReactNode }) {
  const value = useMemo<SiderUiConfig>(
    () => ({ networkClient, token, apiUrl, SeoHead }),
    [networkClient, token, apiUrl, SeoHead]
  );
  return <SiderUiConfigContext.Provider value={value}>{children}</SiderUiConfigContext.Provider>;
}

export function useSiderUiConfig(): SiderUiConfig {
  const ctx = useContext(SiderUiConfigContext);
  if (!ctx) throw new Error('Sider UI: components must be rendered inside <SiderUiProvider>');
  return ctx;
}

export function useSiderApi(): { networkClient: NetworkClient; token: string; baseUrl: string } {
  const { networkClient, token, apiUrl } = useSiderUiConfig();
  return { networkClient, token, baseUrl: apiUrl };
}

export function SEOHead(props: SEOHeadProps) {
  const { SeoHead } = useSiderUiConfig();
  return SeoHead ? <SeoHead {...props} /> : null;
}
