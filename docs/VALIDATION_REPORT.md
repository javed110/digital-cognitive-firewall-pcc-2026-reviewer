# Engineering validation

The executable has 28 passing synthetic regression checks: 24 documented message cases and four rejected-input cases. See [machine-readable results](../evidence/regression-results.json) and [case definitions](../tests/cases.json). Run `node tests/run.mjs` with Node.js 20 or later.

These tests cover rule outcomes, benign urgency, negated/quoted secret language, Urdu and Roman Urdu examples, semantic evasion, URL userinfo/suffix tricks, subdomain boundaries, trailing dots, IP and internationalized hosts, plain HTTP, sender mismatch, untrusted instructions, malformed URLs, Unicode normalization and input limits. They test the published rule policy against author-defined expectations. They are not a blinded detection benchmark.

P06 and P21 deliberately show false alarms for benign advice/quoted training content. P22 and P23 show content the rules cannot resolve. A 'No listed cues found' result explicitly gives no safety assurance. No percentage risk score, measured precision/recall/F1, calibrated confidence or behavioural benefit is claimed.

Browser checks and a recording demonstrate the delivered interface using synthetic cases. The [recording manifest](../Demo/recording_manifest.json) identifies captured scenes and media checks. Static review confirms text-only rendering and no network lookup path in the application. Runtime/browser checks remain bounded engineering observations, not an independent security assessment or production certification.

## Acceptance boundaries

The original F1 >= 0.90 and false-positive rate <= 5% figures remain unvalidated research targets. Neither the regression pass fraction nor a manually set slider can establish either metric. There is no trained model, live inbox integration, behavioural sensor, critical-system integration or human-subject evaluation. A public repository and video deliver reviewer materials but do not constitute an online deployed security service.
