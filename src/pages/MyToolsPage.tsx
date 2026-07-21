import { useMyTools } from '@sudobility/sider_client';
import { useSiderApi } from '../context/config';
import { useRoutes, useSiderRouting } from '../context/routing';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '../components/states';
import { DataTable } from '../components/data/DataTable';

export function MyToolsPage() {
  const { networkClient, baseUrl, token } = useSiderApi();
  const routes = useRoutes();
  const { navigate } = useSiderRouting();
  const { data, isLoading, error } = useMyTools(networkClient, baseUrl, token);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data?.length)
    return (
      <div className="p-6">
        <EmptyState title="No tool contributions yet" />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-lg font-semibold text-foreground">My tools</h1>
      <DataTable
        columns={[
          { key: 'name', header: 'Tool' },
          { key: 'safetyClass', header: 'Safety' },
          { key: 'status', header: 'Status', render: r => <StatusBadge status={String(r.status)} /> },
          { key: 'corroboratingUserCount', header: 'Corroborations' },
          {
            key: 'agreesWithCurrent',
            header: 'My vote',
            render: r =>
              r.agreesWithCurrent ? 'matches stored recipe' : 'differs from stored recipe',
          },
        ]}
        rows={data as unknown as Record<string, unknown>[]}
        onRowClick={r => navigate(routes.tool(String(r.toolId)))}
      />
    </div>
  );
}
