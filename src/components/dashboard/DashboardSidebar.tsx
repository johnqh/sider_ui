import { useRoutes, useSiderRouting } from '../../context/routing';

interface NavItem {
  label: string;
  path: string;
}

export function DashboardSidebar() {
  const routes = useRoutes();
  const { pathname, navigate } = useSiderRouting();

  const sections: { title: string; items: NavItem[] }[] = [
    {
      title: 'My data',
      items: [
        { label: 'Overview', path: routes.home() },
        { label: 'Capture batches', path: routes.captureBatches() },
        { label: 'My tools', path: routes.myTools() },
      ],
    },
    {
      title: 'Registry',
      items: [{ label: 'Sites', path: routes.sites() }],
    },
  ];

  return (
    <nav className="flex h-full w-56 flex-col gap-4 border-r border-border bg-card p-3">
      {sections.map(section => (
        <div key={section.title}>
          <p className="px-2 pb-1 text-xs font-semibold uppercase text-muted-foreground">
            {section.title}
          </p>
          {section.items.map(item => {
            const active = pathname.endsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
