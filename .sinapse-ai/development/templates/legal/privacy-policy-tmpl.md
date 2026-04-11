# Politica de Privacidade — {{PROJECT_NAME}}

**Ultima atualizacao:** {{DATE}}
**Responsavel:** {{COMPANY_NAME}} — CNPJ {{CNPJ}}
**Encarregado de Dados (DPO):** {{DPO_NAME}} — {{DPO_EMAIL}}

---

## 1. Dados que Coletamos

| Categoria | Dados | Finalidade | Base Legal (LGPD) |
|-----------|-------|------------|-------------------|
| Cadastro | Nome, email, telefone | Criacao de conta | Execucao de contrato (Art. 7, V) |
| Pagamento | Dados de cartao (via gateway) | Processamento de pagamento | Execucao de contrato (Art. 7, V) |
| Navegacao | IP, cookies, device info | Melhoria da experiencia | Legitimo interesse (Art. 7, IX) |
| Comunicacao | Mensagens, suporte | Atendimento ao usuario | Execucao de contrato (Art. 7, V) |
{{#IF COLLECTS_SENSITIVE}}
| Dados sensiveis | {{SENSITIVE_DATA_TYPES}} | {{SENSITIVE_PURPOSE}} | Consentimento (Art. 11, I) |
{{/IF}}

## 2. Como Usamos seus Dados

- Fornecer e manter nosso servico
- Notifica-lo sobre mudancas
- Oferecer suporte ao cliente
- Analisar uso para melhorias
{{#IF USES_AI}}
- Processamento por inteligencia artificial para {{AI_PURPOSE}}
{{/IF}}

## 3. Compartilhamento de Dados

| Parceiro | Dados | Finalidade | Pais |
|----------|-------|------------|------|
| {{PAYMENT_GATEWAY}} | Dados de pagamento | Processamento | {{COUNTRY}} |
| {{ANALYTICS_PROVIDER}} | Dados de navegacao | Analytics | {{COUNTRY}} |
{{#IF INTERNATIONAL_TRANSFER}}

**Transferencia Internacional:** Dados podem ser processados em {{COUNTRIES}}. Adotamos clausulas contratuais padrao (SCCs) conforme Art. 33 da LGPD.
{{/IF}}

## 4. Seus Direitos (Art. 18 LGPD)

Voce tem direito a:
- **Confirmar** a existencia de tratamento
- **Acessar** seus dados pessoais
- **Corrigir** dados incompletos ou desatualizados
- **Anonimizar, bloquear ou eliminar** dados desnecessarios
- **Portabilidade** a outro fornecedor
- **Eliminar** dados tratados com consentimento
- **Revogar** consentimento a qualquer momento

**Como exercer:** Envie email para {{DPO_EMAIL}} ou acesse {{RIGHTS_PORTAL_URL}}.
**Prazo de resposta:** 15 dias uteis (Art. 18, §5).

## 5. Retencao de Dados

| Categoria | Periodo | Justificativa |
|-----------|---------|---------------|
| Dados de conta | Enquanto conta ativa + {{RETENTION_AFTER_DELETE}} | Obrigacao legal |
| Dados de pagamento | {{PAYMENT_RETENTION}} | Obrigacao fiscal |
| Logs de acesso | 6 meses | Marco Civil da Internet (Art. 15) |
| Cookies | {{COOKIE_RETENTION}} | Sessao/preferencias |

## 6. Seguranca

Adotamos medidas tecnicas e administrativas conforme Art. 46 da LGPD:
- Criptografia em transito (TLS 1.3) e em repouso
- Controle de acesso baseado em funcao (RBAC)
- Monitoramento e deteccao de incidentes
- Backups regulares com teste de restauracao

## 7. Cookies

{{#IF USES_COOKIES}}
Utilizamos cookies para: {{COOKIE_PURPOSES}}.
Voce pode gerenciar cookies nas configuracoes do navegador.
{{/IF}}

## 8. Incidentes de Seguranca

Em caso de incidente que possa causar risco ou dano, notificaremos:
- **ANPD:** em ate 3 dias uteis (Resolucao CD/ANPD 15)
- **Titulares afetados:** em ate 5 dias uteis

## 9. Contato

- **Encarregado (DPO):** {{DPO_NAME}} — {{DPO_EMAIL}}
- **Endereco:** {{ADDRESS}}
- **ANPD:** www.gov.br/anpd

---
*Politica elaborada em conformidade com a Lei 13.709/2018 (LGPD) e regulamentacoes da ANPD.*
