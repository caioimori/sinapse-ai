# Editor de contrato SINAPSE

Interface original em HTML/CSS/JavaScript nativos. Uma árvore tipada gera um único JSON Schema 2020-12, somente leitura. Dados fictícios vivem na sessão; não há integração, persistência ou chamada externa. Fontes Sora, Inter e JetBrains Mono usam fallback local, sem download.

Abra `http://127.0.0.1:4187/contract-builder/` após iniciar, da raiz do repositório:

```powershell
node examples/framework-quality/serve.cjs --port=4187
```

Edite Chave/Descrição/Tipo; marque Obrigatório no objeto correspondente. Objetos têm campos próprios; listas têm tipo de itens próprio. Duplicatas conservam o rascunho e o último JSON válido, bloqueando cópia até a correção. Limpar, remover e mudar tipo têm Desfazer. Adicionar foca a nova chave; remover e desfazer restauram o destino lógico de foco.

Limites: raiz em 0, profundidade 4, 60 nós incluindo raiz e itens, chave 120 e descrição 600 caracteres. Chaves válidas não são normalizadas; `__proto__` é propriedade segura. Preview e mensagem explicam que lista obrigatória pode estar vazia. Nenhuma política de campos extras é presumida.

Verificação focal (sem instalar dependências):

```powershell
node --test examples/framework-quality/contract-builder/model.test.cjs
node C:/rrq/tools/gate.mjs --min-gb 4 --wait-min 1 -- node examples/framework-quality/contract-builder/verify.cjs --cycle=1
```

QA usa Playwright já instalado, Chromium headless e o preview local em 4187. Resultados privados: `../output/expertise-20261007/contract-builder/cycle-1/evidenceQA.json` e screenshots 1440/390 px; nunca adicionar output ao Git. A execução confirma comportamento local e não comprova produção, persistência, acessibilidade completa ou causalidade de qualidade.

Se Playwright não estiver no `node_modules` deste worktree, configure `NODE_PATH` para a biblioteca já instalada informada pelo runtime local antes do comando; não instale nova dependência. QA usa o preview existente em 4187 e não inicia nem encerra um servidor compartilhado. Sem recursos no gate, o resultado é “não executado”; o bloqueio não equivale a aprovação visual.

Contrato de interface: [UI-CONTRACT.md](UI-CONTRACT.md). Os mecanismos candidatos da pesquisa são inferências delimitadas. A pesquisa observou um viewer de screenshots; esta implementação e os testes pertencem à nova UI SINAPSE, sem copiar branding, assets ou código de referências.

## Evidência local desta entrega

Em 07/10/2026, cinco testes do compilador passaram. Após corrigir o nome acessível dos seletores com `aria-labelledby`, uma confirmação focal autorizada passou 13 checks e capturou desktop 1440, mobile 390, erro, desfazer e limite de profundidade sem overflow. Receipt privado: `../output/expertise-20261007/contract-builder/aria-confirmation/evidenceQA.json`.

Preservados os três receipts anteriores: nome acessível inadequado nos ciclos 1/3 e erro transitório de screenshot no ciclo 2. Esperas iniciais no gate não executaram QA. A confirmação adicional foi única, após a correção real; toda repetição de captura é registrada e limitada a duas tentativas. Clipboard foi validado com respostas controladas da API, sem comprovar a área de transferência do sistema.

Um reparo posterior preserva o controle de foco no histórico: Desfazer alteração do tipo dos itens volta ao seletor Itens. A confirmação manual independente do hash final `27e283f801f8da945b38dbb4c9a3fa380ff009a1c87a4ada0549f2e95a786e2d` restaurou foco, objeto e campos nome/email; prova em `../output/expertise-20261007/root-ui-review/items-undo-confirmation.json`. Os 13 checks anteriores correspondem ao hash anterior, sem alegar replay do byte final.
