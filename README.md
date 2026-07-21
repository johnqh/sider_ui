# @sudobility/sider_ui

Shared Sider dashboard UI. Host apps must:

1. Wrap pages in `<SiderUiProvider networkClient token apiUrl>` and a
   `<RoutingProvider>` fed by their router (see sider_app / sider_extension).
2. Add this package to Tailwind content globs:
   `'./node_modules/@sudobility/sider_ui/dist/**/*.js'`
