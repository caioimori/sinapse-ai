/**
 * Internationalization (i18n) for SINAPSE Wizard
 *
 * Supports: Portuguese (default), English (fallback)
 *
 * @module wizard/i18n
 */

const TRANSLATIONS = {
  en: {
    // Language selection
    selectLanguage: 'Select language:',

    // User Profile (Story 10.2 - Epic 10: User Profile System)
    userProfileQuestion: 'How would you like to set up SINAPSE?',
    modoAssistido: 'Quick Mode',
    modoAssistidoDesc: 'Automatic setup, zero technical decisions',
    modoAssistidoHint: 'Best for most users — installs everything automatically',
    modoAvancado: 'Custom Mode',
    modoAvancadoDesc: 'Choose tech stack, IDEs, and configurations',
    modoAvancadoHint: 'For developers who want full control',
    userProfileSkipped: 'Using existing user profile',
    languageSkipped: 'Using existing language',

    // LLM selection
    llmQuestion: 'Select your LLM:',
    llmRecommended: 'Recommended',
    llmBoth: 'Both',

    // Project type
    projectTypeQuestion: 'What type of project are you setting up?',
    greenfield: 'Greenfield',
    greenfieldDesc: 'new project from scratch',
    brownfield: 'Brownfield',
    brownfieldDesc: 'existing project',
    detectedProjectType: 'Detected: {type} project',
    detectedProjectTypeWithStack: 'Detected: {type} project ({stack})',
    detectedUpgrade: 'Detected: Existing SINAPSE project (upgrade)',
    infraApplied: 'Infrastructure templates applied',
    infraSkipped: 'Infrastructure templates skipped',
    agentsMdCreated: 'AGENTS.md created',

    // IDE selection
    ideQuestion: 'Select IDE(s):',
    ideHint: 'Space to select, Enter to confirm',
    recommended: 'Recommended',

    // Progress messages
    installingCore: 'Installing SINAPSE core...',
    installingIDE: 'Configuring IDEs...',
    installingDeps: 'Installing dependencies...',
    configuringEnv: 'Configuring environment...',
    validating: 'Validating installation...',
    installingGlobalAgents: 'Installing global agent definitions...',
    skippingGlobalAgentsCodex: 'Skipping global Claude agents (Codex-only install)',
    ideSyncDriftWarning: 'IDE sync out of date — run: sinapse doctor --fix',
    entityRegistrySkippedNoDeps:
      'Core dependencies (.sinapse-ai) not found — skipping entity registry setup',
    generatingBoundaryRules: 'Generating boundary rules...',
    copyingSkills: 'Copying skills...',
    copyingExtraCommands: 'Copying extra commands...',
    runningIdeSync: 'Running IDE sync...',
    runningCodexSync: 'Running Codex local-first sync...',
    bootstrappingEntityRegistry: 'Setting up entity registry...',
    generatingSynapseRuntime: 'Preparing context engine (.synapse/)...',
    synapseRuntimeFailed: 'Context engine generation failed (install continues; engine stays dormant)',
    installingLlmRouting: 'Installing LLM routing commands...',
    dependencyInstallation: 'Dependency installation...',

    // Validation report (AF-20260629 — i18n migration)
    reportTitle: 'Installation Validation Report',
    reportIdeConfig: 'IDE Configuration',
    reportEnvConfig: 'Environment Configuration',
    reportCoreConfig: 'Core Configuration',
    reportMcpConfig: 'MCP Configuration',
    reportMcpInstallation: 'MCP Installation',
    reportMcpHealthy: 'healthy',
    reportMcpWarnings: 'warnings',
    reportMcpFailed: 'failed',
    reportMcpsNotInstalled: 'MCPs not installed (skipped)',
    reportDependencies: 'Dependencies',
    reportChecksPassed: '{passed}/{total} checks passed',
    reportWarnings: 'Warnings ({count}):',
    reportErrors: 'Errors ({count}):',
    reportSolution: 'Solution: {solution}',
    reportNextSteps: 'Next Steps:',
    reportNextStep1: '1. Review the errors above',
    reportNextStep2: '2. Fix the critical issues',
    reportNextStep3: '3. Re-run the installation: npx sinapse-ai@latest install',
    reportOverallStatus: 'Overall Status',
    reportAllPassed: 'All checks passed!',
    reportPartialSuccess: 'PARTIAL SUCCESS ({count} issue(s) to review)',
    reportFailedStatus: 'FAILED ({count} error(s))',
    reportUnknownStatus: 'UNKNOWN',

    // Troubleshooting system (Story onda2-p6 — i18n migration, AF-20260702 item 2.9)
    troubleshootGuideTitle: 'Troubleshooting Guide',
    troubleshootAffectedItems: 'Affected items ({count}):',
    troubleshootAndMore: '... and {count} more',
    troubleshootPossibleCauses: 'Possible Causes:',
    troubleshootSolutionsHeading: 'Solutions:',
    troubleshootDocsLine: 'Docs: {url}',
    troubleshootGeneralSolutions: 'General Solutions:',
    troubleshootGeneralSolution1: '1. Review error message above',
    troubleshootGeneralSolution2: '2. Check installation logs in .sinapse/',
    troubleshootGeneralSolution3: '3. Re-run installation',
    troubleshootGeneralSolution4: '4. Contact support if issue persists',
    troubleshootViewLogsPrompt: 'Would you like to see installation logs for more details?',
    troubleshootInstallationLogsTitle: 'Installation Logs:',
    troubleshootViewWithCat: 'View with: cat .sinapse/install-log.txt',
    troubleshootOpenDocsPrompt: 'Would you like to open the troubleshooting documentation?',
    troubleshootDocumentationTitle: 'Documentation:',
    troubleshootNeedHelpTitle: 'Need Help?',
    troubleshootGithubIssuesLine: 'GitHub Issues: {url}',
    troubleshootDocumentationLine: 'Documentation: {url}',

    // Troubleshooting database — TROUBLESHOOTING_DATABASE entries (problem/causes/solutions)
    troubleshootEnvFileMissingProblem: '.env file not found',
    troubleshootEnvFileMissingCauses: [
      'Environment configuration step failed',
      'File creation permissions issue',
      '.env accidentally deleted',
    ],
    troubleshootEnvFileMissingSolutions: [
      'Re-run wizard: npx sinapse-ai@latest install',
      'Manually create .env from template: cp .env.example .env',
      'Check file permissions in project directory',
    ],

    troubleshootCoreConfigMissingProblem: 'core-config.yaml not found',
    troubleshootCoreConfigMissingCauses: [
      'Environment configuration step failed',
      '.sinapse-ai directory missing',
      'File creation failed',
    ],
    troubleshootCoreConfigMissingSolutions: [
      'Re-run wizard: npx sinapse-ai@latest install',
      'Check .sinapse-ai directory exists',
      'Manually create from template',
    ],

    troubleshootMcpHealthCheckFailedProblem: 'MCP health check failed',
    troubleshootMcpHealthCheckFailedCauses: [
      'API key missing or invalid',
      'Network connectivity issues',
      'MCP service temporarily unavailable',
      'Package not installed correctly',
    ],
    troubleshootMcpHealthCheckFailedSolutions: [
      'Verify API key in .env file',
      'Test network: curl https://api.service.com/health',
      'Retry MCP installation: npm run install:mcps',
      'Check MCP service status',
      'Verify npx can access package: npx -y [package-name] --version',
    ],

    troubleshootAllMcpHealthChecksFailedProblem: 'All MCP health checks failed',
    troubleshootAllMcpHealthChecksFailedCauses: [
      'Network connectivity issue',
      'MCPs not installed correctly',
      'Configuration file corrupted',
      'API keys not configured',
    ],
    troubleshootAllMcpHealthChecksFailedSolutions: [
      'Check internet connection',
      'Re-run MCP installation',
      'Verify .mcp.json syntax',
      'Configure API keys in .env',
      'Delete .mcp.json and reinstall',
    ],

    troubleshootGitignoreCriticalMissingProblem: '.gitignore missing critical entries',
    troubleshootGitignoreCriticalMissingCauses: [
      '.gitignore not created during setup',
      '.gitignore manually edited incorrectly',
      'Git not initialized',
    ],
    troubleshootGitignoreCriticalMissingSolutions: [
      'Add missing entries to .gitignore',
      'Copy from template: .env, node_modules, *.key, *.pem',
      'Initialize git if needed: git init',
    ],

    troubleshootDepsInstallFailedProblem: 'Dependencies installation failed',
    troubleshootDepsInstallFailedCauses: [
      'Network connectivity issues',
      'Package manager not installed',
      'npm/yarn registry unavailable',
      'Disk space insufficient',
    ],
    troubleshootDepsInstallFailedSolutions: [
      'Check internet connection',
      'Verify package manager installed: npm --version',
      'Clear cache: npm cache clean --force',
      'Try different package manager: yarn or pnpm',
      'Check disk space: df -h (Unix) or dir (Windows)',
    ],

    troubleshootCriticalDepsMissingProblem: 'Critical dependencies missing',
    troubleshootCriticalDepsMissingCauses: [
      'Dependency installation incomplete',
      'node_modules corrupted',
      'Package installation failed silently',
    ],
    troubleshootCriticalDepsMissingSolutions: [
      'Delete node_modules: rm -rf node_modules',
      'Delete lock file: rm package-lock.json',
      'Reinstall: npm install',
      'Try clean install: npm ci',
    ],

    troubleshootVulnerabilitiesFoundProblem: 'Security vulnerabilities found in dependencies',
    troubleshootVulnerabilitiesFoundCauses: [
      'Outdated packages with known vulnerabilities',
      'Transitive dependencies with security issues',
    ],
    troubleshootVulnerabilitiesFoundSolutions: [
      'Run: npm audit fix',
      'Run: npm audit fix --force (if needed)',
      'Update packages: npm update',
      'Review: npm audit for details',
    ],

    troubleshootEnvPermissionsInsecureProblem: '.env file permissions too permissive',
    troubleshootEnvPermissionsInsecureCauses: [
      'File created with default permissions',
      'Permissions not set during installation',
    ],
    troubleshootEnvPermissionsInsecureSolutions: [
      'Run: chmod 600 .env',
      'Verify: ls -la .env',
    ],

    // Status
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    skipped: 'Skipped',

    // Welcome
    welcomeMessage: 'Welcome to SINAPSE AI.',
    welcomeSubtitle: 'Your AI-powered copilot.',
    welcomeDesc1: 'Everything you need to build,',
    welcomeDesc2: 'package and ship with AI.',
    welcomePreparing: 'Preparing your experience...',

    // Completion
    completionInstalled: 'SINAPSE AI installed',
    completionConfigured: 'configured',
    completionAgents: 'agents available',
    completionReady: 'Ready!',
    completionDepsMissing: 'Dependencies were not installed. Run `npm install` in this project before using it.',
    startCommandClaude: "Type 'sinapse' in terminal to start.",
    startCommandCodex: "Type 'codex' in terminal to start.",
    startCommandBoth: "Type 'sinapse' (Claude) or 'codex' (Codex) in terminal to start.",

    installComplete: 'Installation Complete!',
    readyToUse: 'Your SINAPSE project is ready.',
    nextSteps: 'Next steps:',
    quickStart: 'Quick Start:',
    quickStartAgents: 'Talk to your AI agents: @developer, @quality-gate, @architect',
    quickStartStory: 'Create a story: @project-lead *create-story',
    quickStartHelp: 'Get help: @sinapse-orqx *help',

    // Cancellation
    cancelConfirm: 'Cancel installation?',
    cancelled: 'Installation cancelled.',
    tryAgain: 'Run `npx sinapse-ai init` to try again.',
    continuing: 'Continuing installation...',
  },

  pt: {
    // Language selection
    selectLanguage: 'Selecione o idioma:',

    // User Profile (Story 10.2 - Epic 10: User Profile System)
    userProfileQuestion: 'Como voce gostaria de configurar o SINAPSE?',
    modoAssistido: 'Modo Rapido',
    modoAssistidoDesc: 'Configuracao automatica, zero decisoes tecnicas',
    modoAssistidoHint: 'Melhor para a maioria — instala tudo automaticamente',
    modoAvancado: 'Modo Personalizado',
    modoAvancadoDesc: 'Escolha tech stack, IDEs e configuracoes',
    modoAvancadoHint: 'Para desenvolvedores que querem controle total',
    userProfileSkipped: 'Usando perfil de usuário existente',
    languageSkipped: 'Usando idioma existente',

    // LLM selection
    llmQuestion: 'Escolha sua LLM:',
    llmRecommended: 'Recomendado',
    llmBoth: 'Ambos',

    // Project type
    projectTypeQuestion: 'Que tipo de projeto você está configurando?',
    greenfield: 'Greenfield',
    greenfieldDesc: 'projeto novo do zero',
    brownfield: 'Brownfield',
    brownfieldDesc: 'projeto existente',
    detectedProjectType: 'Detectado: projeto {type}',
    detectedProjectTypeWithStack: 'Detectado: projeto {type} ({stack})',
    detectedUpgrade: 'Detectado: projeto SINAPSE existente (upgrade)',
    infraApplied: 'Templates de infraestrutura aplicados',
    infraSkipped: 'Templates de infraestrutura ignorados',
    agentsMdCreated: 'AGENTS.md criado',

    // IDE selection
    ideQuestion: 'Selecione IDE(s):',
    ideHint: 'Espaço para selecionar, Enter para confirmar',
    recommended: 'Recomendado',

    // Progress messages
    installingCore: 'Instalando SINAPSE core...',
    installingIDE: 'Configurando IDEs...',
    installingDeps: 'Instalando dependências...',
    configuringEnv: 'Configurando ambiente...',
    validating: 'Validando instalação...',
    installingGlobalAgents: 'Instalando definições globais de agentes...',
    skippingGlobalAgentsCodex: 'Pulando agentes globais do Claude (instalação somente Codex)',
    ideSyncDriftWarning: 'Sincronização de IDE desatualizada — rode: sinapse doctor --fix',
    entityRegistrySkippedNoDeps:
      'Dependências do núcleo (.sinapse-ai) não encontradas — pulando o registro de entidades',
    generatingBoundaryRules: 'Gerando regras de proteção...',
    copyingSkills: 'Copiando skills...',
    copyingExtraCommands: 'Copiando comandos extras...',
    runningIdeSync: 'Sincronizando IDEs...',
    runningCodexSync: 'Sincronizando Codex (local-first)...',
    bootstrappingEntityRegistry: 'Preparando o registro de entidades...',
    generatingSynapseRuntime: 'Preparando o motor de contexto (.synapse/)...',
    synapseRuntimeFailed: 'Geração do motor de contexto falhou (instalação continua; motor fica inativo)',
    installingLlmRouting: 'Instalando comandos de roteamento de LLM...',
    dependencyInstallation: 'Instalação de dependências...',

    // Validation report (AF-20260629 — i18n migration)
    reportTitle: 'Relatório de Validação da Instalação',
    reportIdeConfig: 'Configuração de IDE',
    reportEnvConfig: 'Configuração de Ambiente',
    reportCoreConfig: 'Configuração do Núcleo',
    reportMcpConfig: 'Configuração de MCP',
    reportMcpInstallation: 'Instalação de MCP',
    reportMcpHealthy: 'saudáveis',
    reportMcpWarnings: 'avisos',
    reportMcpFailed: 'falharam',
    reportMcpsNotInstalled: 'MCPs não instalados (pulado)',
    reportDependencies: 'Dependências',
    reportChecksPassed: '{passed}/{total} verificações OK',
    reportWarnings: 'Avisos ({count}):',
    reportErrors: 'Erros ({count}):',
    reportSolution: 'Solução: {solution}',
    reportNextSteps: 'Próximos Passos:',
    reportNextStep1: '1. Revise os erros acima',
    reportNextStep2: '2. Corrija os problemas críticos',
    reportNextStep3: '3. Rode a instalação novamente: npx sinapse-ai@latest install',
    reportOverallStatus: 'Status Geral',
    reportAllPassed: 'Todas as verificações passaram!',
    reportPartialSuccess: 'SUCESSO PARCIAL ({count} ponto(s) a revisar)',
    reportFailedStatus: 'FALHOU ({count} erro(s))',
    reportUnknownStatus: 'DESCONHECIDO',

    // Troubleshooting system (Story onda2-p6 — i18n migration, AF-20260702 item 2.9)
    troubleshootGuideTitle: 'Guia de Solução de Problemas',
    troubleshootAffectedItems: 'Itens afetados ({count}):',
    troubleshootAndMore: '... e mais {count}',
    troubleshootPossibleCauses: 'Possíveis Causas:',
    troubleshootSolutionsHeading: 'Soluções:',
    troubleshootDocsLine: 'Documentação: {url}',
    troubleshootGeneralSolutions: 'Soluções Gerais:',
    troubleshootGeneralSolution1: '1. Revise a mensagem de erro acima',
    troubleshootGeneralSolution2: '2. Verifique os logs de instalação em .sinapse/',
    troubleshootGeneralSolution3: '3. Rode a instalação novamente',
    troubleshootGeneralSolution4: '4. Contate o suporte se o problema persistir',
    troubleshootViewLogsPrompt: 'Gostaria de ver os logs de instalação para mais detalhes?',
    troubleshootInstallationLogsTitle: 'Logs de Instalação:',
    troubleshootViewWithCat: 'Veja com: cat .sinapse/install-log.txt',
    troubleshootOpenDocsPrompt: 'Gostaria de abrir a documentação de solução de problemas?',
    troubleshootDocumentationTitle: 'Documentação:',
    troubleshootNeedHelpTitle: 'Precisa de Ajuda?',
    troubleshootGithubIssuesLine: 'Issues do GitHub: {url}',
    troubleshootDocumentationLine: 'Documentação: {url}',

    // Troubleshooting database — TROUBLESHOOTING_DATABASE entries (problem/causes/solutions)
    troubleshootEnvFileMissingProblem: 'Arquivo .env não encontrado',
    troubleshootEnvFileMissingCauses: [
      'A etapa de configuração de ambiente falhou',
      'Problema de permissão na criação do arquivo',
      '.env foi apagado acidentalmente',
    ],
    troubleshootEnvFileMissingSolutions: [
      'Rode o assistente novamente: npx sinapse-ai@latest install',
      'Crie o .env manualmente a partir do modelo: cp .env.example .env',
      'Verifique as permissões de arquivo no diretório do projeto',
    ],

    troubleshootCoreConfigMissingProblem: 'core-config.yaml não encontrado',
    troubleshootCoreConfigMissingCauses: [
      'A etapa de configuração de ambiente falhou',
      'Diretório .sinapse-ai ausente',
      'Falha na criação do arquivo',
    ],
    troubleshootCoreConfigMissingSolutions: [
      'Rode o assistente novamente: npx sinapse-ai@latest install',
      'Verifique se o diretório .sinapse-ai existe',
      'Crie manualmente a partir do modelo',
    ],

    troubleshootMcpHealthCheckFailedProblem: 'Verificação de saúde do MCP falhou',
    troubleshootMcpHealthCheckFailedCauses: [
      'Chave de API ausente ou inválida',
      'Problemas de conectividade de rede',
      'Serviço MCP temporariamente indisponível',
      'Pacote não instalado corretamente',
    ],
    troubleshootMcpHealthCheckFailedSolutions: [
      'Verifique a chave de API no arquivo .env',
      'Teste a rede: curl https://api.service.com/health',
      'Tente instalar o MCP novamente: npm run install:mcps',
      'Verifique o status do serviço MCP',
      'Verifique se o npx consegue acessar o pacote: npx -y [package-name] --version',
    ],

    troubleshootAllMcpHealthChecksFailedProblem: 'Todas as verificações de saúde de MCP falharam',
    troubleshootAllMcpHealthChecksFailedCauses: [
      'Problema de conectividade de rede',
      'MCPs não instalados corretamente',
      'Arquivo de configuração corrompido',
      'Chaves de API não configuradas',
    ],
    troubleshootAllMcpHealthChecksFailedSolutions: [
      'Verifique a conexão com a internet',
      'Rode a instalação do MCP novamente',
      'Verifique a sintaxe do .mcp.json',
      'Configure as chaves de API no .env',
      'Apague o .mcp.json e reinstale',
    ],

    troubleshootGitignoreCriticalMissingProblem: '.gitignore sem entradas críticas',
    troubleshootGitignoreCriticalMissingCauses: [
      '.gitignore não foi criado durante a configuração',
      '.gitignore editado manualmente de forma incorreta',
      'Git não inicializado',
    ],
    troubleshootGitignoreCriticalMissingSolutions: [
      'Adicione as entradas ausentes ao .gitignore',
      'Copie do modelo: .env, node_modules, *.key, *.pem',
      'Inicialize o git se necessário: git init',
    ],

    troubleshootDepsInstallFailedProblem: 'Falha na instalação de dependências',
    troubleshootDepsInstallFailedCauses: [
      'Problemas de conectividade de rede',
      'Gerenciador de pacotes não instalado',
      'Registro do npm/yarn indisponível',
      'Espaço em disco insuficiente',
    ],
    troubleshootDepsInstallFailedSolutions: [
      'Verifique a conexão com a internet',
      'Verifique se o gerenciador de pacotes está instalado: npm --version',
      'Limpe o cache: npm cache clean --force',
      'Tente outro gerenciador de pacotes: yarn ou pnpm',
      'Verifique o espaço em disco: df -h (Unix) ou dir (Windows)',
    ],

    troubleshootCriticalDepsMissingProblem: 'Dependências críticas ausentes',
    troubleshootCriticalDepsMissingCauses: [
      'Instalação de dependências incompleta',
      'node_modules corrompido',
      'Instalação de pacotes falhou silenciosamente',
    ],
    troubleshootCriticalDepsMissingSolutions: [
      'Apague o node_modules: rm -rf node_modules',
      'Apague o arquivo de lock: rm package-lock.json',
      'Reinstale: npm install',
      'Tente uma instalação limpa: npm ci',
    ],

    troubleshootVulnerabilitiesFoundProblem: 'Vulnerabilidades de segurança encontradas nas dependências',
    troubleshootVulnerabilitiesFoundCauses: [
      'Pacotes desatualizados com vulnerabilidades conhecidas',
      'Dependências transitivas com problemas de segurança',
    ],
    troubleshootVulnerabilitiesFoundSolutions: [
      'Rode: npm audit fix',
      'Rode: npm audit fix --force (se necessário)',
      'Atualize os pacotes: npm update',
      'Revise os detalhes: npm audit',
    ],

    troubleshootEnvPermissionsInsecureProblem: 'Permissões do arquivo .env excessivamente permissivas',
    troubleshootEnvPermissionsInsecureCauses: [
      'Arquivo criado com permissões padrão',
      'Permissões não definidas durante a instalação',
    ],
    troubleshootEnvPermissionsInsecureSolutions: [
      'Rode: chmod 600 .env',
      'Verifique: ls -la .env',
    ],

    // Status
    success: 'Sucesso',
    error: 'Erro',
    warning: 'Aviso',
    skipped: 'Pulado',

    // Welcome
    welcomeMessage: 'Bem-vindo ao SINAPSE AI.',
    welcomeSubtitle: 'Seu copiloto de inteligencia artificial.',
    welcomeDesc1: 'Tudo que voce precisa para construir,',
    welcomeDesc2: 'empacotar e distribuir com IA.',
    welcomePreparing: 'Preparando sua imersao...',

    // Completion
    completionInstalled: 'SINAPSE AI instalado',
    completionConfigured: 'configurado',
    completionAgents: 'agentes disponiveis',
    completionReady: 'Pronto!',
    completionDepsMissing: 'As dependencias nao foram instaladas. Rode `npm install` neste projeto antes de usar.',
    startCommandClaude: "Digite 'sinapse' no terminal para comecar.",
    startCommandCodex: "Digite 'codex' no terminal para comecar.",
    startCommandBoth: "Digite 'sinapse' (Claude) ou 'codex' (Codex) no terminal para comecar.",

    installComplete: 'Instalação Completa!',
    readyToUse: 'Seu projeto SINAPSE está pronto.',
    nextSteps: 'Próximos passos:',
    quickStart: 'Início Rápido:',
    quickStartAgents: 'Converse com seus agentes IA: @developer, @quality-gate, @architect',
    quickStartStory: 'Crie uma story: @project-lead *create-story',
    quickStartHelp: 'Obtenha ajuda: @sinapse-orqx *help',

    // Cancellation
    cancelConfirm: 'Cancelar instalação?',
    cancelled: 'Instalação cancelada.',
    tryAgain: 'Execute `npx sinapse-ai init` para tentar novamente.',
    continuing: 'Continuando instalação...',
  },

  // es: removed — PT-BR hardcoded as default
};

// Current language (default: Portuguese — product owner decision). English
// remains the missing-key fallback inside t() and a selectable choice.
let currentLanguage = 'pt';

/**
 * Set current language
 * @param {string} lang - Language code (en, pt, es)
 */
function setLanguage(lang) {
  if (TRANSLATIONS[lang]) {
    currentLanguage = lang;
  }
}

/**
 * Get current language
 * @returns {string} Current language code
 */
function getLanguage() {
  return currentLanguage;
}

/**
 * Get translated string
 * @param {string} key - Translation key
 * @returns {string} Translated string
 */
function t(key) {
  return TRANSLATIONS[currentLanguage][key] || TRANSLATIONS['en'][key] || key;
}

/**
 * Get translated string with placeholder substitution.
 * Placeholders use {name} syntax.
 *
 * @param {string} key - Translation key
 * @param {Object} [params={}] - Placeholder values
 * @returns {string} Translated string with substitutions
 * @example tf('proIncorrectPassword', { remaining: 2 })
 */
function tf(key, params = {}) {
  let str = t(key);
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return str;
}

/**
 * Get a translated list (array of strings). Same fallback chain as t():
 * current language -> English -> empty array (never the raw key, since a
 * key isn't a sensible list to display).
 *
 * @param {string} key - Translation key whose value is an array
 * @returns {string[]} Translated list
 * @example tList('troubleshootEnvFileMissingCauses')
 */
function tList(key) {
  return TRANSLATIONS[currentLanguage][key] || TRANSLATIONS['en'][key] || [];
}

/**
 * Get language selection choices
 * @returns {Array} Inquirer choices
 */
function getLanguageChoices() {
  return [
    { name: 'Português', value: 'pt' },
    { name: 'English', value: 'en' },
  ];
}

module.exports = {
  setLanguage,
  getLanguage,
  t,
  tf,
  tList,
  getLanguageChoices,
  TRANSLATIONS,
};
