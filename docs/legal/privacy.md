# Politica de Privacidade — SINAPSE-AI

**Ultima atualizacao:** 04 de abril de 2026

---

## 1. Introducao

A presente Politica de Privacidade descreve como o framework SINAPSE-AI ("SINAPSE", "nos") trata dados pessoais e informacoes durante sua utilizacao. O SINAPSE-AI e um framework open-source de orquestracao de agentes de IA, executado inteiramente no ambiente local do usuario.

---

## 2. Dados Coletados pelo SINAPSE-AI

### 2.1. Telemetria

O SINAPSE-AI **nao coleta telemetria por padrao**. Nenhum dado de uso, metricas de performance ou informacoes de diagnostico sao enviados para servidores externos durante a operacao normal do framework.

### 2.2. Instalacao via npm

Ao instalar o SINAPSE-AI via `npm install sinapse-ai`, o registro npm (npmjs.com) coleta metadados padrao de instalacao conforme sua propria politica de privacidade. O SINAPSE-AI nao controla, acessa ou armazena esses metadados.

### 2.3. Dados de Configuracao

Arquivos de configuracao do SINAPSE-AI (como `core-config.yaml`, `user-config.yaml`) sao armazenados **exclusivamente no sistema de arquivos local** do usuario. Esses arquivos nunca sao transmitidos para servidores externos pelo framework.

---

## 3. Dados Processados pelos Agentes

### 3.1. Processamento Local

Todos os agentes do SINAPSE-AI processam dados **exclusivamente no ambiente local** do usuario. Isso inclui:

- Arquivos de codigo-fonte
- Documentacao de projetos
- Stories de desenvolvimento
- Registros de entidades
- Memoria de agentes

Nenhum desses dados e enviado para servidores externos pelo SINAPSE-AI.

### 3.2. Memoria de Agentes

Os agentes do SINAPSE-AI mantem memoria persistente em arquivos Markdown locais (ex.: `MEMORY.md`). Esses arquivos:

- Residem no diretorio do projeto do usuario
- Sao controlados pelo usuario via sistema de arquivos e git
- Podem ser editados, excluidos ou versionados livremente pelo usuario
- Nao sao transmitidos para servidores externos pelo SINAPSE-AI

---

## 4. Fluxo de Dados com Servicos de Terceiros

### 4.1. Claude Code (Anthropic)

O SINAPSE-AI opera como uma camada de orquestracao sobre o Claude Code da Anthropic. Quando utilizado com o Claude Code:

- Os dados de sessao sao gerenciados pela Anthropic conforme sua propria politica de privacidade
- O SINAPSE-AI nao intercepta, armazena ou redireciona dados trafegados entre o usuario e o Claude Code
- Consulte a [Politica de Privacidade da Anthropic](https://www.anthropic.com/privacy) para detalhes sobre o tratamento de dados pelo Claude Code

### 4.2. Servidores MCP (Model Context Protocol)

O SINAPSE-AI suporta integracao com servidores MCP via Docker. Nesse contexto:

- Servidores MCP sao executados em containers Docker isolados no ambiente local do usuario
- A ativacao e configuracao de servidores MCP e inteiramente controlada pelo usuario
- Cada servidor MCP possui sua propria politica de privacidade e termos de uso
- O SINAPSE-AI nao transmite dados para servidores MCP sem acao explicita do usuario

### 4.3. GitHub e Provedores Git

Quando o usuario utiliza funcionalidades de git (push, pull, PR) via agentes do SINAPSE-AI:

- Os dados transmitidos ao provedor git sao controlados pelo usuario
- O SINAPSE-AI nao armazena credenciais de git — utiliza as credenciais configuradas no ambiente local
- Consulte a politica de privacidade do seu provedor git para detalhes

### 4.4. npm (Node Package Manager)

- O SINAPSE-AI e distribuido via npm
- A instalacao e atualizacao do pacote estao sujeitas a [Politica de Privacidade do npm](https://docs.npmjs.com/policies/privacy)
- O SINAPSE-AI nao coleta dados adicionais durante a instalacao

---

## 5. Conformidade com a LGPD

O SINAPSE-AI foi projetado em conformidade com a Lei Geral de Protecao de Dados (LGPD — Lei n. 13.709/2018):

### 5.1. Base Legal (Art. 7 e 8)

O SINAPSE-AI nao coleta dados pessoais. Quando dados pessoais sao processados localmente pelos agentes, a base legal aplicavel e o **consentimento do usuario** (Art. 7, I) ou a **execucao de contrato** (Art. 7, V), conforme o contexto de uso.

### 5.2. Direitos do Titular (Art. 18)

Como todos os dados processados pelo SINAPSE-AI residem no ambiente local do usuario, o titular exerce seus direitos diretamente:

- **Acesso:** Os dados estao no sistema de arquivos do usuario, em formatos abertos (Markdown, YAML, JSON)
- **Correcao:** O usuario pode editar qualquer arquivo de dados diretamente
- **Eliminacao:** O usuario pode excluir qualquer arquivo de dados a qualquer momento
- **Portabilidade:** Os dados sao armazenados em formatos abertos e padronizados

### 5.3. Encarregado de Protecao de Dados (Art. 41)

Para questoes relacionadas a privacidade e protecao de dados no contexto do SINAPSE-AI, entre em contato pelo e-mail indicado na secao 7 deste documento.

---

## 6. Retencao de Dados

| Tipo de Dado | Retencao | Controle |
|-------------|----------|----------|
| Dados de sessao | Efemeros (durante a sessao) | Automatico |
| Memoria de agentes | Arquivos locais persistentes | Usuario (pode excluir a qualquer momento) |
| Configuracao | Arquivos locais persistentes | Usuario (pode editar/excluir) |
| Logs de debug | Arquivos locais temporarios | Usuario (pode limpar via CLI) |
| Dados de telemetria | Nenhum (nao coletados) | N/A |

---

## 7. Contato

Para duvidas sobre privacidade e protecao de dados:

- **E-mail:** privacy@sinapse-ai.dev
- **GitHub Issues:** [github.com/caioimori/sinapse-ai/issues](https://github.com/caioimori/sinapse-ai/issues)

---

## 8. Alteracoes nesta Politica

Reservamo-nos o direito de atualizar esta Politica de Privacidade periodicamente. Alteracoes significativas serao comunicadas por meio do changelog do projeto e das release notes no GitHub.

---

*SINAPSE-AI — Framework open-source de orquestracao de IA*
*Licenca MIT — Todos os dados permanecem sob controle do usuario*
