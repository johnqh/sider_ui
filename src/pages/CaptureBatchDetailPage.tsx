import { useState } from 'react';
import { useMyCaptureBatch } from '@sudobility/sider_client';
import type { Observation } from '@sudobility/sider_types';
import { useSiderApi } from '../context/config';
import { useRouteParams } from '../context/routing';
import { EmptyState, ErrorState, LoadingState, StatusBadge } from '../components/states';
import { JsonViewer } from '../components/data/JsonViewer';

function ObservationRow({ obs }: { obs: Observation }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm"
      >
        <span className="font-mono text-xs font-semibold text-primary">{obs.method}</span>
        <span className="flex-1 truncate font-mono text-xs text-foreground">{obs.url}</span>
        <span className="text-xs text-muted-foreground">
          {obs.status} · {obs.timingMs}ms
        </span>
      </button>
      {open ? (
        <div className="flex flex-col gap-2 border-t border-border p-3">
          <p className="text-xs font-semibold text-muted-foreground">Request headers</p>
          <JsonViewer value={obs.requestHeaders} />
          {obs.requestBody !== undefined && obs.requestBody !== null ? (
            <>
              <p className="text-xs font-semibold text-muted-foreground">Request body (tokenized)</p>
              <JsonViewer value={obs.requestBody} />
            </>
          ) : null}
          {obs.responseBody !== undefined && obs.responseBody !== null ? (
            <>
              <p className="text-xs font-semibold text-muted-foreground">
                Response body (tokenized)
              </p>
              <JsonViewer value={obs.responseBody} />
            </>
          ) : null}
          <p className="text-xs font-semibold text-muted-foreground">Context</p>
          <JsonViewer value={obs.context} />
        </div>
      ) : null}
    </div>
  );
}

export function CaptureBatchDetailPage() {
  const { networkClient, baseUrl, token } = useSiderApi();
  const { batchId } = useRouteParams<{ batchId?: string }>();
  const { data, isLoading, error } = useMyCaptureBatch(
    networkClient,
    baseUrl,
    token,
    batchId ?? null
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState title="Batch not found" />;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{data.batch.siteName}</h1>
        <p className="text-sm text-muted-foreground">
          {data.batch.siteOrigin} · {data.batch.observationCount} observations ·{' '}
          <StatusBadge status={data.batch.status} />
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {data.observations.map(obs => (
          <ObservationRow key={obs.id} obs={obs} />
        ))}
      </div>
    </div>
  );
}
