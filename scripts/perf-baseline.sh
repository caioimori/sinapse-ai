#!/usr/bin/env bash
# perf-baseline.sh — captura timing baseline de comandos chave do SINAPSE-AI
# Resolve gargalo MEDIUM #7 do deep-audit (2026-05-05)
#
# Uso:
#   bash scripts/perf-baseline.sh                    # roda + grava em docs/perf/baseline-{date}.json
#   bash scripts/perf-baseline.sh --compare          # compara contra last baseline + alerta regressão >20%
#
# Métricas coletadas (segundos):
#   - manifest:gen   — npm run generate:manifest
#   - status         — npx sinapse-ai status
#   - doctor         — npx sinapse-ai doctor
#   - validate:article-vii
#   - validate:parity
#
# NÃO mede install (precisa diretório limpo) — fazer manualmente em VPS pra baseline real.

set -e

OUTPUT_DIR="docs/perf"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%SZ")
OUTPUT_FILE="$OUTPUT_DIR/baseline-${TIMESTAMP}.json"
LATEST_FILE="$OUTPUT_DIR/latest.json"

mkdir -p "$OUTPUT_DIR"

# Helper: tempo de execução em segundos (decimal)
time_cmd() {
  local label="$1"
  shift
  local start=$(date +%s.%N)
  "$@" > /dev/null 2>&1 || true
  local end=$(date +%s.%N)
  local elapsed=$(awk "BEGIN { printf \"%.3f\", $end - $start }")
  echo "  $label: ${elapsed}s"
  echo "$elapsed"
}

echo "=== SINAPSE perf baseline ($TIMESTAMP) ==="

T_MANIFEST=$(time_cmd "manifest:gen" npm run generate:manifest)
T_STATUS=$(time_cmd "status       " npx sinapse-ai status)
T_DOCTOR=$(time_cmd "doctor       " npx sinapse-ai doctor)
T_VII=$(time_cmd "article-vii  " npm run validate:article-vii)
T_PARITY=$(time_cmd "parity       " npm run validate:parity)

# Grava JSON estruturado
cat > "$OUTPUT_FILE" <<EOF
{
  "timestamp": "$TIMESTAMP",
  "node_version": "$(node --version)",
  "metrics_seconds": {
    "manifest_gen": $T_MANIFEST,
    "status": $T_STATUS,
    "doctor": $T_DOCTOR,
    "validate_article_vii": $T_VII,
    "validate_parity": $T_PARITY
  }
}
EOF

# Atualiza pointer "latest"
cp "$OUTPUT_FILE" "$LATEST_FILE"

echo ""
echo "Baseline salvo em $OUTPUT_FILE"
echo "Pointer 'latest' atualizado."

# Modo --compare: alerta regressão >20%
if [ "${1:-}" = "--compare" ]; then
  PREVIOUS=$(ls -t "$OUTPUT_DIR"/baseline-*.json 2>/dev/null | head -2 | tail -1)
  if [ -n "$PREVIOUS" ] && [ "$PREVIOUS" != "$OUTPUT_FILE" ]; then
    echo ""
    echo "=== Comparação vs $PREVIOUS ==="
    node -e "
      const cur = require('./$OUTPUT_FILE');
      const prev = require('./$PREVIOUS');
      let regressed = false;
      for (const [k, v] of Object.entries(cur.metrics_seconds)) {
        const p = prev.metrics_seconds[k];
        if (!p) continue;
        const delta = ((v - p) / p) * 100;
        const arrow = delta > 20 ? '⚠️ ' : (delta < -10 ? '✅ ' : '   ');
        console.log(\`\${arrow}\${k}: \${p.toFixed(3)}s → \${v.toFixed(3)}s (\${delta > 0 ? '+' : ''}\${delta.toFixed(1)}%)\`);
        if (delta > 20) regressed = true;
      }
      if (regressed) {
        console.log('\\n❌ Regressão >20% detectada. Investigar.');
        process.exit(1);
      } else {
        console.log('\\n✅ Sem regressão significativa.');
      }
    "
  else
    echo ""
    echo "(Sem baseline anterior pra comparar — primeiro run)"
  fi
fi
