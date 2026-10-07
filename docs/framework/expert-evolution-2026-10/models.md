# Modelos e atualização contínua

O [registro de modelos](../../../research/expert-evolution/model-policy.json) separa
publicação, disponibilidade autenticada e avaliação de qualidade. A revisão expira
em 30 dias; não atualiza providers ou promove modelos por conta própria.

| Modelo | Evidência atual | Uso nesta entrega |
|---|---|---|
| GPT-6.1 Sol | ID nativo disponível, configurado e subagentes executados | Pesquisa, implementação e revisão com o runtime existente |
| Claude Opus 5.5 | Publicação oficial e ID `claude-opus-5-5` | Comparação candidata; acesso e benchmark ainda não comprovados |
| Jev 1.13.0 | Documentação oficial e executor offline testado | Julgamentos atômicos planejados; execução paga depende de credencial |
| Próximos modelos | Candidatos por padrão | ID oficial, acesso real e avaliação reservada antes de promoção |

O nome ditado "Office 5.5" foi interpretado como Claude Opus 5.5, cuja publicação
foi confirmada na fonte oficial. O ID nativo Codex não é convertido por suposição
em um ID de API. A documentação Codex recomenda consultar `model/list` para o
runtime e a conta específicos.

Execução de um subagente confirma disponibilidade, não superioridade. Uma
comparação deve manter briefing, direitos, corpus e orçamento constantes;
reservar casos antes de escrever heurísticas e registrar erro, custo, latência,
regressões e avaliação independente de cada competência.

A comparação nativa limitada de dez decisões reservadas resultou em 18/20 com
contexto anterior e 20/20 com contexto enriquecido. [O recibo](../../../research/expert-evolution/benchmark-results.json)
registra revisão independente e seus limites; não é avaliação de todos os agentes,
de artefatos visuais ou de Opus/Jev. A política registra o teste sem autorizar promoção global.

Capacidade de contexto não substitui seleção: recuperar segmentos relevantes,
preservar locators e medir a cápsula JSON inteira. Vídeo renderizado e código
compilado são critérios técnicos; coerência de marca, legibilidade, narrativa,
ritmo, movimento e qualidade visual precisam de julgamento separado.

Fontes oficiais lidas nesta execução:
[Codex App Server](https://learn.chatgpt.com/docs/app-server#message-schema),
[Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5),
[configuração de modelos Claude Code](https://support.claude.com/en/articles/11940350-claude-code-model-configuration),
[modelos Jev](https://docs.typesafe.ai/models).
