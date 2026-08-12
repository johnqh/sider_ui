import { useSites } from '@sudobility/sider_client';
import { useSiderApi } from '../context/config';
import { useRoutes, useSiderRouting } from '../context/routing';
import { EmptyState, ErrorState, LoadingState } from '../components/states';
import { DataTable } from '../components/data/DataTable';

export function SitesPage() {
  const { networkClient, baseUrl } = useSiderApi();
  const routes = useRoutes();
  const { navigate } = useSiderRouting();
  const { data, isLoading, error } = useSites(networkClient, baseUrl);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data?.length)
    return (
      <div className="p-6">
        <EmptyState title="No sites learned yet" />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-lg font-semibold text-foreground">Registry — sites</h1>
      <DataTable
        columns={[
          { key: 'name', header: 'Site' },
          { key: 'origin', header: 'Origin' },
          { key: 'toolCount', header: 'Tools' },
          { key: 'trustedToolCount', header: 'Trusted' },
          { key: 'contributorCount', header: 'Contributors' },
        ]}
        rows={data as unknown as Record<string, unknown>[]}
        onRowClick={r => navigate(routes.site(String(r.id)))}
      />
    </div>
  );
}
