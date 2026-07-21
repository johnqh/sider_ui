import { useToolDetail } from '@sudobility/sider_client';
import { useSiderApi } from '../context/config';
import { useRouteParams } from '../context/routing';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '../components/states';
import { JsonViewer } from '../components/data/JsonViewer';

export function ToolDetailPage() {
  const { networkClient, baseUrl, token } = useSiderApi();
  const { toolId } = useRouteParams<{ toolId?: string }>();
  const { data, isLoading, error } = useToolDetail(networkClient, baseUrl, token, toolId ?? null);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState title="Tool not found" />;

  const { tool, corroboration } = data;
  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{tool.name}</h1>
        <p className="text-sm text-muted-foreground">
          {tool.description} · <StatusBadge status={tool.status} /> · {tool.safetyClass} · v
          {tool.version}
        </p>
      </div>
      <section>
        <h2 className="pb-2 text-sm font-semibold text-foreground">
          Corroboration ({corroboration.distinctUsers} users, trust threshold{' '}
          {corroboration.trustThreshold})
        </h2>
        <JsonViewer value={corroboration.hashCounts} />
      </section>
      <section>
        <h2 className="pb-2 text-sm font-semibold text-foreground">Input schema</h2>
        <JsonViewer value={tool.inputSchema} />
      </section>
      <section>
        <h2 className="pb-2 text-sm font-semibold text-foreground">Invocation recipe</h2>
        <JsonViewer value={tool.recipe} />
      </section>
    </div>
  );
}
