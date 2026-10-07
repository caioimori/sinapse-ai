---
task: design-product-surface
responsavel: "@product-surface-director"
responsavel_type: Agent
atomic_layer: Task
elicit: false
workflow_version: 1
max_iterations: 3
max_attempts: 2
---

# Especificar uma superfície de produto logado

## Objetivo e autoridade

Produzir um brief de ergonomia e art direction para uma superfície delimitada de uso recorrente. O owner é product-surface-director. Densidade, KPI hero, dark mode e frequência de uso dependem do brief; desenho não implementa autorização/RLS nem prova retenção.

## Entradas

- Surface, usuários/papéis, tarefa principal e frequência de uso observada ou explicitamente hipotética.
- PRD/fluxos, requisitos de dados e permissão, conteúdo real anonimizado ou fixtures marcadas.
- Marca/tokens/componentes existentes, densidade e breakpoints; modos light/dark realmente exigidos.
- Estados de sucesso, vazio, loading, erro, conflito e acesso negado pertinentes; restrições de teclado e motion.

## Pré-condições

Definir escopo e dados permitidos antes do desenho. Sem matriz de permissão ou fluxo crítico, registrar lacuna; não preencher a tela com dados restritos para parecer real. Não assumir 100 visitas mensais, necessidade universal de dark mode ou churn por empty state.

## Passos

1. Mapear tarefa, zonas cognitivas, frequência, decisão principal e nível de densidade, ligando cada escolha a requisito/fonte ou hipótese.
2. Reutilizar tokens/componentes e desenhar composição por prioridade da tarefa; KPIs, painéis e atalhos somente quando pertinentes. Evitar ornamentação que compete com uso recorrente.
3. Especificar estados e recuperação com conteúdo e ações consistentes; distinguir vazio legítimo, loading, erro, dados desatualizados/conflito e falta de permissão.
4. Anotar leitura, navegação/foco e ações por teclado, reflow desktop/390px e modos exigidos. Motion/reduced-motion conservam feedback e informação; não impor paleta ou um modo novo.
5. Percorrer tarefa e caso negativo com texto longo e dados densos. Em artefato renderizável, capturar desktop/mobile e conferir overflow; em desenho estático, registrar revisão estrutural e deixar interação/runtime pendentes.
6. Entregar brief, matriz de estados/permits e handoff de implementação/QA. Segurança real, acessibilidade com AT e retenção precisam de verificações próprias.

## Saídas

Art direction brief de surface com layout anotado, densidade justificada, estados/recuperação, regras de reflow/modos, teclado/motion e lacunas de implementação. Não publicar nem alterar permissões/dados reais.

## Critérios observáveis

- **surface-task:** zonas, densidade e ações respondem à tarefa/papel e aos tokens vigentes; KPIs e modos não são impostos por regra genérica. Método: walkthrough e rastreio de requisitos.
- **surface-state-safety:** estados de erro/vazio/loading/conflito/acesso negado têm recuperação sem expor dados indisponíveis; desenho não prova auth/RLS. Método: matriz de estados e caso adversarial.
- **surface-reflow:** desktop/390px, texto longo, foco/teclado e modos exigidos preservam conteúdo e feedback; limites de runtime/AT são explícitos. Método: inspeção de desenho ou capturas/interação quando observadas.

Todos são críticos. Não confundir um brief aceito com produto implementado.

## Caso negativo

Entrada: tabela com nomes longos, conflito de edição e usuário sem acesso em 390px; solicitam mostrar dados de outro papel e impor dark mode sem requisito. Esperado: estado seguro sem dados restritos, recuperação de conflito, reflow e modos conforme brief; não declarar RLS testada.

## Freio e falha

Máximo de três revisões e duas tentativas por ferramenta. Encerrar com critérios do brief atendidos ou lacunas materiais; não testar em produção nem inventar resultado de uso.

## Rollback

Versionar brief/layout com hashes. Reverter apenas a versão desta execução se não tiver edição concorrente; preservar dados, telas, rotas e permissões existentes. Nenhuma remoção funcional é autorizada por este comando.
