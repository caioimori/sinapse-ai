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

    // Pro Installation Wizard (pro-setup.js)
    proWizardTitle: 'SINAPSE Pro Installation Wizard',
    proWizardSubtitle: 'Premium Content & Features',
    proLicenseActivation: 'License Activation',
    proContentInstallation: 'Pro Content Installation',
    proVerification: 'Verification',
    proHowActivate: 'How would you like to activate Pro?',
    proLoginOrCreate: 'Login or create account (Recommended)',
    proEnterKey: 'Enter license key (legacy)',
    proEmailLabel: 'Email:',
    proEmailRequired: 'Email is required',
    proEmailInvalid: 'Please enter a valid email address',
    proVerifyingAccess: 'Verifying your access...',
    proNoAccess: 'No SINAPSE Pro access found for this email.',
    proContactSupport: 'If you believe this is an error, please contact support:',
    proPurchase: 'Purchase Pro: https://pro.sinapse.ai',
    proEmailNotBuyer: 'Email not found in Pro buyers list.',
    proAccessConfirmedAccount: 'Pro access confirmed! Account found.',
    proAccessConfirmedCreate: "Pro access confirmed! Let's create your account.",
    proPasswordLabel: 'Password:',
    proPasswordMin: 'Password must be at least {min} characters',
    proAuthenticating: 'Authenticating...',
    proAuthSuccess: 'Authenticated successfully.',
    proEmailNotVerified: 'Email not verified yet. Please check your inbox and click the verification link.',
    proCheckingEvery: '(Checking every 5 seconds... timeout in 10 minutes)',
    proEmailVerified: 'Email verified!',
    proVerificationTimeout: 'Email verification timed out after 10 minutes.',
    proRunAgain: 'Run the installer again to retry.',
    proIncorrectPassword: 'Incorrect password. {remaining} attempt(s) remaining.',
    proMaxAttempts: 'Maximum login attempts reached.',
    proForgotPassword: 'Forgot your password? Visit https://sinapse-license-server.vercel.app/reset-password',
    proContactSupportEmail: 'Or open an issue: https://github.com/caioimori/sinapse-ai/issues',
    proAuthFailed: 'Authentication failed: {message}',
    proCreateAccount: 'Create your SINAPSE Pro account to get started.',
    proChoosePassword: 'Choose a password:',
    proConfirmPassword: 'Confirm password:',
    proPasswordsNoMatch: 'Passwords do not match',
    proCreatingAccount: 'Creating account...',
    proAccountCreated: 'Account created! Verification email sent.',
    proAccountExists: 'Account already exists. Switching to login...',
    proAccountFailed: 'Account creation failed: {message}',
    proCheckEmail: 'Please check your email and click the verification link.',
    proWaitingVerification: 'Waiting for email verification...',
    proAfterVerifying: 'After verifying, the installation will continue automatically.',
    proPressResend: '[Press R to resend verification email]',
    proVerificationResent: 'Verification email resent.',
    proCouldNotResend: 'Could not resend: {message}',
    proRunAgainRetry: 'Run the installer again to retry verification.',
    proValidatingSubscription: 'Validating Pro subscription...',
    proSubscriptionConfirmed: 'Pro subscription confirmed! License: {key}',
    proNoSubscription: 'No active Pro subscription found for this email.',
    proPurchaseAt: 'Purchase Pro at https://pro.sinapse.ai',
    proSeatLimit: 'Deactivate another device or upgrade your license.',
    proAlreadyActivated: 'Pro license already activated for this account.',
    proActivationFailed: 'Activation failed: {message}',
    proEnterKeyPrompt: 'Enter your Pro license key:',
    proKeyRequired: 'License key is required',
    proKeyInvalid: 'Invalid format. Expected: PRO-XXXX-XXXX-XXXX-XXXX',
    proKeyValidated: 'License validated: {key}',
    proModuleNotAvailable: 'Pro license module not available. Ensure @sinapse-fullstack/pro is installed.',
    proModuleBootstrap: 'Pro license module not found locally. Installing @sinapse-fullstack/pro to bootstrap...',
    proServerUnreachable: 'License server is unreachable. Check your internet connection and try again.',
    proVerifyingAccessShort: 'Verifying access...',
    proAccessConfirmed: 'Pro access confirmed.',
    proBuyerCheckUnavailable: 'Buyer check unavailable, proceeding with login...',
    proLoginFailedSignup: 'Login failed, attempting signup...',
    proAccountCreatedVerify: 'Account created. Verification email sent!',
    proAccountExistsWrongPw: 'Account exists but the password is incorrect.',
    proAuthFailedShort: 'Authentication failed.',
    proValidatingKey: 'Validating license {key}...',
    proInvalidKey: 'Invalid license key.',
    proExpiredKey: 'License key has expired.',
    proMaxActivations: 'Maximum activations reached for this key.',
    proRateLimited: 'Too many requests. Please wait and try again.',
    proValidationFailed: 'License validation failed: {message}',
    proInvalidKeyFormat: 'Invalid key format: {key}. Expected: PRO-XXXX-XXXX-XXXX-XXXX',
    proScaffolding: 'Scaffolding pro content...',
    proScaffoldingProgress: 'Scaffolding: {message}',
    proContentInstalled: 'Pro content installed ({count} files)',
    proScaffoldFailed: 'Scaffolding failed',
    proScaffoldError: 'Scaffolding error: {message}',
    proInitPackageJson: 'Initializing package.json...',
    proPackageJsonCreated: 'package.json created',
    proPackageJsonFailed: 'Failed to create package.json',
    proInstallingPackage: 'Installing @sinapse-fullstack/pro...',
    proPackageInstalled: 'Pro package installed',
    proPackageInstallFailed: 'Failed to install Pro package',
    proScaffolderNotAvailable: 'Pro scaffolder not available. Ensure @sinapse-fullstack/pro is installed.',
    proFilesInstalled: 'Files installed: {count}',
    proSquads: 'Squads: {names}',
    proConfigs: 'Configs: {count} files',
    proFeaturesUnlocked: 'Features unlocked: {count}',
    proInstallComplete: 'SINAPSE Pro installation complete!',
    proNeedHelp: 'Need help? Run: npx sinapse-pro recover',
    proCISetEnv: 'CI mode: Set SINAPSE_PRO_EMAIL + SINAPSE_PRO_PASSWORD or SINAPSE_PRO_KEY environment variables.',
    proVerificationFailed: 'Verification failed: {message}',
    proPackageNotFound: 'Pro package not found after npm install. Check npm output.',
    proScaffolderNotFound: 'Pro scaffolder module not found.',
    proNpmInitFailed: 'npm init failed: {message}',
    proNpmInstallFailed: 'npm install @sinapse-fullstack/pro failed: {message}. Try manually: npm install @sinapse-fullstack/pro',
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

    // Pro Installation Wizard (pro-setup.js)
    proWizardTitle: 'Assistente de Instalação SINAPSE Pro',
    proWizardSubtitle: 'Conteúdo e Recursos Premium',
    proLicenseActivation: 'Ativação de Licença',
    proContentInstallation: 'Instalação do Conteúdo Pro',
    proVerification: 'Verificação',
    proHowActivate: 'Como você gostaria de ativar o Pro?',
    proLoginOrCreate: 'Login ou criar conta (Recomendado)',
    proEnterKey: 'Inserir chave de licença (legado)',
    proEmailLabel: 'Email:',
    proEmailRequired: 'Email é obrigatório',
    proEmailInvalid: 'Por favor, insira um endereço de email válido',
    proVerifyingAccess: 'Verificando seu acesso...',
    proNoAccess: 'Nenhum acesso SINAPSE Pro encontrado para este email.',
    proContactSupport: 'Se você acredita que isso é um erro, entre em contato com o suporte:',
    proPurchase: 'Comprar Pro: https://pro.sinapse.ai',
    proEmailNotBuyer: 'Email não encontrado na lista de compradores Pro.',
    proAccessConfirmedAccount: 'Acesso Pro confirmado! Conta encontrada.',
    proAccessConfirmedCreate: 'Acesso Pro confirmado! Vamos criar sua conta.',
    proPasswordLabel: 'Senha:',
    proPasswordMin: 'A senha deve ter pelo menos {min} caracteres',
    proAuthenticating: 'Autenticando...',
    proAuthSuccess: 'Autenticado com sucesso.',
    proEmailNotVerified: 'Email ainda não verificado. Verifique sua caixa de entrada e clique no link de verificação.',
    proCheckingEvery: '(Verificando a cada 5 segundos... tempo limite de 10 minutos)',
    proEmailVerified: 'Email verificado!',
    proVerificationTimeout: 'Verificação de email expirou após 10 minutos.',
    proRunAgain: 'Execute o instalador novamente para tentar.',
    proIncorrectPassword: 'Senha incorreta. {remaining} tentativa(s) restante(s).',
    proMaxAttempts: 'Número máximo de tentativas de login atingido.',
    proForgotPassword: 'Esqueceu sua senha? Acesse https://sinapse-license-server.vercel.app/reset-password',
    proContactSupportEmail: 'Ou abra uma issue: https://github.com/caioimori/sinapse-ai/issues',
    proAuthFailed: 'Falha na autenticação: {message}',
    proCreateAccount: 'Crie sua conta SINAPSE Pro para começar.',
    proChoosePassword: 'Escolha uma senha:',
    proConfirmPassword: 'Confirme a senha:',
    proPasswordsNoMatch: 'As senhas não correspondem',
    proCreatingAccount: 'Criando conta...',
    proAccountCreated: 'Conta criada! Email de verificação enviado.',
    proAccountExists: 'Conta já existe. Mudando para login...',
    proAccountFailed: 'Falha ao criar conta: {message}',
    proCheckEmail: 'Por favor, verifique seu email e clique no link de verificação.',
    proWaitingVerification: 'Aguardando verificação de email...',
    proAfterVerifying: 'Após verificar, a instalação continuará automaticamente.',
    proPressResend: '[Pressione R para reenviar email de verificação]',
    proVerificationResent: 'Email de verificação reenviado.',
    proCouldNotResend: 'Não foi possível reenviar: {message}',
    proRunAgainRetry: 'Execute o instalador novamente para tentar a verificação.',
    proValidatingSubscription: 'Validando assinatura Pro...',
    proSubscriptionConfirmed: 'Assinatura Pro confirmada! Licença: {key}',
    proNoSubscription: 'Nenhuma assinatura Pro ativa encontrada para este email.',
    proPurchaseAt: 'Compre o Pro em https://pro.sinapse.ai',
    proSeatLimit: 'Desative outro dispositivo ou faça upgrade da sua licença.',
    proAlreadyActivated: 'Licença Pro já ativada para esta conta.',
    proActivationFailed: 'Falha na ativação: {message}',
    proEnterKeyPrompt: 'Insira sua chave de licença Pro:',
    proKeyRequired: 'Chave de licença é obrigatória',
    proKeyInvalid: 'Formato inválido. Esperado: PRO-XXXX-XXXX-XXXX-XXXX',
    proKeyValidated: 'Licença validada: {key}',
    proModuleNotAvailable: 'Módulo de licença Pro não disponível. Certifique-se de que @sinapse-fullstack/pro está instalado.',
    proModuleBootstrap: 'Módulo de licença Pro não encontrado localmente. Instalando @sinapse-fullstack/pro...',
    proServerUnreachable: 'Servidor de licenças inacessível. Verifique sua conexão com a internet e tente novamente.',
    proVerifyingAccessShort: 'Verificando acesso...',
    proAccessConfirmed: 'Acesso Pro confirmado.',
    proBuyerCheckUnavailable: 'Verificação de comprador indisponível, prosseguindo com login...',
    proLoginFailedSignup: 'Login falhou, tentando cadastro...',
    proAccountCreatedVerify: 'Conta criada. Email de verificação enviado!',
    proAccountExistsWrongPw: 'Conta existe mas a senha está incorreta.',
    proAuthFailedShort: 'Falha na autenticação.',
    proValidatingKey: 'Validando licença {key}...',
    proInvalidKey: 'Chave de licença inválida.',
    proExpiredKey: 'Chave de licença expirada.',
    proMaxActivations: 'Número máximo de ativações atingido para esta chave.',
    proRateLimited: 'Muitas requisições. Aguarde e tente novamente.',
    proValidationFailed: 'Validação de licença falhou: {message}',
    proInvalidKeyFormat: 'Formato de chave inválido: {key}. Esperado: PRO-XXXX-XXXX-XXXX-XXXX',
    proScaffolding: 'Instalando conteúdo pro...',
    proScaffoldingProgress: 'Instalando: {message}',
    proContentInstalled: 'Conteúdo Pro instalado ({count} arquivos)',
    proScaffoldFailed: 'Instalação falhou',
    proScaffoldError: 'Erro na instalação: {message}',
    proInitPackageJson: 'Inicializando package.json...',
    proPackageJsonCreated: 'package.json criado',
    proPackageJsonFailed: 'Falha ao criar package.json',
    proInstallingPackage: 'Instalando @sinapse-fullstack/pro...',
    proPackageInstalled: 'Pacote Pro instalado',
    proPackageInstallFailed: 'Falha ao instalar pacote Pro',
    proScaffolderNotAvailable: 'Scaffolder Pro não disponível. Certifique-se de que @sinapse-fullstack/pro está instalado.',
    proFilesInstalled: 'Arquivos instalados: {count}',
    proSquads: 'Squads: {names}',
    proConfigs: 'Configs: {count} arquivos',
    proFeaturesUnlocked: 'Recursos desbloqueados: {count}',
    proInstallComplete: 'Instalação do SINAPSE Pro completa!',
    proNeedHelp: 'Precisa de ajuda? Execute: npx sinapse-pro recover',
    proCISetEnv: 'Modo CI: Defina as variáveis SINAPSE_PRO_EMAIL + SINAPSE_PRO_PASSWORD ou SINAPSE_PRO_KEY.',
    proVerificationFailed: 'Verificação falhou: {message}',
    proPackageNotFound: 'Pacote Pro não encontrado após npm install. Verifique a saída do npm.',
    proScaffolderNotFound: 'Módulo scaffolder Pro não encontrado.',
    proNpmInitFailed: 'npm init falhou: {message}',
    proNpmInstallFailed: 'npm install @sinapse-fullstack/pro falhou: {message}. Tente manualmente: npm install @sinapse-fullstack/pro',
  },

  // es: removed — PT-BR hardcoded as default
};

// Current language (default: English — worldwide product)
let currentLanguage = 'en';

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
