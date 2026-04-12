# Squad Preferences

## Purpose
This directory stores user-configurable preferences for squad-product behavior.

## Default Preferences

### Sprint Configuration
- Default sprint duration: 2 weeks
- Default capacity buffer: 10%
- Default tech debt allocation: 15%
- Default discovery allocation: 10%

### Metrics Configuration
- Health score update frequency: Weekly
- NPS survey frequency: Quarterly
- Retention cohort period: Monthly
- Default confidence threshold: 95% (for experiments)

### Communication
- Client sync frequency: Weekly
- Metrics report frequency: Monthly
- QBR frequency: Quarterly
- Standup format: Async (Slack) or Sync (15 min)

### Quality Gates
- Discovery readiness: All 12 items required
- Launch readiness: All sections must pass
- Handoff readiness: Score >= 3.5/5
- Sprint confidence: >= 3.5/5

### Tool Defaults
- Project management: Linear (configurable)
- Analytics: Amplitude (configurable)
- Documentation: Notion (configurable)
- Design: Figma

## Customization
To override defaults, create a `preferences.yaml` file in this directory with your custom values.
