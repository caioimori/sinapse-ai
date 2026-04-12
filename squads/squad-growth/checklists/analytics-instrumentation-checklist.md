# Checklist: Analytics Instrumentation

## Pre-Launch Validation

### 1. Event Taxonomy
- [ ] Event naming follows snake_case convention
- [ ] All events follow object_action pattern
- [ ] No PII in event names or parameters
- [ ] Event parameters documented in data dictionary
- [ ] Custom dimensions registered in GA4
- [ ] Custom metrics registered in GA4

### 2. GA4 Configuration
- [ ] Property created with correct settings
- [ ] Data stream configured (web/app)
- [ ] Enhanced measurement enabled (relevant events)
- [ ] Data retention set to 14 months
- [ ] Google Signals enabled
- [ ] BigQuery export enabled
- [ ] User ID implementation verified
- [ ] Conversion events marked
- [ ] Attribution set to data-driven
- [ ] Cross-domain tracking configured (if multi-domain)

### 3. GTM Setup
- [ ] Container published and loading on all pages
- [ ] Tags organized in folders by platform
- [ ] Naming convention followed (tags, triggers, variables)
- [ ] All tags have appropriate triggers
- [ ] Consent Mode v2 integrated with CMP
- [ ] Version control (workspace naming, version notes)
- [ ] Environments configured (dev, staging, prod)

### 4. Data Layer
- [ ] Data layer initialized before GTM loads
- [ ] Page context pushed on every page
- [ ] User context pushed when available
- [ ] E-commerce events follow GA4 standard schema
- [ ] No PII in data layer
- [ ] `ecommerce: null` cleared before each e-commerce push
- [ ] All required parameters present per event

### 5. Consent & Privacy
- [ ] CMP banner implemented and functional
- [ ] Consent Mode v2 default state configured (denied)
- [ ] Consent update triggers tag firing correctly
- [ ] Tags respect consent state (no firing before consent)
- [ ] Privacy policy updated with analytics disclosure
- [ ] Data retention limits configured
- [ ] Data deletion process documented

### 6. Server-Side (if applicable)
- [ ] Server container deployed and healthy
- [ ] Client-side → server-side forwarding working
- [ ] PII filtering active on server
- [ ] Meta CAPI configured with deduplication
- [ ] Google Ads enhanced conversions active
- [ ] First-party domain for server container

### 7. QA Verification
- [ ] GTM Preview mode tested on all page types
- [ ] GA4 DebugView confirms all events
- [ ] Tag Assistant shows no errors
- [ ] All conversion events verified
- [ ] Cross-device tracking validated (User ID)
- [ ] Cross-domain tracking validated (if applicable)
- [ ] Mobile and desktop tested separately
- [ ] Data layer values match expected on each page type
- [ ] No duplicate events firing
- [ ] Event parameter values are correct data types

### 8. Post-Launch Monitoring
- [ ] Real-time reports show data flowing
- [ ] No (not set) values in key dimensions
- [ ] Conversion counts match backend (< 5% delta)
- [ ] Session/user counts are reasonable
- [ ] No unexpected spikes or drops
- [ ] BigQuery export populating daily tables
- [ ] Alerts configured for anomalies

## Sign-Off
| Role | Name | Date | Status |
|------|------|------|--------|
| Analytics Engineer | | | Approved / Issues |
| QA | | | Verified / Issues |
| Privacy/Legal | | | Compliant / Issues |
