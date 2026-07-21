import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

export interface NavigateOptions {
  replace?: boolean;
}

type Id = string | number;

/** Host-owned URL topology. All builders return app-relative paths. */
export interface SiderRoutes {
  home(): string;
  captureBatches(): string;
  captureBatch(batchId: Id): string;
  myTools(): string;
  sites(): string;
  site(siteId: Id): string;
  tool(toolId: Id): string;
}

export interface SiderRouting {
  params: Record<string, string | undefined>;
  pathname: string;
  navigate: (path: string, options?: NavigateOptions) => void;
  currentLanguage: string;
  switchLanguage?: (lang: string) => void;
  routes: SiderRoutes;
}

const RoutingContext = createContext<SiderRouting | null>(null);

export function RoutingProvider({
  children,
  params,
  pathname,
  navigate,
  currentLanguage,
  switchLanguage,
  routes,
}: SiderRouting & { children: ReactNode }) {
  const value = useMemo<SiderRouting>(
    () => ({ params, pathname, navigate, currentLanguage, switchLanguage, routes }),
    [params, pathname, navigate, currentLanguage, switchLanguage, routes]
  );
  return <RoutingContext.Provider value={value}>{children}</RoutingContext.Provider>;
}

export function useSiderRouting(): SiderRouting {
  const ctx = useContext(RoutingContext);
  if (!ctx) throw new Error('Sider UI: components must be rendered inside <RoutingProvider>');
  return ctx;
}

export function useRoutes(): SiderRoutes {
  return useSiderRouting().routes;
}

export function useRouteParams<
  T extends Record<string, string | undefined> = Record<string, string | undefined>,
>(): T {
  return useSiderRouting().params as T;
}

export function Redirect({ to, replace = true }: { to: string; replace?: boolean }) {
  const { navigate } = useSiderRouting();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);
  return null;
}
