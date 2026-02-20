import { Container, Heading, Table, StatusBadge, Button } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";

const fetchWorkflows = async () => {
  const response = await fetch("/commerce/admin/temporal/workflows", {
    headers: {},
  });
  if (!response.ok) {
    throw new Error("Failed to fetch workflows");
  }
  return response.json();
};

const WorkflowsPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["temporal-workflows"],
    queryFn: fetchWorkflows,
  });

  return (
    <Container>
      <div className="flex justify-between mb-6">
        <Heading level="h1">Temporal Workflows</Heading>
        <Button onClick={() => refetch()} variant="secondary">
          Refresh
        </Button>
      </div>

      {isError && (
        <div className="text-red-500 mb-4">
          Error loading workflows:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Workflow ID</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Start Time</Table.HeaderCell>
              <Table.HeaderCell>Run ID</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.workflows?.map((wf: any) => (
              <Table.Row key={wf.runId}>
                <Table.Cell>{wf.workflowId}</Table.Cell>
                <Table.Cell>{wf.type}</Table.Cell>
                <Table.Cell>
                  <StatusBadge
                    color={
                      wf.status === "COMPLETED"
                        ? "green"
                        : wf.status === "RUNNING"
                          ? "blue"
                          : wf.status === "FAILED"
                            ? "red"
                            : "grey"
                    }
                  >
                    {wf.status}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  {new Date(wf.startTime).toLocaleString()}
                </Table.Cell>
                <Table.Cell className="text-ui-fg-subtle">
                  {wf.runId}
                </Table.Cell>
              </Table.Row>
            ))}
            {(!data?.workflows || data.workflows.length === 0) && (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-4">
                  No workflows found
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
  label: "Workflows",
  icon: ChatBubbleLeftRight,
  nested: "/settings",
});

export default WorkflowsPage;
