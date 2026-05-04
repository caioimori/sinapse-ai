# Checklist: Experiment Launch

## Pre-Launch

### 1. Hypothesis Quality
- [ ] Hypothesis follows template: If [change], then [metric] will [direction] by [magnitude], because [reason]
- [ ] Based on data/research (not opinion)
- [ ] ICE/RICE score calculated
- [ ] Primary metric defined (one metric)
- [ ] Secondary metrics defined (2-3 max)
- [ ] Guard-rail metrics defined (metrics that must NOT decrease)
- [ ] Stakeholders aligned on hypothesis

### 2. Statistical Design
- [ ] Baseline conversion rate documented
- [ ] Minimum Detectable Effect (MDE) defined (typically 10-20% relative)
- [ ] Sample size calculated per variant
- [ ] Expected test duration calculated
- [ ] Statistical significance threshold set (p < 0.05)
- [ ] Statistical power set (>= 80%)
- [ ] One-tailed or two-tailed test decided
- [ ] Multiple testing correction applied (if A/B/n)

### 3. Technical Implementation
- [ ] Variant built and matches design spec
- [ ] Randomization implemented correctly (user-level, not session)
- [ ] Traffic split configured (typically 50/50)
- [ ] No flickering/flash of original content (anti-flicker)
- [ ] Tracking events fire correctly on both variants
- [ ] Revenue/value tracking accurate on both variants
- [ ] Server-side vs client-side decision made

### 4. QA Testing
- [ ] Control variant matches current production exactly
- [ ] Treatment variant renders correctly on desktop
- [ ] Treatment variant renders correctly on mobile
- [ ] Treatment variant renders correctly on tablet
- [ ] Tested on Chrome, Safari, Firefox (min)
- [ ] No JavaScript errors in console
- [ ] No layout shifts or visual bugs
- [ ] Links and CTAs functional on variant
- [ ] Forms submit correctly on variant
- [ ] Page speed not degraded (< 100ms overhead)
- [ ] Analytics events verified in debug mode

### 5. Targeting & Segmentation
- [ ] Target audience defined (all users or segment)
- [ ] Exclusions set (internal IPs, bots, employees)
- [ ] Geographic targeting correct (if applicable)
- [ ] Device targeting correct (if applicable)
- [ ] New vs returning user targeting (if applicable)
- [ ] URL targeting correct (specific pages only)

## Launch

### 6. Go/No-Go
- [ ] QA sign-off received
- [ ] Stakeholder notification sent
- [ ] Experiment documentation complete
- [ ] Monitoring alerts configured
- [ ] Rollback plan defined
- [ ] Launch date/time chosen (avoid anomalous periods)
- [ ] No conflicting experiments running on same pages

### 7. Launch Execution
- [ ] Experiment activated in testing tool
- [ ] Real-time data flowing for both variants
- [ ] Traffic split verified (check within first hour)
- [ ] No error spikes post-launch
- [ ] Revenue tracking verified (if e-commerce)

## During Experiment

### 8. Monitoring
- [ ] Daily health check (no data anomalies)
- [ ] Sample Ratio Mismatch (SRM) check after 24h
- [ ] No external factors contaminating results
- [ ] Guard-rail metrics stable
- [ ] DO NOT peek at significance before planned duration
- [ ] Document any unexpected events (outages, promotions)

### 9. SRM Detection
```
Expected: 50/50 split
Actual: Check chi-squared test
If p < 0.01 for split ratio → SRM detected → STOP and investigate
Common causes: bot filtering, redirects, caching
```

## Post-Experiment

### 10. Analysis
- [ ] Minimum duration reached
- [ ] Minimum sample size reached per variant
- [ ] Statistical significance calculated
- [ ] Confidence interval reported
- [ ] Segment analysis completed (device, source, new/returning)
- [ ] Revenue impact calculated
- [ ] Guard-rail metrics verified (no degradation)
- [ ] Check for novelty effect (compare week 1 vs week 2+)

### 11. Decision
- [ ] Winner declared (or no winner)
- [ ] Decision documented with rationale
- [ ] If winner: implementation plan created
- [ ] If no winner: learnings documented, next hypothesis generated
- [ ] Results shared with stakeholders

### 12. Documentation
- [ ] Experiment logged in knowledge base
- [ ] Screenshots of variants saved
- [ ] Statistical results recorded
- [ ] Learnings and insights documented
- [ ] Next experiment hypothesis derived
- [ ] Experiment ID archived for reference

## Sign-Off
| Role | Name | Status |
|------|------|--------|
| CRO Specialist | | Approved / Rejected |
| Developer | | QA Passed / Failed |
| Stakeholder | | Aligned / Concerns |
