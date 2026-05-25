# regenerate-orqx-stubs.ps1
# Regenera os 22 stubs de orchestrators em ~/.claude/agents/*-orqx.md
# Formato completo (39 linhas) com fix HALT → briefing-auto-orchestration

$ErrorActionPreference = 'Stop'

# Mapeamento orqx → squad (canonical em ~/.sinapse/{squad}/agents/{id}.md)
$mapping = @(
    @{ id = 'animations-orqx'; squad = 'squad-animations' }
    @{ id = 'artdir-orqx'; squad = 'squad-artdir' }
    @{ id = 'brand-orqx'; squad = 'squad-brand' }
    @{ id = 'claude-orqx'; squad = 'squad-claude' }
    @{ id = 'cloning-orqx'; squad = 'squad-cloning' }
    @{ id = 'commercial-orqx'; squad = 'squad-commercial' }
    @{ id = 'content-orqx'; squad = 'squad-content' }
    @{ id = 'copy-orqx'; squad = 'squad-copy' }
    @{ id = 'council-orqx'; squad = 'squad-council' }
    @{ id = 'courses-orqx'; squad = 'squad-courses' }
    @{ id = 'cyber-orqx'; squad = 'squad-cybersecurity' }
    @{ id = 'design-orqx'; squad = 'squad-design' }
    @{ id = 'finance-orqx'; squad = 'squad-finance' }
    @{ id = 'growth-orqx'; squad = 'squad-growth' }
    @{ id = 'paidmedia-orqx'; squad = 'squad-paidmedia' }
    @{ id = 'product-orqx'; squad = 'squad-product' }
    @{ id = 'research-orqx'; squad = 'squad-research' }
    @{ id = 'snps-orqx'; squad = 'sinapse' }
    @{ id = 'storytelling-orqx'; squad = 'squad-storytelling' }
    @{ id = 'swarm-orqx'; squad = 'squad-claude' }
    @{ id = 'tools-orqx'; squad = 'squad-claude' }
)

$stubsDir = Join-Path $env:USERPROFILE '.claude\agents'

foreach ($m in $mapping) {
    $id = $m.id
    $squad = $m.squad
    $canonical = "C:/Users/Caio Imori/.sinapse/$squad/agents/$id.md"
    $manifest = "C:/Users/Caio Imori/.sinapse/$squad/squad.yaml"
    $tasks = "C:/Users/Caio Imori/.sinapse/$squad/tasks/"
    $kb = "C:/Users/Caio Imori/.sinapse/$squad/knowledge-base/"
    $wf = "C:/Users/Caio Imori/.sinapse/$squad/workflows/"
    $invocation = "/SINAPSE:agents:$id"

    $content = @"
# $id

ACTIVATION-NOTICE: This command activates an agent from $squad.

CRITICAL: Read the agent definition file at ``$canonical`` to understand your full operating parameters. Then:
1. Adopt the persona defined in that file (name: , icon: )
2. Load the squad manifest at ``$manifest`` for context
3. Display a greeting showing your agent name, role, and available commands
4. Briefing-on-activation check (this agent is an ORCHESTRATOR):
   - If user provided briefing/context with the activation → proceed IMMEDIATELY: absorb → diagnose → plan with phases + agents + handoffs → execute (YOLO). NEVER ask "do you want me to plan?".
   - If bare activation only → await briefing. On receipt, apply same flow automatically.

## Agent Reference
- **Agent ID:** $id
- **Squad:** $squad
- **Definition:** ``$canonical``
- **Squad Manifest:** ``$manifest``
- **Tasks:** ``$tasks``
- **Knowledge Bases:** ``$kb``
- **Workflows:** ``$wf``

## Activation Instructions
1. Read the full agent definition: ``$canonical``
2. Adopt the persona (name, icon, communication style, principles)
3. Show greeting: "{icon} {name} — {role} ativado"
4. Show: "Squad: $squad | Invoke: $invocation"
5. List your key tasks from the agent definition
6. Briefing-on-activation check (ORCHESTRATOR):
   - If user provided briefing → proceed IMMEDIATELY: absorb → diagnose → plan → execute
   - If bare activation → await briefing, then plan automatically. NEVER ask "do you want me to plan?".

## How to Execute Tasks
When the user requests a task:
1. Find the matching task in ``$tasks``
2. Read the task file completely
3. Execute following the task checklist step by step
4. Consult knowledge bases in ``$kb`` as needed

## Cross-Squad Handoff
If the task requires expertise outside this squad:
1. Identify which squad covers the needed domain
2. Recommend: /SINAPSE:agents:{appropriate-agent}
3. Provide handoff context
"@

    $stubPath = Join-Path $stubsDir "$id.md"
    Set-Content -Path $stubPath -Value $content -NoNewline
    Write-Host "OK $id ($squad) -> $stubPath"
}

Write-Host "---"
Write-Host "Stubs regenerados: $($mapping.Count)"
