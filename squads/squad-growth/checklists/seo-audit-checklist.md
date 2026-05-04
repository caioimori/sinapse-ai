# Checklist: SEO Audit

## Technical SEO

### Crawlability
- [ ] robots.txt allows important pages, blocks admin/internal
- [ ] XML sitemap exists and is submitted to Search Console
- [ ] Sitemap contains only indexable pages (200 status)
- [ ] No orphan pages (all pages linked internally)
- [ ] Crawl depth <= 3 clicks from homepage
- [ ] No redirect chains (max 1 redirect hop)
- [ ] No redirect loops detected
- [ ] No broken internal links (404s)

### Indexation
- [ ] Index coverage report clean (Search Console)
- [ ] No unintended noindex tags
- [ ] Canonical tags present and self-referencing
- [ ] No duplicate content issues
- [ ] Thin content pages identified and addressed
- [ ] Pagination handled correctly
- [ ] Hreflang implemented (if multi-language)

### Performance
- [ ] LCP < 2.5s (mobile)
- [ ] INP < 200ms (mobile)
- [ ] CLS < 0.1 (mobile)
- [ ] HTTPS enabled across all pages
- [ ] Mobile-friendly (responsive design)
- [ ] No mixed content warnings
- [ ] Images optimized (WebP/AVIF, lazy loaded)
- [ ] Critical CSS inlined
- [ ] JavaScript not render-blocking

## On-Page SEO

### Title Tags
- [ ] Unique title on every page
- [ ] Primary keyword in title
- [ ] Length 50-60 characters
- [ ] No duplicate titles
- [ ] Brand name included (where appropriate)

### Meta Descriptions
- [ ] Unique meta description on every page
- [ ] Length 150-160 characters
- [ ] Includes primary keyword
- [ ] Contains call-to-action
- [ ] No duplicate descriptions

### Headings
- [ ] One H1 per page with primary keyword
- [ ] Heading hierarchy logical (H1 > H2 > H3)
- [ ] No skipped heading levels
- [ ] Secondary keywords in H2s

### Content
- [ ] Target keyword present in first 100 words
- [ ] Content length adequate for topic (min 300 words)
- [ ] Internal links to related content (3-5 per page)
- [ ] External links to authoritative sources
- [ ] Images have descriptive alt text
- [ ] Content satisfies search intent

### URLs
- [ ] Short, descriptive URLs
- [ ] Includes primary keyword
- [ ] Lowercase, hyphen-separated
- [ ] No special characters or parameters
- [ ] Consistent URL structure

## Structured Data
- [ ] Schema.org markup implemented (JSON-LD)
- [ ] Validated with Rich Results Test
- [ ] Organization schema on homepage
- [ ] BreadcrumbList on all pages
- [ ] Article schema on blog posts
- [ ] Product schema on product pages (if e-commerce)
- [ ] FAQ schema where applicable
- [ ] No errors in Search Console enhancement reports

## Off-Page SEO
- [ ] Backlink profile analyzed
- [ ] Toxic links identified and disavowed
- [ ] Competitor backlink gaps identified
- [ ] Link building strategy defined
- [ ] Google Business Profile optimized (if local)
- [ ] NAP consistency across directories (if local)

## Search Console
- [ ] Property verified (domain-level)
- [ ] Sitemap submitted and processed
- [ ] GA4 linked
- [ ] No manual actions
- [ ] No security issues
- [ ] Index coverage monitored
- [ ] Core Web Vitals report reviewed
- [ ] Mobile usability report clean

## Monitoring Setup
- [ ] Keyword tracking configured
- [ ] Rank tracking for target keywords
- [ ] Alerts for index coverage drops
- [ ] Alerts for CWV issues
- [ ] Monthly SEO performance review scheduled

## Audit Summary
| Area | Score | Issues | Priority |
|------|-------|--------|----------|
| Technical | /10 | | |
| On-Page | /10 | | |
| Content | /10 | | |
| Structured Data | /10 | | |
| Off-Page | /10 | | |
| **Overall** | **/50** | | |
