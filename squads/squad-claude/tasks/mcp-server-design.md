---
task: mcp-server-design
responsavel: "@mcp-integrator"
responsavel_type: Agent
atomic_layer: Task
elicit: false
Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true
Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Validar inputs"
  - "[ ] Executar steps"
  - "[ ] Verificar qualidade"
  - "[ ] Gerar output"
---

# MCP Server Design

## Objective

Design a custom MCP (Model Context Protocol) server architecture from scratch, including tool definitions, resource endpoints, transport configuration, authentication, error handling, and deployment strategy. Produce a complete technical specification ready for implementation.

## Pre-Conditions

- Use case requiring custom MCP server identified (no existing server covers the need)
- Target API or service to wrap is documented and accessible
- MCP SDK version and transport requirements known (stdio, SSE, streamable HTTP)
- Security and authentication requirements defined
- Performance requirements established (latency, throughput, concurrent connections)

## Steps

1. **Define Server Scope** — Document exactly what the MCP server will expose: list of tools (actions the model can take), list of resources (data the model can read), and list of prompts (templates the model can use). Each must have a clear purpose statement.
2. **Design Tool Schemas** — For each tool, define: name (verb-noun format), description (what it does and when to use it), input schema (JSON Schema with required/optional fields, types, validation), and output schema (response structure with examples).
3. **Design Resource Endpoints** — For each resource, define: URI pattern, MIME type, description, and access pattern (direct read, template with parameters, subscription for updates). Include pagination strategy for large resources.
4. **Plan Transport Layer** — Select and configure the transport: stdio for CLI integration, SSE for HTTP streaming, or streamable HTTP for modern deployments. Define connection lifecycle, reconnection strategy, and timeout configuration.
5. **Architect Authentication** — Design the auth flow: API key injection via environment variables, OAuth2 token management, or custom auth headers. Define how credentials are stored (never hardcoded), rotated, and validated on each request.
6. **Design Error Handling** — Create an error taxonomy: auth failures (401/403), rate limits (429), service unavailable (503), invalid input (400), and internal errors (500). For each, define the MCP error response format and recovery suggestion.
7. **Plan Rate Limiting and Caching** — Design rate limit handling: detect limits from upstream API, implement backoff strategy, queue requests when throttled. Design caching layer for repeated reads: TTL per resource type, cache invalidation triggers.
8. **Write Server Configuration Schema** — Define the configuration file format: server name, version, transport settings, auth configuration, tool toggles (enable/disable individual tools), logging level, and custom options.
9. **Design Logging and Observability** — Plan structured logging: request/response logging (with PII redaction), performance metrics (latency per tool), error rates, and health check endpoint. Define log levels and rotation policy.
10. **Create Deployment Specification** — Document deployment options: npm package (for stdio), Docker container (for isolated deployment), or cloud function (for serverless). Include Dockerfile, package.json scripts, and CI/CD pipeline requirements.
11. **Write Integration Test Plan** — Define integration tests: connect to server, list tools/resources, execute each tool with valid input, execute with invalid input, test auth failure, test rate limit handling, test concurrent requests.

## Output

```markdown
# MCP Server Design: {Server Name}

## Overview
- Purpose: {what this server enables}
- Transport: {stdio | SSE | streamable HTTP}
- Tools: {count}
- Resources: {count}

## Tool Definitions
### {tool_name}
- Description: {description}
- Input Schema: {JSON Schema}
- Output Schema: {JSON Schema}
- Error Cases: {list}

## Resource Definitions
### {resource_uri}
- MIME Type: {type}
- Access Pattern: {direct | template | subscription}

## Configuration Schema
{JSON Schema for server config}

## Deployment
- Primary: {deployment method}
- Dockerfile: {included}
- CI/CD: {pipeline spec}

## Integration Tests
| Test | Tool/Resource | Input | Expected | Priority |
|------|--------------|-------|----------|----------|
```

## Quality Criteria

- Every tool must have a complete JSON Schema for input and output
- Error handling must cover all 5 error categories with specific recovery suggestions
- Authentication must never expose credentials in logs or error messages
- Server must handle graceful shutdown (complete in-flight requests before exit)
- Design must include at least one caching strategy for read-heavy tools
- Deployment spec must include health check endpoint and readiness probe
