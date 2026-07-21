import { useState } from 'react';
import {
  useSite,
  useSiteGraph,
  useSiteSlots,
  useSiteTemplates,
  useToolCatalog,
} from '@sudobility/sider_client';
import { useSiderApi } from '../context/config';
import { useRouteParams, useRoutes, useSiderRouting } from '../context/routing';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '../components/states';
import { DataTable } from '../components/data/DataTable';
import { JsonViewer } from '../components/data/JsonViewer';

const TABS = ['templates', 'tools', 'slots', 'graph', 'ux'] as const;
type Tab = (typeof TABS)[number];

export function SiteDetailPage() {
  const { networkClient, baseUrl, token } = useSiderApi();
  const { siteId } = useRouteParams<{ siteId?: string }>();
  const routes = useRoutes();
  const { navigate } = useSiderRouting();
  const [tab, setTab] = useState<Tab>('templates');

  const site = useSite(networkClient, baseUrl, token, siteId ?? null);
  const templates = useSiteTemplates(networkClient, baseUrl, token, siteId ?? null);
  const catalog = useToolCatalog(networkClient, baseUrl, token, siteId ?? null, {
    includeProvisional: true,
    includeFlagged: true,
  });
  const slots = useSiteSlots(networkClient, baseUrl, token, siteId ?? null);
  const graph = useSiteGraph(networkClient, baseUrl, token, siteId ?? null);

  if (site.isLoading) return <LoadingState />;
  if (site.error) return <ErrorState error={site.error} />;
  if (!site.data) return <EmptyState title="Site not found" />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{site.data.name}</h1>
        <p className="text-sm text-muted-foreground">{site.data.origin}</p>
      </div>
      <div className="flex gap-1 border-b border-border">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-sm capitalize ${
              tab === t
                ? 'border-b-2 border-primary font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'ux' ? 'UX recipes' : t === 'slots' ? 'Secret slots' : t}
          </button>
        ))}
      </div>

      {tab === 'templates' &&
        (templates.data?.length ? (
          <div className="flex flex-col gap-2">
            {templates.data.map(t => (
              <details key={t.id} className="rounded-lg border border-border bg-card p-3">
                <summary className="cursor-pointer text-sm text-foreground">
                  <span className="font-mono text-xs font-semibold text-primary">{t.method}</span>{' '}
                  <span className="font-mono text-xs">{t.pathTemplate}</span>
                </summary>
                <JsonViewer value={t} />
              </details>
            ))}
          </div>
        ) : (
          <EmptyState title="No endpoint templates yet" />
        ))}

      {tab === 'tools' &&
        (catalog.data?.tools?.length ? (
          <DataTable
            columns={[
              { key: 'name', header: 'Tool' },
              { key: 'safetyClass', header: 'Safety' },
              {
                key: 'status',
                header: 'Status',
                render: r => <StatusBadge status={String(r.status)} />,
              },
              { key: 'corroboratingUserCount', header: 'Corroborations' },
            ]}
            rows={(catalog.data.tools ?? []) as unknown as Record<string, unknown>[]}
            onRowClick={r => navigate(routes.tool(String(r.id)))}
          />
        ) : (
          <EmptyState title="No tools yet" />
        ))}

      {tab === 'slots' &&
        (slots.data?.length ? (
          <div className="flex flex-col gap-2">
            {slots.data.map(s => (
              <details key={s.id} className="rounded-lg border border-border bg-card p-3">
                <summary className="cursor-pointer font-mono text-xs text-foreground">
                  {s.id} — {s.kind} / {s.role}
                </summary>
                <JsonViewer value={s} />
              </details>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No secret slots"
            hint="Definitions only — values never exist server-side."
          />
        ))}

      {tab === 'graph' &&
        (graph.data?.length ? (
          <DataTable
            columns={[
              { key: 'fromTemplateId', header: 'From template' },
              { key: 'fromJsonPath', header: 'Output path' },
              { key: 'toTemplateId', header: 'To template' },
              { key: 'toParam', header: 'Input param' },
              { key: 'confidence', header: 'Confidence' },
            ]}
            rows={graph.data as unknown as Record<string, unknown>[]}
          />
        ) : (
          <EmptyState
            title="No graph edges"
            hint="Graph building is not implemented server-side yet."
          />
        ))}

      {tab === 'ux' &&
        (catalog.data?.uxRecipes?.length ? (
          <JsonViewer value={catalog.data.uxRecipes} />
        ) : (
          <EmptyState title="No UX recipes" />
        ))}
    </div>
  );
}
