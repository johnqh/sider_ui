import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            {columns.map(c => (
              <th key={c.key} className="px-3 py-2 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-t border-border ${onRowClick ? 'cursor-pointer hover:bg-muted/40' : ''}`}
            >
              {columns.map(c => (
                <td key={c.key} className="px-3 py-2 text-foreground">
                  {c.render ? c.render(row) : String(row[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
