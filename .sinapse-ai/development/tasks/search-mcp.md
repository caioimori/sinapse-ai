# Search MCP Catalog Task

> Search and discover available MCP servers in the Docker MCP Toolkit catalog.

---

## Task Definition

```yaml
task: searchMcp()
responsavel: DevOps Agent
responsavel_type: Agente
atomic_layer: Infrastructure
elicit: true

**Entrada:**
- campo: search_query
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Search query for MCP catalog (e.g., "notion", "database", "slack")

**Saida:**
- campo: mcp_results
  tipo: array
  destino: Console output
  persistido: false

- campo: mcp_details
  tipo: object
  destino: Console output (if user selects an MCP)
  persistido: false
```

---

## Pre-Conditions

```yaml
pre-conditions:
  - [ ] Docker MCP Toolkit running
    tipo: pre-condition
    blocker: true
    validacao: docker mcp --version succeeds
    error_message: "Docker MCP Toolkit required. Enable in Docker Desktop settings."

  - [ ] Docker daemon running
    tipo: pre-condition
    blocker: true
    validacao: docker info succeeds
    error_message: "Start Docker Desktop before running this task"
```

---

## Interactive Elicitation

### Step 1: Search Query

```
ELICIT: MCP Search Query

What type of MCP server are you looking for?

Examples:
  • "notion" - Workspace and document management
  • "database" - Database integrations (postgres, mysql, sqlite)
  • "slack" - Team messaging
  • "browser" - Browser automation (puppeteer, playwright)
  • "storage" - Cloud storage (s3, gcs)
  • "*" - List all available MCPs

→ Enter search query: _______________
```

### Step 2: Display Results

```
ELICIT: Search Results

Found {n} MCPs matching "{query}":

┌─────────────────────────────────────────────────────────────────┐
│ #  │ MCP Name        │ Description                             │
├─────────────────────────────────────────────────────────────────┤
│ 1  │ mcp/notion      │ Notion workspace integration            │
│ 2  │ mcp/postgres    │ PostgreSQL database access              │
│ 3  │ mcp/sqlite      │ SQLite local database                   │
│ 4  │ mcp/mysql       │ MySQL database access                   │
└─────────────────────────────────────────────────────────────────┘

Options:
  • Enter a number to see details
  • Type "add {number}" to add the MCP
  • Type "search {query}" to search again
  • Type "exit" to finish

→ Select option: ___
```

### Step 3: Show MCP Details (Optional)

```
ELICIT: MCP Details

📦 mcp/{name}

Description: {full_description}

🔧 Tools Provided:
   • tool1 - Description of tool1
   • tool2 - Description of tool2
   • tool3 - Description of tool3

🔑 Required Credentials:
   • {CREDENTIAL_NAME} - {description}
   • (none) - if no credentials needed

📋 Example Usage:
   docker mcp server add {name}
   docker mcp tools call {name}.{tool} --param value

Options:
  • Type "add" to add this MCP
  • Type "back" to return to results
  • Type "exit" to finish

→ Select option: ___
```

---

## Implementation Steps

### 1. Search the Catalog

```bash
# Basic search
docker mcp catalog search {query}

# Example: Search for "notion"
docker mcp catalog search notion

# List all MCPs
docker mcp catalog search "*"

# Example output:
# NAME           DESCRIPTION
# mcp/notion     Notion workspace integration
# mcp/postgres   PostgreSQL database access
```

### 2. Get MCP Details

```bash
# Get detailed info about an MCP
docker mcp catalog info {mcp-name}

# Example: Get notion details
docker mcp catalog info notion

# Example output:
# Name: mcp/notion
# Description: Notion workspace integration
# Tools:
#   - getPage: Retrieve a Notion page
#   - createPage: Create a new page
#   - search: Search Notion workspace
# Environment:
#   - NOTION_API_KEY (required)
```

### 3. Filter by Category (if supported)

```bash
# Search by category
docker mcp catalog search --category database
docker mcp catalog search --category productivity
docker mcp catalog search --category automation
```

---

## Post-Conditions

```yaml
post-conditions:
  - [ ] Search results displayed
    tipo: post-condition
    blocker: false
    validacao: User can see matching MCPs or "no results" message
    error_message: "Search failed - check Docker MCP connection"
```

---

## Error Handling

### Error: No Results Found

```
Resolution:
1. Try a broader search query
2. Use wildcards: docker mcp catalog search "*database*"
3. Check available categories: docker mcp catalog categories
4. Browse full catalog: docker mcp catalog search "*"
```

### Error: Docker MCP Not Available

```
Resolution:
1. Verify Docker Desktop 4.50+ is installed
2. Enable MCP Toolkit: Docker Desktop > Settings > Extensions > MCP Toolkit
3. Restart Docker Desktop
4. Verify: docker mcp --version
```

### Error: Catalog Timeout

```
Resolution:
1. Check internet connection
2. Docker MCP catalog requires network access
3. Retry: docker mcp catalog search {query}
4. Check Docker proxy settings if behind firewall
```

---

## Success Output

```
✅ MCP Catalog Search Complete

🔍 Query: "{query}"
📦 Results: {n} MCPs found

┌─────────────────────────────────────────────────────────────────┐
│ MCP Name        │ Description              │ Credentials       │
├─────────────────────────────────────────────────────────────────┤
│ mcp/notion      │ Notion workspace         │ NOTION_API_KEY    │
│ mcp/postgres    │ PostgreSQL access        │ DATABASE_URL      │
│ mcp/sqlite      │ SQLite local DB          │ None              │
└─────────────────────────────────────────────────────────────────┘

Next steps:
1. View details: *search-mcp → select number
2. Add an MCP: *add-mcp {name}
3. List enabled MCPs: *list-mcps
```

---

## Common Search Examples

| Search Query | Finds | Use Case |
|--------------|-------|----------|
| `notion` | Notion workspace MCP | Document management |
| `database` | postgres, mysql, sqlite, redis | Database access |
| `slack` | Slack messaging MCP | Team communication |
| `browser` | puppeteer, playwright | Browser automation |
| `storage` | s3, gcs, azure-blob | Cloud storage |
| `github` | GitHub API MCP | Repository management |
| `*` | All available MCPs | Browse full catalog |

---

## Related Commands

| Command | Description |
|---------|-------------|
| `*add-mcp` | Add an MCP server to Docker MCP Toolkit |
| `*list-mcps` | List currently enabled MCPs |
| `*remove-mcp` | Remove an MCP from Docker MCP Toolkit |
| `*setup-mcp-docker` | Initial Docker MCP Toolkit setup |

---

## Performance

```yaml
duration_expected: 1-2 minutes
cost_estimated: $0 (local Docker operation)
token_usage: ~200-500 tokens
```

---

## Metadata

```yaml
task: search-mcp
version: 1.0.0
story: Story 6.14 - MCP Governance Consolidation
dependencies:
  - Docker MCP Toolkit
  - Docker Desktop 4.50+
tags:
  - infrastructure
  - mcp
  - docker
  - discovery
  - catalog
created_at: 2025-12-17
updated_at: 2025-12-17
agents:
  - devops
```

