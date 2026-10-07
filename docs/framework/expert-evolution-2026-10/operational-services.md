# Serviços: evidência da retomada

## Estado observado

O preview local abriu em uma aba HTTP do aplicativo e mostrou os quatro exemplos Lume. Outra aba conservava uma página de erro em data:; a política bloqueou sua recarga. A aba HTTP aberta manualmente pelo usuário é a superfície de conferência vigente.

Na inspeção das abas disponíveis, não havia Jev/TypeSafe, Mobbin ou Gemini abertos. O serviço ditado como “GM” ainda não foi identificado; a pergunta de endereço permanece pendente. Não foi presumida uma conta nem lida configuração de autenticação.

As variáveis de ambiente TYPESAFE_API_KEY, JEV_API_KEY e ANTHROPIC_API_KEY estão ausentes neste processo. A inspeção consultou somente presença, sem imprimir valores. Ausência neste processo não comprova ausência em todos os cofres ou sessões.

Claude CLI instalado e autenticado foi confirmado por consulta de status, sem geração. Isso não confirma acesso/executabilidade de Opus 5.5. O receipt de distribuição pessoal conserva os campos saneados e o limite do runtime.

A busca de plugins “Mobbin Jev TypeSafe” retornou zero resultados nesta sessão. Não é prova de indisponibilidade global; outros plugins podem existir no [diretório](https://chatgpt.com/plugins). Não houve instalação ou alteração de permissões.

## Documentação Jev reconfirmada

[Modelos oficiais](https://docs.typesafe.ai/models), lidos em 2026-10-02: ID versionado jev-1.13.0, aliases stable/preview para esse ID, preço de entrada USD0.042 por milhão e saída sem cobrança. Limites publicados agora são 100 mil tokens/s e 40 requisições/s, sujeitos a alteração. O executor local não fixa esses limites e conserva uma tentativa por grupo.

A mesma fonte distingue entrada textual de mídia bruta, janela total de 64 mil tokens e estado mais maior pergunta até 32 mil. Login no site não substitui a chave necessária ao [endpoint oficial](https://docs.typesafe.ai/api).

O [documento de limitações do modelo](https://docs.typesafe.ai/model-jaggedness/jev-1.13) recomenda recortar o estado e tornar cada julgamento literal. Conta, datas e invariantes pertencem ao código; conteúdo adversarial, negação e instruções contraditórias exigem casos negativos. Esses limites corroboram a recuperação por tarefa e o ledger determinístico implementados, sem comprovar calibração local do Jev.

Preço público não é saldo/autorização da conta. O piloto permanece limitado ao teto total já autorizado USD0.05; sem credencial identificada, zero chamadas e zero gasto de Jev nesta retomada.
