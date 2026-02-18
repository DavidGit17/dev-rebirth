import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useAppState } from './state/useAppState';
import InitializePage from './pages/InitializePage';
import DashboardPage from './pages/DashboardPage';
import DevLogPage from './pages/DevLogPage';
import DailySummaryPage from './pages/DailySummaryPage';
import RealityCheckPage from './pages/RealityCheckPage';
import HistoryPage from './pages/HistoryPage';
import StatsGrowthPage from './pages/StatsGrowthPage';
import AppLayout from './components/layout/AppLayout';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
});

function IndexComponent() {
  const { isInitialized } = useAppState();
  return isInitialized ? <DashboardPage /> : <InitializePage />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent
});

const initializeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/initialize',
  component: InitializePage
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage
});

const devLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/log/$section',
  component: DevLogPage
});

const summaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/summary',
  component: DailySummaryPage
});

const realityCheckRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reality-check',
  component: RealityCheckPage
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: HistoryPage
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stats',
  component: StatsGrowthPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  initializeRoute,
  dashboardRoute,
  devLogRoute,
  summaryRoute,
  realityCheckRoute,
  historyRoute,
  statsRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
