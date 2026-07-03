/**
 * Tests — brownfield-progress (deterministic progress + Phase 7 QA gate).
 * Story onda3-s3-brownfield-progress-gate (AF-20260702 item 3.3).
 *
 * Real fs against a temp projectRoot — no mocks: the module's whole point is
 * measuring artifacts on disk.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  resolveBrownfieldProgress,
  parseQaGateStatus,
  evaluateQaGate,
  recordRework,
  resetQaGateState,
  MAX_REWORK,
} = require('../../../.sinapse-ai/core/orchestration/brownfield-progress');

const WORKFLOW = {
  id: 'brownfield-discovery',
  sequence: [
    { step: 'system_documentation', phase: 1, phase_name: 'Coleta: Sistema', agent: 'architect', creates: 'docs/architecture/system-architecture.md' },
    { step: 'database_documentation', phase: 2, phase_name: 'Coleta: Database', agent: 'data-engineer', creates: ['supabase/docs/SCHEMA.md', 'supabase/docs/DB-AUDIT.md'], condition: 'project_has_database' },
    { step: 'frontend_documentation', phase: 3, phase_name: 'Coleta: Frontend/UX', agent: 'ux-design-expert', creates: 'docs/frontend/frontend-spec.md' },
    { step: 'initial_consolidation', phase: 4, phase_name: 'Consolidação Inicial', agent: 'architect', creates: 'docs/prd/technical-debt-DRAFT.md' },
    { step: 'qa_general_review', phase: 7, phase_name: 'Validação: QA Review', agent: 'qa', creates: 'docs/reviews/qa-review.md' },
    { step: 'story_creation', phase: 10, phase_name: 'Planning: Stories', agent: 'pm', creates: 'docs/stories/story-X.X-*.md' },
  ],
};

function writeArtifact(root, rel, content = '# conteudo real\n') {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}

describe('brownfield-progress (Onda3-S3)', () => {
  let root;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'bf-progress-'));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  describe('resolveBrownfieldProgress (AC1)', () => {
    test('empty disk: every measurable phase pending, nextPhase = 1', () => {
      const progress = resolveBrownfieldProgress(root, WORKFLOW);
      expect(progress.complete).toBe(false);
      expect(progress.nextPhase).toBe(1);
      const phase1 = progress.phases.find((p) => p.phase === 1);
      expect(phase1.status).toBe('pending');
    });

    test('phase 1 artifact on disk marks phase 1 complete and resume moves forward', () => {
      writeArtifact(root, 'docs/architecture/system-architecture.md');
      const progress = resolveBrownfieldProgress(root, WORKFLOW);
      expect(progress.phases.find((p) => p.phase === 1).status).toBe('complete');
      expect(progress.nextPhase).toBe(3); // phase 2 é condicional (não bloqueia)
    });

    test('conditional steps never block completeness but report their artifacts', () => {
      const progress = resolveBrownfieldProgress(root, WORKFLOW);
      const phase2 = progress.phases.find((p) => p.phase === 2);
      expect(phase2.status).toBe('unverifiable'); // só step condicional
      expect(phase2.steps[0].conditional).toBe(true);
      expect(phase2.steps[0].artifacts).toHaveLength(2);
    });

    test('empty file does NOT count as artifact (fileHasContent semantics)', () => {
      writeArtifact(root, 'docs/architecture/system-architecture.md', '');
      const progress = resolveBrownfieldProgress(root, WORKFLOW);
      expect(progress.phases.find((p) => p.phase === 1).status).toBe('pending');
    });

    test('glob artifacts are reported as uncheckable, phase unverifiable', () => {
      const progress = resolveBrownfieldProgress(root, WORKFLOW);
      const phase10 = progress.phases.find((p) => p.phase === 10);
      expect(phase10.status).toBe('unverifiable');
      expect(phase10.steps[0].artifacts[0].checkable).toBe(false);
      expect(phase10.steps[0].artifacts[0].exists).toBeNull();
    });

    test('all measurable artifacts on disk → complete=true, nextPhase=null', () => {
      writeArtifact(root, 'docs/architecture/system-architecture.md');
      writeArtifact(root, 'docs/frontend/frontend-spec.md');
      writeArtifact(root, 'docs/prd/technical-debt-DRAFT.md');
      writeArtifact(root, 'docs/reviews/qa-review.md');
      const progress = resolveBrownfieldProgress(root, WORKFLOW);
      expect(progress.complete).toBe(true);
      expect(progress.nextPhase).toBeNull();
    });

    test('tolerates workflow without sequence', () => {
      const progress = resolveBrownfieldProgress(root, { id: 'x' });
      expect(progress.phases).toEqual([]);
      expect(progress.complete).toBe(false);
    });
  });

  describe('parseQaGateStatus (AC2)', () => {
    test('APPROVED preenchido', () => {
      expect(parseQaGateStatus('### Gate Status: APPROVED\n')).toBe('approved');
      expect(parseQaGateStatus('### Gate Status: [APPROVED]\n')).toBe('approved');
    });

    test('NEEDS WORK preenchido', () => {
      expect(parseQaGateStatus('### Gate Status: NEEDS WORK\n')).toBe('needs_work');
    });

    test('template não preenchido (ambos os tokens) é PENDING, nunca veredito', () => {
      expect(parseQaGateStatus('### Gate Status: [APPROVED / NEEDS WORK]\n')).toBe('pending');
    });

    test('sem linha de gate é pending; valor estranho é malformed', () => {
      expect(parseQaGateStatus('# review sem gate\n')).toBe('pending');
      expect(parseQaGateStatus('### Gate Status: TALVEZ\n')).toBe('malformed');
    });
  });

  describe('evaluateQaGate + recordRework (AC2)', () => {
    test('review ausente → pending com motivo', () => {
      const gate = evaluateQaGate(root);
      expect(gate.verdict).toBe('pending');
      expect(gate.reason).toMatch(/ausente/);
      expect(gate.reworkCount).toBe(0);
      expect(gate.escalate).toBe(false);
    });

    test('APPROVED no disco → approved sem escalate', () => {
      writeArtifact(root, 'docs/reviews/qa-review.md', '### Gate Status: APPROVED\n');
      const gate = evaluateQaGate(root);
      expect(gate.verdict).toBe('approved');
      expect(gate.escalate).toBe(false);
    });

    test('loop NEEDS WORK: contador persiste e escala no teto de 2', () => {
      writeArtifact(root, 'docs/reviews/qa-review.md', '### Gate Status: NEEDS WORK\n');

      expect(evaluateQaGate(root).escalate).toBe(false);

      expect(recordRework(root)).toEqual({ reworkCount: 1, escalate: false });
      expect(evaluateQaGate(root).escalate).toBe(false);

      expect(recordRework(root)).toEqual({ reworkCount: 2, escalate: true });
      const gate = evaluateQaGate(root);
      expect(gate.reworkCount).toBe(2);
      expect(gate.escalate).toBe(true);
      expect(MAX_REWORK).toBe(2);
    });

    test('escalate exige NEEDS WORK — APPROVED não escala mesmo com contador alto', () => {
      writeArtifact(root, 'docs/reviews/qa-review.md', '### Gate Status: APPROVED\n');
      recordRework(root);
      recordRework(root);
      const gate = evaluateQaGate(root);
      expect(gate.verdict).toBe('approved');
      expect(gate.escalate).toBe(false);
    });

    test('resetQaGateState zera o ciclo', () => {
      recordRework(root);
      resetQaGateState(root);
      expect(evaluateQaGate(root).reworkCount).toBe(0);
    });

    test('estado persiste em .sinapse/workflow-state/brownfield-discovery.json', () => {
      recordRework(root);
      const stateFile = path.join(root, '.sinapse', 'workflow-state', 'brownfield-discovery.json');
      expect(JSON.parse(fs.readFileSync(stateFile, 'utf8')).reworkCount).toBe(1);
    });
  });

  describe('integração com executeWorkflow (AC3)', () => {
    test('handoff do brownfield carrega progress e qaGate', async () => {
      const { WorkflowExecutor } = require('../../../.sinapse-ai/core/orchestration/workflow-executor');
      const executor = new WorkflowExecutor(root, {});

      const workflowPath = path.join(
        __dirname,
        '../../../.sinapse-ai/development/workflows/brownfield-discovery.yaml',
      );
      const result = await executor.executeWorkflow(workflowPath, { projectRoot: root });

      expect(result.success).toBe(true);
      expect(result.progress).toBeDefined();
      expect(result.progress.nextPhase).toBe(1);
      expect(result.qaGate).toBeDefined();
      expect(result.qaGate.verdict).toBe('pending');
      expect(result.qaGate.maxRework).toBe(2);
    });

    test('workflow não-brownfield NÃO ganha enrichment', async () => {
      const { WorkflowExecutor } = require('../../../.sinapse-ai/core/orchestration/workflow-executor');
      const executor = new WorkflowExecutor(root, {});

      const workflowPath = path.join(
        __dirname,
        '../../../.sinapse-ai/development/workflows/greenfield-ui.yaml',
      );
      const result = await executor.executeWorkflow(workflowPath, { projectRoot: root });

      expect(result.success).toBe(true);
      expect(result.progress).toBeUndefined();
      expect(result.qaGate).toBeUndefined();
    });
  });
});
