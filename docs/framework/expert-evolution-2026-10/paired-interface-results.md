# Comparação independente de seis pares de interfaces

O contexto aprimorado foi preferido em **quatro casos**, com **dois empates** e nenhuma preferência pelo baseline. É um resultado observado neste lote, sem prova causal, extrapolação aos 172 agentes ou promoção de modelo/expertise.

## Condições e integridade

O [protocolo](../../../research/expert-evolution/paired-interface-protocol.json) e os dois contextos foram congelados antes da geração. Dois executores separados receberam o mesmo brief, marca fictícia, assets próprios, formato e modelo nativo herdado, sem override ou API externa. Foram produzidos 12 HTMLs reais: uma geração por caso e condição; nenhum candidato foi corrigido ou regenerado após a revisão.

Baseline: excerto da função pública na revisão `693e9d0f9819cd700eae45734da41b055063fa5b` mais a tarefa compartilhada. Aprimorado: contexto recuperado por tarefa e brief, congelado antes da expansão para 35 funções/51 comandos. Os contextos tinham 9.666 e 11.302 caracteres; essa diferença impede isolar conteúdo, tamanho e recuperação como causas independentes.

O teto reservado era 15 minutos por executor. Tempos observados: baseline **15min11,038s**, aprimorado **14min12,33s**. O desvio de 11,038 segundos foi preservado e exposto antes de revelar as condições; o experimento não cumpriu igualdade estrita de tempo.

Um revisor independente recebeu candidatos com rótulos aleatórios e condições ocultas. Sua revisão foi selada em SHA-256 `6eb61d1a765eec07cf8a52b4ebe315f69ea366491d4b461e252b7751c057b7e5` antes do unblinding. Os 12 hashes de HTML coincidiram com originais e candidatos anônimos. O campo `generationStarted=false` do manifesto é o snapshot imutável anterior ao despacho, não o estado atual.

## Resultado do lote

| Caso | Baseline | Aprimorado | Preferência independente |
|---|---:|---:|---|
| Agenda local com revisão e troca | 97 | 98 | Aprimorado: resumo concreto e revisão mais clara |
| Referências com direitos e filtros | 96 | 97 | Aprimorado: seleção/contagens mais próximas |
| Brief de carrossel com correção | 97 | 97 | Empate: alternativas com trade-offs |
| Biblioteca e manifesto de assets | 93 | 97 | Aprimorado: nomes acessíveis e revisão do manifesto |
| Minutos técnicos com validação | 97 | 97 | Empate: mesma exatidão e recuperação |
| Etapas, pausa/reset/reduced motion | 96 | 98 | Aprimorado: controles compactos e progresso explícito |

Notas são julgamentos do revisor em cinco dimensões de 20 pontos, sem limiar universal de aprovação. Nenhuma falha crítica foi confirmada. As **225 verificações efetivas** passaram; três alertas iniciais de foco/evento assíncrono foram confrontados com probes e conservados como falsos positivos.

Foram inspecionadas 36 screenshots iniciais em 1440/390/320px e 13 capturas de estado, além de dois manifestos JSON exportados. Ações funcionais foram exercitadas em desktop; **replay de todos os estados no mobile ficou pendente**. Não houve auditoria completa WCAG, leitor de tela, zoom200%, contraste instrumental ou outros navegadores.

## Limites e continuidade

Uma geração por caso conserva variação estocástica. O lote mede seis interfaces fictícias e não backend, campo, ativação de provider nativo, Opus/Jev, vídeo, áudio ou carrossel exportado. Não foi extraída regra nem reutilizado conteúdo desses outputs reservados no corpus nesta onda.

O [receipt sanitizado](paired-interface-results.json) registra pares, critérios, hashes, preferências, ressalvas e skips. Outputs, contextos, mapeamento e screenshots permanecem locais e ignorados. O avanço seguinte exige outro caso reservado e aplicação da competência com fonte, exceção e revisão próprias.
