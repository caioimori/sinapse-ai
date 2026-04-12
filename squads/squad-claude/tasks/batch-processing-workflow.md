---
task: batch-processing-workflow
responsavel: "@hooks-architect"
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

# Batch Processing Workflow

## Objective

Design batch processing workflows that leverage Claude Code to process multiple files, data sets, or operations efficiently. Create patterns for parallel processing, progress tracking, error recovery, and result aggregation across large-scale automated tasks.

## Pre-Conditions

- Batch operation requirements defined (what to process, how many items)
- Input data format and source documented
- Output format and destination specified
- Error tolerance level defined (fail-fast vs. best-effort)
- Resource constraints identified (memory, API rate limits, context window)

## Steps

1. **Define Batch Scope** — Document the batch operation: input source (file system, API, database), item count estimate, processing logic per item, output destination, and success criteria. Classify as small (< 50 items), medium (50-500), or large (500+).
2. **Design Item Processing Logic** — Define the processing pipeline for a single item: read input, validate format, transform/analyze, generate output, and write result. Identify which steps require AI processing and which are mechanical.
3. **Implement Chunking Strategy** — Break the batch into manageable chunks based on constraints: context window limits (max items per prompt), API rate limits (requests per second), memory constraints, and optimal parallelism level. Define chunk size and overlap handling.
4. **Build Progress Tracking** — Create a progress tracking system: log file recording processed items, pending items, failed items, and current position. Enable resume from last checkpoint after interruption. Include estimated time remaining based on throughput.
5. **Design Error Recovery** — Implement error handling per item and per batch: per-item errors (log, skip, retry up to 3 times), per-chunk errors (retry chunk, reduce chunk size, escalate), per-batch errors (save progress, report, allow manual resume).
6. **Create Parallel Execution Plan** — Identify independent operations that can run in parallel: file reads, API calls, transformations. Design the parallelism strategy: concurrent tool calls within a turn, sequential turns with batched operations, or subagent delegation.
7. **Implement Result Aggregation** — Design how individual results are combined: append to output file, merge into summary document, update database, or generate aggregate statistics. Handle partial results (some items failed) gracefully.
8. **Add Rate Limiting** — Implement rate limiting for external API calls: token bucket or sliding window algorithm, configurable limits per API, backoff strategy when limits are hit, and queue management for pending requests.
9. **Build Validation Pipeline** — Create post-processing validation: verify output count matches input count (minus expected failures), spot-check random results for quality, verify output format compliance, and generate quality metrics.
10. **Create Batch Report** — Generate a comprehensive batch execution report: total items, processed/failed/skipped counts, execution time, throughput metrics, error summary with categories, and sample outputs for quality review.

## Output

```markdown
# Batch Processing Workflow: {Operation Name}

## Batch Configuration
| Parameter | Value |
|-----------|-------|
| Input source | {source} |
| Item count | {count} |
| Chunk size | {size} |
| Parallelism | {level} |
| Error tolerance | {fail-fast/best-effort} |

## Processing Pipeline
1. {step} — {tool/method} — {output}
2. {step} — {tool/method} — {output}

## Chunking Strategy
- Chunk size: {items per chunk}
- Total chunks: {count}
- Overlap handling: {strategy}

## Error Recovery
| Error Type | Strategy | Max Retries | Fallback |
|-----------|----------|-------------|----------|

## Progress Tracking
- Log file: {path}
- Checkpoint frequency: {every N items}
- Resume command: {command}

## Execution Report Template
{report template with placeholders}
```

## Quality Criteria

- Batch must be resumable from any checkpoint after interruption
- Error recovery must handle all three levels (item, chunk, batch)
- Progress tracking must be accurate to within 1% of actual completion
- Parallel execution must not exceed defined rate limits
- Result aggregation must account for partial failures (no silent data loss)
- Batch report must include quality metrics alongside completion metrics
