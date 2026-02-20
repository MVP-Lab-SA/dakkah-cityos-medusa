import {
  Container,
  Heading,
  Table,
  StatusBadge,
  Button,
  Input,
  Label,
  Copy,
} from "@medusajs/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Key } from "@medusajs/icons";

const fetchApiKeys = async () => {
  const response = await fetch("/commerce/admin/api-keys?limit=20", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch API keys");
  }
  return response.json();
};

const createApiKey = async (title: string) => {
  const response = await fetch("/commerce/admin/api-keys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, type: "publishable" }),
  });
  if (!response.ok) {
    throw new Error("Failed to create API key");
  }
  return response.json();
};

const ApiKeysPage = () => {
  const queryClient = useQueryClient();
  const [newKeyTitle, setNewKeyTitle] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["api-keys"],
    queryFn: fetchApiKeys,
  });

  const createMutation = useMutation({
    mutationFn: createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      setNewKeyTitle("");
    },
  });

  return (
    <Container>
      <div className="flex flex-col gap-4 mb-8 border-b pb-6">
        <Heading level="h1">API Key Management</Heading>
        <p className="text-ui-fg-subtle">
          Manage Publishable API Keys for your storefronts.
        </p>

        <div className="flex gap-2 items-end max-w-md">
          <div className="w-full">
            <Label size="small" weight="plus">
              Create New Key
            </Label>
            <Input
              placeholder="e.g. Storefront V1"
              value={newKeyTitle}
              onChange={(e) => setNewKeyTitle(e.target.value)}
            />
          </div>
          <Button
            onClick={() => createMutation.mutate(newKeyTitle)}
            disabled={!newKeyTitle || createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </div>
        {createMutation.isError && (
          <p className="text-red-500 text-sm">Failed to create key</p>
        )}
      </div>

      {isError && (
        <div className="text-red-500 mb-4">
          Error loading keys:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Token (Redacted)</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Created At</Table.HeaderCell>
              <Table.HeaderCell>ID</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.api_keys?.map((key: any) => (
              <Table.Row key={key.id}>
                <Table.Cell>{key.title}</Table.Cell>
                <Table.Cell className="font-mono text-xs">
                  {key.token}
                  <Copy content={key.token} className="inline-block ml-2" />
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge color="blue">{key.type}</StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  {new Date(key.created_at).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell className="text-ui-fg-subtle text-xs">
                  {key.id}
                </Table.Cell>
              </Table.Row>
            ))}
            {(!data?.api_keys || data.api_keys.length === 0) && (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-4">
                  No API Keys found
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
  label: "API Keys",
  icon: Key,
  nested: "/settings",
});

export default ApiKeysPage;
