# Experimentation Boundaries — Cross-Squad Ownership

## Ownership Matrix
| Experiment Type | Owner Squad | Collaborators |
|----------------|-------------|---------------|
| SEO tests (title tags, meta, content) | squad-growth | squad-content |
| Organic growth loops (viral, referral) | squad-growth | squad-product |
| Analytics instrumentation tests | squad-growth | squad-design |
| Ad creative tests | squad-paidmedia | squad-copy |
| Audience/targeting tests | squad-paidmedia | squad-growth |
| Bid strategy tests | squad-paidmedia | — |
| CRO tests (paid traffic pages) | squad-paidmedia | squad-design |
| UX experiments | squad-design | squad-growth |
| Copy A/B tests | squad-copy | squad-growth |
| Product feature experiments | squad-product | squad-growth |
| Pricing experiments | squad-finance | squad-commercial |

## Cross-Squad Coordination Protocol
1. Requesting squad opens experiment brief with hypothesis, metrics, sample size
2. Owning squad reviews and approves methodology
3. Both squads agree on success metrics and minimum sample size
4. Owning squad executes the test
5. Results shared in cross-squad sync

## Statistical Requirements
- Minimum sample size: calculated per test (use Evan Miller calculator or statsig)
- Significance level: p < 0.05 (95% confidence)
- Minimum detectable effect: define before test starts
- Test duration: minimum 2 full business cycles
- No peeking: do not stop tests early based on preliminary results
- Sequential testing: use if early stopping is business-critical (alpha spending)
