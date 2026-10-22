# Digital Cognitive Firewall

PCC 2026 concept and reproducible message-review demonstrator. The proposed AI and behavioural system remains a concept. The executable adjunct uses transparent rules and gives categorical observations without a phishing probability or safety verdict.

NUMS: Lubna Khalid, Javeria Naseer and Arooba Jamil. NUST: Maheen Athar. Role assignments, qualifications and mentor details need confirmation.

## Reviewer materials

- [Recorded working demonstration](Demo/cognitive-firewall-walkthrough.mp4)
- [Refined editable pitch deck](Presentation/Digital_Cognitive_Firewall_Refined.pptx)
- [Filled PCC concept-note template](docs/Digital_Cognitive_Firewall_PCC26_Concept_Note.docx)
- [Source extraction and reconciliation](docs/SOURCE_REVIEW.md)
- [Architecture](docs/ARCHITECTURE.md), [engineering validation](docs/VALIDATION_REPORT.md) and [research register](docs/RESEARCH_REGISTER.md)
- [Template link directory](docs/TEMPLATE_LINKS.md) and [applicant confirmation list](docs/APPLICATION_PENDING.md)

The reviewer copy excludes national IDs, private contacts, account data, saved chat HTML and source authorization documents. No application, email, live deployment, institutional endorsement, licence or patent is asserted.

## Run locally

Download the repository ZIP using Code > Download ZIP, extract it, and run `python serve.py --port 8798` with Python 3.10 or later. Open `http://127.0.0.1:8798/` on the same computer. On Windows with Python installed, `Run-Demo.cmd` provides the same command. No third-party Python packages are required. Internet access is unnecessary after download. Use synthetic examples first. The loopback address is a setup instruction, not a public reviewer endpoint.

Choose a sample and click **Review message**, then open the verification checklist. The legitimate-urgency example deliberately demonstrates that simple rules can over-warn. The original text remains visible. Changing an input clears stale results. The prototype never opens message URLs and does not connect to an inbox or measure emotion. The optional JSON download contains excerpts and stays on the user's computer.

## Reproduce checks

With Node.js 20 or later, run `node tests/run.mjs`. This executes 28 author-defined synthetic cases, not a detection accuracy or human-benefit study. Python only serves the UI and is not required to execute the analyzer tests. No package installation or API key is needed.

## Research boundaries

Explainable warnings and human phishing cues already have published precedents. Candidate differentiation requires comparison and prospective evaluation. The source's F1 >= 0.90, false-positive rate <= 5% and PKR 6.5 million figures are targets/proposals requiring validation and applicant confirmation. The missing original artifact source is not represented as recovered. See the source register for exactly what was available.
