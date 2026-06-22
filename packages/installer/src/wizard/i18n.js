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
  getLanguageChoices,
  TRANSLATIONS,
};
