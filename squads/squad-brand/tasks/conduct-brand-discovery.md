---
task: conduct-brand-discovery
responsavel: "@brand-strategist"
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

# Task: conduct-brand-discovery

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*brand-discovery` ou inicio de novo projeto
- **Inputs:** Briefing do cliente, materiais existentes, contexto do mercado
- **Outputs:** Discovery report com insights organizados

## Description
Conduz sessao profunda de discovery para entender a essencia da marca. Analisa briefing, identifica gaps, formula perguntas de aprofundamento e sintetiza insights em territory de marca.

## Steps
1. Analisar briefing do cliente: proposito, fundadores, historia, valores declarados
2. Identificar gaps de informacao (o que falta saber)
3. Formular perguntas de aprofundamento por categoria:
   - **Proposito:** Por que a empresa existe alem do lucro? Qual mudanca quer provocar?
   - **Valores:** Quais 3-5 valores sao inegociaveis? Como se manifestam no dia-a-dia?
   - **Publico:** Quem e o cliente ideal? Como ele se sente antes/depois de usar?
   - **Concorrentes:** Quem admira? Quem detesta? O que faz diferente?
   - **Aspiracoes:** Onde quer estar em 5 anos? Qual marca admira (de qualquer setor)?
   - **Restricoes:** O que NAO e? O que nunca faria?
4. Sintetizar respostas em insights acionaveis
5. Identificar tensoes e contradicoes (cliente diz X mas faz Y)
6. Mapear territory de marca (espaco conceitual unico)
7. Definir 3-5 atributos de personalidade emergentes
8. Compilar discovery report estruturado

## Validation Criteria
- Todas as 6 categorias de perguntas respondidas
- Insights sao acionaveis (nao genericos)
- Territory de marca e diferenciado (nao generico)
- Tensoes e contradicoes documentadas
- Atributos de personalidade emergem das respostas (nao sao impostos)

## Output Format
```markdown
# Discovery Report — {brand_name}

## Essencia
- Proposito: ...
- Valores: ...

## Publico
- Persona primaria: ...
- Necessidades: ...

## Landscape
- Concorrentes: ...
- Diferenciais: ...

## Territory de Marca
- Espaco conceitual: ...
- Atributos: ...

## Tensoes Identificadas
- ...

## Proximos Passos
- Definir posicionamento
```
