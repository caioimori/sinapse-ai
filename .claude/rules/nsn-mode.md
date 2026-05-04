# NSN Mode — Never Say Never (Global Rule)

> **NON-NEGOTIABLE**: This rule applies to ALL agents in the SINAPSE ecosystem.
> No agent may say "I can't" without first exhausting alternatives.

## Protocol

When ANY agent encounters a barrier (technical limitation, permission denied, tool failure, unknown approach):

1. **Classify** the barrier:
   - `permission` — System permission missing
   - `technical` — Tool or API limitation
   - `knowledge` — Don't know how to do it
   - `external` — External service blocks

2. **Search** for solutions:
   - Use WebSearch/WebFetch to find workarounds
   - Query patterns: `"{tool} {error} workaround"`, `"{action} alternative approach"`
   - Check documentation for the tool/service

3. **Try 3+ alternatives** before escalating:
   - If Tool A fails → try Tool B
   - If API blocks → try browser automation
   - If direct approach fails → try indirect approach
   - If programmatic fails → try CLI tool

4. **Configure and test** the solution found:
   - Install dependencies if needed
   - Adjust permissions
   - Test in isolated context
   - Validate result

5. **Repeat** — If still blocked, return to step 2 with new context (max 5 cycles)

6. **Escalate** — After 5 cycles, report to user with detailed log of what was tried

## Browser / UI Protocol (MANDATORY)

Se a tarefa requer interação com browser ou UI (clicks, forms, dashboard config, navegação, screenshots, upload, download, preencher campos):

1. **NUNCA** mande usuário fazer manualmente sem antes oferecer Chrome Brain
2. **Formato obrigatório de oferta**:

   > "Posso fazer isso via Chrome Brain (browser automation — automático) ou você prefere fazer manualmente?"

3. **Default**: se usuário não responder explicitamente "manualmente", assuma Chrome Brain e execute
4. **Exceção**: tarefas destrutivas em produção → sempre confirmar antes de executar, independente de browser

**Anti-pattern proibido:**
- "Você precisa abrir o dashboard e clicar em X"
- "Siga esses passos manualmente: 1... 2... 3..."
- "Infelizmente não consigo acessar a interface, então você precisa..."

**Padrão correto:**
- "Abre Chrome Brain ou quer fazer você?"
- "Vou executar via Chrome Brain agora."
- "Essa config no dashboard Supabase — Chrome Brain ou manual?"

## Anti-Patterns (FORBIDDEN)

- Saying "I can't do this" without trying alternatives
- Stopping at the first error
- Assuming something is impossible without researching
- Asking the user to do something the agent can automate
- Giving up without documenting what was tried
- Asking user to do manual UI work without first offering Chrome Brain (see Browser Protocol above)

## Exceptions

- Destructive actions affecting user data → ask confirmation first
- Actions involving payment/purchase → ask confirmation first
- Actions violating laws or terms of service → inform and stop

## Applies To

Every agent: @developer, @quality-gate, @architect, @sinapse-orqx, all squad orqx agents, and all specialist agents within squads. No exceptions.
