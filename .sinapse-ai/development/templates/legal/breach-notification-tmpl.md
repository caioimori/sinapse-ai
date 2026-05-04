# Procedimento de Notificacao de Incidente — {{PROJECT_NAME}}

> Conforme LGPD Art. 48 e Resolucao CD/ANPD 15/2024
> Prazo maximo: 3 dias uteis apos conhecimento do incidente

---

## 1. Deteccao e Classificacao

### Classificacao do Incidente

| Nivel | Criterio | SLA |
|-------|----------|-----|
| CRITICO | Dados sensiveis expostos, >1000 titulares | Notificar ANPD em 24h |
| ALTO | Dados pessoais expostos, <1000 titulares | Notificar ANPD em 48h |
| MEDIO | Tentativa de acesso sem exfiltracao confirmada | Investigar, documentar |
| BAIXO | Falha de controle sem exposicao | Corrigir, registrar |

### Informacoes para Coleta Imediata

- [ ] Quando o incidente foi detectado (data/hora)
- [ ] Quando o incidente ocorreu (se diferente da deteccao)
- [ ] Quais dados foram afetados (categorias)
- [ ] Quantos titulares potencialmente afetados
- [ ] Causa tecnica (vulnerabilidade, erro humano, ataque)
- [ ] Se dados foram efetivamente acessados ou apenas expostos
- [ ] Medidas de contencao ja tomadas

## 2. Notificacao a ANPD (obrigatoria para CRITICO/ALTO)

### Timeline

```
Hora 0: Incidente detectado
Hora 1-4: Investigacao inicial + classificacao
Hora 4-24: Contencao + coleta de evidencias
Hora 24-72: Preparar e enviar formulario ANPD
Dia 3-5: Notificar titulares afetados
Dia 30: Relatorio completo para ANPD
```

### Formulario ANPD (campos obrigatorios)

```yaml
comunicacao_incidente:
  controlador: "{{COMPANY_NAME}}"
  cnpj: "{{CNPJ}}"
  encarregado:
    nome: "{{DPO_NAME}}"
    email: "{{DPO_EMAIL}}"
    telefone: "{{DPO_PHONE}}"

  incidente:
    data_ocorrencia: "YYYY-MM-DD"
    data_conhecimento: "YYYY-MM-DD"
    descricao: ""
    natureza_dados: [] # pessoais, sensiveis, financeiros, saude
    categorias_titulares: [] # clientes, funcionarios, fornecedores
    quantidade_titulares: 0
    
  medidas:
    contencao: "" # O que foi feito para parar o incidente
    mitigacao: "" # O que foi feito para reduzir danos
    prevencao: "" # O que sera feito para evitar recorrencia
    
  risco:
    probabilidade: "" # alta, media, baixa
    gravidade: "" # alta, media, baixa
    consequencias: "" # dano moral, financeiro, discriminacao
```

## 3. Notificacao aos Titulares (obrigatoria se risco relevante)

### Template de Comunicacao

```
Assunto: Comunicacao sobre incidente de seguranca — {{PROJECT_NAME}}

Prezado(a) titular,

Identificamos um incidente de seguranca em {{DATA}} que pode ter afetado 
seus dados pessoais ({{TIPOS_DADOS}}).

O que aconteceu: {{DESCRICAO_SIMPLES}}

Dados afetados: {{DADOS_AFETADOS}}

O que estamos fazendo: {{MEDIDAS_TOMADAS}}

O que voce pode fazer:
- Altere sua senha em {{URL}}
- Monitore atividades suspeitas
- Em caso de duvidas: {{DPO_EMAIL}}

Pedimos desculpas pelo ocorrido e reafirmamos nosso compromisso 
com a protecao dos seus dados.

{{COMPANY_NAME}}
DPO: {{DPO_NAME}} — {{DPO_EMAIL}}
```

## 4. Pos-Incidente

- [ ] Root cause analysis concluida
- [ ] Vulnerabilidade corrigida
- [ ] Controles adicionais implementados
- [ ] Relatorio final enviado a ANPD (30 dias)
- [ ] Lições aprendidas documentadas
- [ ] Equipe treinada sobre novas medidas
- [ ] Simulacao de incidente agendada (90 dias)

---
*Procedimento conforme Lei 13.709/2018 (LGPD) Art. 48, Resolucao CD/ANPD 15/2024*
