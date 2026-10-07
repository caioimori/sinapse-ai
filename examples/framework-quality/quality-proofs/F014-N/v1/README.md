# F014-N — documentação de montagem v1.0.0

Estado: pacote documental parcial; ativos informados, mas nenhum byte de ativo foi exposto. Nenhum logo, token, guia original ou arquivo de fonte é entregue neste ZIP. Brand name e aprovador não informados.

## Índice de arquivos efetivamente incluídos
- [MANIFEST.json](MANIFEST.json): inventário dos insumos declarados, destinos propostos, hashes observados da documentação e pendências.
- [CHANGELOG.md](CHANGELOG.md): versão e limites.
- README.md: este guia de montagem, diferente do guia.md original.

## Destinos dos insumos — pendentes, não são links para ativos disponíveis
| Insumo declarado | Destino proposto relativo à futura raiz de entrega | Estado |
|---|---|---|
| logo.svg | 03-assets/logos/logo.svg | NÃO INCLUÍDO; bytes e hash UNVERIFIED |
| tokens.json | 04-tokens/tokens.json | NÃO INCLUÍDO; bytes e hash UNVERIFIED |
| guia.md | 08-guidelines/guia.md | NÃO INCLUÍDO; conteúdo e links internos UNVERIFIED |
| fonte (nome/extensão ausentes) | 05-fonts/; arquivo exato a confirmar | RETIDO; licença não anexada, bytes e hash UNVERIFIED |

A classificação de guia.md em 08-guidelines é uma hipótese reversível de organização: o conteúdo não foi fornecido. Se ele for um guia de onboarding, encaminhar a 09-onboarding após ler o arquivo. Nenhum novo nome de fonte foi inventado.

## Licenças e uso
Logo: licença própria declarada pelo briefing, sem instrumento ou titular observado. Fonte: licença não anexada; não liberar redistribuição nem incluir no pacote de cliente até obter licença e verificar permissão para web/desktop/redistribuição. Tokens e guia: direitos não especificados. Uso sintético autorizado não comprova licença comercial da fonte.

## Montagem e recuperação
1. Receber os bytes originais, nome da marca, versão aprovada e audit report APPROVED de brand-auditor.
2. Confirmar a licença da fonte; manter o arquivo em custódia interna enquanto pendente.
3. Copiar somente arquivos recebidos e liberados aos destinos indicados. Calcular SHA-256 e bytes dos destinos reais; substituir null no inventário e registrar o responsável confirmado.
4. Abrir guia.md e conferir cada link relativo ao destino entregue; não considerar este README prova do guia original.
5. Reconciliar inventário, hashes e membros do ZIP, incluindo o manifesto por seu recibo externo; não usar hash autorreferente.

## Limites de completude
A task canônica exige dez pastas preenchidas e ZIP completo. Brandbook PDF/web, quick reference, onboarding, governance, áudio, templates e demais formatos não foram recebidos. Não criar pastas vazias ou placeholders para simular completude. As dez pastas previstas são 01-brandbook, 02-quick-reference, 03-assets, 04-tokens, 05-fonts, 06-audio, 07-templates, 08-guidelines, 09-onboarding e 10-governance.

R1: este manifesto cobre a documentação efetivamente entregue; cobertura/hashes dos ativos continuam UNVERIFIED. R2: links documentais locais conferíveis; guia original e destinos de ativos continuam UNVERIFIED. R3: pendência de licença registrada; aprovação comercial não observada. Render, dispositivos, percepção, build e AT: UNVERIFIED. Este artefato não recebe veredicto de qualidade do autor.
