import { createFileRoute } from "@tanstack/react-router";
import { B2BDashboard } from "@/components/b2b/b2b-dashboard";

export const Route = createFileRoute("/$tenant/$locale/b2b/dashboard")({
  component: B2BDashboardPage,
});

function B2BDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <B2BDashboard />
    </div>
  );
}
