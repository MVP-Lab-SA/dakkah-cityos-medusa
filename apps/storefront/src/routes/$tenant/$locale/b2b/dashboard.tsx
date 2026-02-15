import { createFileRoute } from "@tanstack/react-router";
import { B2BDashboard } from "@/components/b2b/b2b-dashboard";
import { AuthGuard } from "@/components/auth/auth-guard";

export const Route = createFileRoute("/$tenant/$locale/b2b/dashboard")({
  component: B2BDashboardPage,
  head: () => ({
    meta: [
      { title: "B2B Dashboard | Dakkah CityOS" },
      { name: "description", content: "Manage your B2B account on Dakkah CityOS" },
    ],
  }),
});

function B2BDashboardPage() {
  return (
    <AuthGuard requireB2B>
      <div className="container mx-auto px-4 py-8">
        <B2BDashboard />
      </div>
    </AuthGuard>
  );
}
