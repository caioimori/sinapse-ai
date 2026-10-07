# Leitura e resposta limitadas

Entradas: evidência privada relativa ao projeto, requests locais do fixture QA e respostas Jev. Saídas: Buffer de evidência conferido, cinco assets pré-capturados e resposta Jev projetada/limitada. Mantêm-se pins, CAS, ledger, revisão independente e autoridade canônica.

Extraction captura identidades de pais/folha, abre um único handle, compara fstat, verifica novamente os pais e lê somente o tamanho admitido. Depois confere identidade/metadata e pais novamente. Referências usam o mesmo Buffer para SHA e JSON; nenhuma dependência de O_NOFOLLOW no Windows.

QA captura os cinco assets antes do listener, conserva SHA dos mesmos bytes servidos e rejeita requests fora da allowlist. Jev lê ReadableStream com limite acumulado antes de JSON.parse, confere as formas já existentes e retorna uma projeção model/answers/usage. Metadata remota desconhecida não é persistida.

Opção rejeitada: check/stat/read pelo nome ou response.json sem limite, pois preservam os bypasses. Não se alteram dependências, CI, ferramentas compartilhadas ou os demais alertas. Sem proteção universal contra processo proprietário malicioso que controla todos os objetos e relógios do filesystem.

Freios: duas tentativas de patch/teste; testes pelo gate com 4 GB RAM e C: >=10 GB; sem build/suíte completa. Uma nova CAS só depois do freeze/commit, executada pelo devops. Rollback usa a instalação anterior e seus snapshots, preservando mudanças fora do write set.
