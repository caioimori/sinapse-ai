# ADR: aprofundar em authoring isolado e migrar somente depois da prova

Decisão: manter framework-evolution como fonte instalada imutável e continuar a pesquisa em framework-expertise, partindo de 8fe3b90b. A branch está 12 commits à frente e zero atrás de origin/main após fetch observado.

Opções: editar a fonte ativa falha com pins durante a pesquisa e interfere nas outras sessões; sobrescrever as definições em HOME perde concorrência e confiança; clone isolado preserva a entrega vigente, mas exige nova migração explícita/CAS.

Consequências negativas: uma worktree adicional e vínculo a migrar; os dois projetos compartilham dependências existentes via junction node_modules, sem nova instalação. Corpus privado copiado somente entre as duas raízes do mesmo projeto, mantendo hashes e exclusão de Git/npm; não copiar para HOME/outro cliente.

Fitness: fonte anterior limpa e loadLink válido; 172 IDs e authority exatos; mecanismos com locator/escopo; fonte incompleta conserva candidato; nenhuma fonte de teste realimentada como conhecimento; contexto limitado e não vazio para o comando revisado; upgrade transacional verifica ambos os destinos, rollback e preservação de mudanças concorrentes.

Sem produção ou mutação de protected paths. Revisão e publicação da branch obedecem ao nível 1 atual do Caio; não reintroduzir CI integral/banco/CodeRabbit como gate.
