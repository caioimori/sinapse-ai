---
task: edit-copy-technical-check
responsavel: "@copy-editor"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Edit Copy — Technical Check (Pass 5)

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor (Chisel)
- **Complexity:** STANDARD
- **Depends on:** Pass 4 aprovado
- **Feeds:** publicacao/implementacao

## Objetivo
Quinta e ultima passada: verificacao tecnica final — gramatica, ortografia, links, formatacao e compliance para garantir zero erros na publicacao.

## Entrada
- Copy aprovada no Pass 4 (polida e impactante)
- Plataforma de publicacao (website, email tool, ad platform)
- Character limits (se aplicavel)

## Passos

### 1. Gramatica e Ortografia
- [ ] Zero erros ortograficos
- [ ] Concordancia verbal correta
- [ ] Concordancia nominal correta
- [ ] Pontuacao consistente
- [ ] Acentuacao correta
- [ ] Nomes proprios corretos (marca, pessoas, empresas)

### 2. Links e Referências
- [ ] Todos os links funcionam (testados)
- [ ] Links apontam para paginas corretas
- [ ] UTM parameters corretos (se aplicavel)
- [ ] Numeros de telefone corretos e formatados
- [ ] Emails de contato corretos
- [ ] Social media handles corretos

### 3. Formatacao e Limites
- [ ] Character limits respeitados por plataforma
- [ ] Formatacao (bold, italico, bullets) correta
- [ ] Imagens/thumbnails com alt text
- [ ] Responsividade (funciona em mobile)
- [ ] Encoding de caracteres especiais ok
- [ ] Line breaks nos lugares certos

### 4. Compliance e Legal
- [ ] Disclaimers necessarios incluidos
- [ ] Termos de uso/privacidade linkados
- [ ] Unsubscribe visivel (emails)
- [ ] Claims verificados e defensaveis
- [ ] Copyright year atualizado
- [ ] Marca registrada (™, ®) onde necessario

### 5. Cross-Platform Check
| Plataforma | Verificacao |
|-----------|-------------|
| Gmail | Preview text, rendering |
| Outlook | Formatacao, imagens |
| Mobile | Responsividade, CTA size |
| Desktop | Layout, whitespace |
| Apple Mail | Dark mode compatibility |

### 6. Final Sign-Off
```
TECHNICAL CHECK — PASS 5 (FINAL)

GRAMATICA: ✅ LIMPO / ❌ [N] erros corrigidos
LINKS: ✅ TODOS OK / ❌ [N] broken
FORMATACAO: ✅ OK / ❌ [N] issues
COMPLIANCE: ✅ OK / ❌ [N] missing
CROSS-PLATFORM: ✅ OK / ❌ [N] issues

DECISAO FINAL:
  ✅ APROVADO PARA PUBLICACAO
  ❌ AJUSTES FINAIS NECESSARIOS [lista]

COPY FINAL: [Link/local do documento final]

Assinatura: Chisel (Copy Editor)
Data: [Data]
```

## Saida
- Copy final aprovada para publicacao
- Checklist tecnico completo
- Sign-off documentado

## Validacao
- [ ] Zero erros ortograficos/gramaticais
- [ ] Links testados e funcionando
- [ ] Character limits respeitados
- [ ] Compliance/legal ok
- [ ] Cross-platform testado
- [ ] Sign-off documentado

---

*Task operada por: copy-editor (Chisel)*
