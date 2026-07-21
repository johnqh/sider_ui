import { useMe, useMyCaptureBatches, useMyTools } from '@sudobility/sider_client';
import { useSiderApi } from '../context/config';
import { useRoutes, useSiderRouting } from '../context/routing';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '../components/states';
import { DataTable } from '../components/data/DataTable';

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function DashboardOverview() {
  const { networkClient, baseUrl, token } = useSiderApi();
  const routes = useRoutes();
  const { navigate } = useSiderRouting();
  const me = useMe(networkClient, baseUrl, token);
  const batches = useMyCaptureBatches(networkClient, baseUrl, token);
  const myTools = useMyTools(networkClient, baseUrl, token);

  if (me.isLoading) return <LoadingState />;
  if (me.error) return <ErrorState error={me.error} />;
  if (!me.data) return <EmptyState title="No profile yet" hint="Sign in and learn a site first." />;

  const recent = (batches.data ?? []).slice(0, 5);
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-lg font-semibold text-foreground">Overview</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Capture batches" value={me.data.batchCount} />
        <Stat label="Observations" value={me.data.observationCount} />
        <Stat label="Tools contributed" value={me.data.toolsContributed} />
        <Stat label="Trusted tools" value={me.data.trustedToolsContributed} />
      </div>
      <section>
        <h2 className="pb-2 text-sm font-semibold text-foreground">Recent batches</h2>
        {recent.length === 0 ? (
          <EmptyState title="No captures yet" hint="Use the extension's learning mode on a site." />
        ) : (
          <DataTable
            columns={[
              { key: 'siteName', header: 'Site' },
              { key: 'observationCount', header: 'Observations' },
              {
                key: 'status',
                header: 'Status',
                render: r => <StatusBadge status={String(r.status)} />,
              },
              { key: 'createdAt', header: 'When' },
            ]}
            rows={recent as unknown as Record<string, unknown>[]}
            onRowClick={r => navigate(routes.captureBatch(String(r.id)))}
          />
        )}
      </section>
      <section>
        <h2 className="pb-2 text-sm font-semibold text-foreground">My tools</h2>
        {(myTools.data ?? []).length === 0 ? (
          <EmptyState title="No tool contributions yet" />
        ) : (
          <DataTable
            columns={[
              { key: 'name', header: 'Tool' },
              {
                key: 'status',
                header: 'Status',
                render: r => <StatusBadge status={String(r.status)} />,
              },
              { key: 'corroboratingUserCount', header: 'Corroborations' },
            ]}
            rows={(myTools.data ?? []) as unknown as Record<string, unknown>[]}
            onRowClick={r => navigate(routes.tool(String(r.toolId)))}
          />
        )}
      </section>
    </div>
  );
}
