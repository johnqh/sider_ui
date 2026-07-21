import { useMyCaptureBatches } from '@sudobility/sider_client';
import { useSiderApi } from '../context/config';
import { useRoutes, useSiderRouting } from '../context/routing';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '../components/states';
import { DataTable } from '../components/data/DataTable';

export function CaptureBatchesPage() {
  const { networkClient, baseUrl, token } = useSiderApi();
  const routes = useRoutes();
  const { navigate } = useSiderRouting();
  const { data, isLoading, error } = useMyCaptureBatches(networkClient, baseUrl, token);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data?.length)
    return (
      <div className="p-6">
        <EmptyState
          title="No capture batches"
          hint="Start learning mode on a site in the extension."
        />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-lg font-semibold text-foreground">Capture batches</h1>
      <DataTable
        columns={[
          { key: 'siteName', header: 'Site' },
          { key: 'siteOrigin', header: 'Origin' },
          { key: 'observationCount', header: 'Observations' },
          { key: 'status', header: 'Status', render: r => <StatusBadge status={String(r.status)} /> },
          { key: 'createdAt', header: 'Uploaded' },
        ]}
        rows={data as unknown as Record<string, unknown>[]}
        onRowClick={r => navigate(routes.captureBatch(String(r.id)))}
      />
    </div>
  );
}
