---
name: captcha-handler
description: Handle CAPTCHAs encountered during browser automation
trigger: When Chrome Brain or Playwright hits a CAPTCHA challenge
agents: [developer, analyst]
---

# CAPTCHA Handler Skill

## Usage

Invoke with `*captcha-handler` or `/captcha-handler` when browser automation is blocked by a CAPTCHA.

## Detection

Identify the CAPTCHA type from the page:

| Type | Detection Signal |
|------|-----------------|
| reCAPTCHA v2 | `iframe[src*="recaptcha"]`, `.g-recaptcha` |
| reCAPTCHA v3 | `grecaptcha.execute` in page scripts |
| Cloudflare Turnstile | `iframe[src*="challenges.cloudflare.com"]`, `.cf-turnstile` |
| hCaptcha | `iframe[src*="hcaptcha.com"]`, `.h-captcha` |

```bash
# Quick detection via page source
grep -i "recaptcha\|turnstile\|hcaptcha\|captcha" /tmp/page-source.html
```

## Strategies (ordered by preference)

### Strategy 1: Avoidance (PREFERRED)
Prevent CAPTCHA from triggering in the first place:
- Use `puppeteer-extra-plugin-stealth` for headless sessions
- Rotate User-Agent strings to match real browsers
- Add realistic delays between actions (500-2000ms)
- Avoid rapid-fire requests to the same domain
- Set viewport to common resolution (1920x1080)
- Enable JavaScript and cookies

### Strategy 2: Manual Solve (FALLBACK)
When avoidance fails, notify user to solve manually:
1. Take screenshot of the CAPTCHA page
2. Display: "CAPTCHA detected ({type}). Please solve it in the browser window."
3. Wait for page navigation or CAPTCHA element removal (poll every 2s, timeout 120s)
4. Resume automation after solve confirmed

### Strategy 3: API Solve (OPTIONAL)
If `CAPTCHA_API_KEY` environment variable is set (2captcha.com):
1. Extract sitekey from CAPTCHA element
2. Submit to 2captcha API with page URL and sitekey
3. Poll for solution (max 60s)
4. Inject solution token into page
5. Submit form

```bash
# Check if API is configured
echo $CAPTCHA_API_KEY | head -c 4
```

**Only use Strategy 3 when:**
- User has explicitly configured the API key
- Strategy 1 and 2 are impractical (batch automation)
- User consents to per-solve costs

## Output

```
## CAPTCHA Handler Report
- Type: {captcha_type}
- Strategy Used: {avoidance|manual|api}
- Result: {SOLVED|TIMEOUT|FAILED}
- Time: {seconds}s
- Recommendation: {next steps if failed}
```

## Rules
- ALWAYS prefer avoidance over solving
- NEVER store or log CAPTCHA API keys
- Timeout after 120s for manual solve, 60s for API solve
- If all strategies fail, document the blocker and suggest alternative approach (API instead of scraping)
- Respect website ToS — CAPTCHAs exist for a reason
