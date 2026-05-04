# MCP Integration Patterns

## Overview

The Model Context Protocol (MCP) extends Claude Code with tools from external services. MCP servers expose tools that Claude Code can invoke just like built-in tools. This guide covers transport types, setup patterns, security, and common integrations.

## Transport Types

### stdio (Standard I/O)

**How it works:** Claude Code spawns a local process and communicates via stdin/stdout using JSON-RPC.

**Best for:** Local CLI tools, language servers, file processors, custom scripts.

**Configuration:**
```json
{
  "mcpServers": {
    "my-server": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

**Characteristics:**
- Fastest transport (no network overhead)
- Process lifecycle managed by Claude Code
- Environment variables for configuration
- Works offline (for local-only tools)
- One process per session

### SSE (Server-Sent Events)

**How it works:** Claude Code connects to a remote HTTP server that streams responses via Server-Sent Events.

**Best for:** Remote services, shared servers, cloud-hosted tools, team-wide integrations.

**Configuration:**
```json
{
  "mcpServers": {
    "remote-server": {
      "type": "sse",
      "url": "https://mcp.example.com/sse",
      "headers": {
        "Authorization": "Bearer ${MCP_TOKEN}"
      }
    }
  }
}
```

**Characteristics:**
- Network latency applies
- Server managed externally (always running)
- Authentication via headers
- Supports multiple concurrent clients
- Requires network access

### Docker

**How it works:** Claude Code runs an MCP server inside a Docker container, communicating via stdio or mapped ports.

**Best for:** Isolated environments, servers with complex dependencies, security-sensitive tools, reproducible setups.

**Configuration:**
```json
{
  "mcpServers": {
    "docker-server": {
      "type": "stdio",
      "command": "docker",
      "args": ["run", "--rm", "-i", "mcp/server-image:latest"],
      "env": {
        "DB_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

**Characteristics:**
- Full isolation (filesystem, network, processes)
- Reproducible environment
- Higher startup time (container launch)
- Docker must be installed
- Can map volumes for file access

---

## Transport Selection Guide

| Factor | stdio | SSE | Docker |
|--------|-------|-----|--------|
| Latency | Lowest | Medium | Medium-High |
| Security isolation | Low (same user) | High (network only) | Highest (container) |
| Setup complexity | Low | Medium | Medium-High |
| Offline capability | Yes | No | Yes (if image cached) |
| Multi-user sharing | No | Yes | Possible |
| Dependency management | Manual | Server-side | Container image |
| Best use case | Local tools | Team services | Sensitive operations |

---

## Common MCP Servers

### Supabase MCP

**Purpose:** Database operations, migrations, edge functions, project management.

**Tools provided:** `execute_sql`, `apply_migration`, `list_tables`, `get_logs`, `deploy_edge_function`, and 20+ more.

**Setup:**
```json
{
  "mcpServers": {
    "supabase": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

### GitHub MCP

**Purpose:** Repository management, issues, PRs, code search, Actions.

**Setup:**
```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### Figma MCP

**Purpose:** Design inspection, component discovery, design token extraction.

**Tools provided:** `get_screenshot`, `get_metadata`, `get_design_context`, `get_code_connect_suggestions`.

### Notion MCP

**Purpose:** Document management, database queries, page creation and updates.

**Tools provided:** `notion-search`, `notion-create-pages`, `notion-update-page`, `notion-fetch`.

### Gmail MCP

**Purpose:** Email reading, drafting, label management.

**Tools provided:** `gmail_search_messages`, `gmail_read_message`, `gmail_create_draft`.

### Context7

**Purpose:** Library documentation lookup with up-to-date information.

**Tools provided:** `resolve-library-id`, `get-library-docs`.

---

## Agent-as-MCP Pattern

A Claude Code agent can be exposed as an MCP server, allowing other agents or systems to invoke it as a tool.

**Architecture:**
```
External System → MCP Protocol → Agent Wrapper → Claude Code Agent → Result
```

**Use cases:**
- Expose a code review agent as a CI/CD tool
- Let other AI systems delegate to specialized Claude Code agents
- Create reusable agent services across projects

**Implementation approach:**
1. Create an MCP server that wraps agent invocation
2. Define tools that map to agent capabilities
3. Handle authentication and rate limiting
4. Return structured results

---

## Docker MCP Toolkit

The Docker MCP Toolkit provides a managed way to run MCP servers in containers.

**Key features:**
- Pre-built images for common servers
- Health monitoring and auto-restart
- Network isolation between servers
- Volume management for persistent data
- Log aggregation

**Setup:**
```bash
# Install Docker MCP gateway
docker run -d --name mcp-gateway \
  -p 8080:8080 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  mcp/gateway:latest

# Register a server
curl -X POST http://localhost:8080/servers \
  -d '{"name": "supabase", "image": "mcp/supabase:latest", "env": {"TOKEN": "..."}}'
```

---

## Security Considerations

### Environment Variable Management
- NEVER hardcode secrets in settings.json
- Use `${ENV_VAR}` syntax for variable substitution
- Store secrets in .env files (gitignored) or OS keychain
- Rotate API keys regularly

### Network Security
- SSE servers should use HTTPS only
- Docker servers should use internal networks (not exposed to host)
- Limit MCP server network access with Docker network policies
- Monitor outbound connections from MCP servers

### Tool-Level Permissions
- Review which tools each MCP server exposes
- Use Claude Code's permission system to restrict MCP tool access
- Deny MCP tools that can modify production data in development environments
- Log all MCP tool invocations for audit

### Data Flow Security
- Understand what data flows through each MCP server
- Ensure sensitive data is not logged by MCP servers
- Use encryption for data at rest and in transit
- Comply with data residency requirements

---

## Troubleshooting

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| "Server not found" | MCP config not in settings.json | Add server config to correct settings file |
| "Connection refused" | Server not running / wrong port | Start server, check URL/port |
| "Tool not found" | Server connected but tool not registered | Check server implements the tool, restart server |
| "Authentication failed" | Invalid or expired token | Rotate token, check env var name |
| "Timeout" | Server too slow | Increase timeout, check server performance |
| "Permission denied" | Tool blocked by deny list | Update permissions in settings.json |

### Diagnostic Commands

```bash
# Check if MCP server process is running (stdio)
ps aux | grep mcp-server

# Test SSE endpoint
curl -N https://mcp.example.com/sse

# Test Docker MCP container
docker logs mcp-server-name

# Verify environment variables
echo $SUPABASE_ACCESS_TOKEN | head -c 10
```
