import {
  Container,
  Heading,
  Table,
  StatusBadge,
  Button,
  Badge,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { defineRouteConfig } from "@medusajs/admin-sdk";

const fetchWallets = async () => {
  const res = await fetch("/commerce/admin/wallets?limit=50");
  if (!res.ok) throw new Error("Failed to fetch wallets");
  return res.json();
};

const WalletsPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-wallets"],
    queryFn: fetchWallets,
  });

  return (
    <Container>
      <div className="flex justify-between mb-6">
        <Heading level="h1">Customer Wallets</Heading>
        <Button variant="secondary" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isError && (
        <div className="text-red-500 mb-4">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Customer ID</Table.HeaderCell>
              <Table.HeaderCell>Currency</Table.HeaderCell>
              <Table.HeaderCell>Balance</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.wallets?.map((w: any) => (
              <Table.Row key={w.id}>
                <Table.Cell className="font-mono text-xs">
                  {w.customer_id}
                </Table.Cell>
                <Table.Cell>{w.currency?.toUpperCase()}</Table.Cell>
                <Table.Cell className="font-semibold">
                  {Number(w.balance || 0).toFixed(2)}
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge
                    color={
                      w.status === "active"
                        ? "green"
                        : w.status === "frozen"
                          ? "orange"
                          : "red"
                    }
                  >
                    {w.status}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  {new Date(w.created_at).toLocaleDateString()}
                </Table.Cell>
              </Table.Row>
            ))}
            {(!data?.wallets || data.wallets.length === 0) && (
              <Table.Row>
                <Table.Cell
                  colSpan={5}
                  className="text-center py-4 text-ui-fg-subtle"
                >
                  No wallets found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Wallets",
});

export default WalletsPage;
