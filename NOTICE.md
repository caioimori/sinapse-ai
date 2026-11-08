# Third-Party Notices

SINAPSE AI includes or derives portions of software originally distributed
under the MIT License. The following notices are preserved for attribution:

```text
Copyright (c) 2025 BMad Code, LLC (BMad Method - original work)
Copyright (c) 2025 Synkra AIOX Inc. (AIOX Framework - intermediate work)
Copyright (c) 2025 SinapseAI Inc. (SINAPSE Framework - derivative work)
```

SINAPSE AI is an independent project and is not affiliated with, endorsed by,
or sponsored by the copyright holders or projects listed above.

## Trademarks

BMad, BMad Method, and BMad Core are trademarks of BMad Code, LLC. Those marks
are not licensed by the MIT License. See the upstream
[trademark policy](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/TRADEMARK.md)
for its usage guidelines.

SINAPSE and SINAPSE AI names and visual identity identify this independent
project. The MIT License grants rights to the software, not to third-party or
project trademarks.

## Engineering workflows extension (2026-11-08)

The implementation in `packages/engineering-workflows` is original SINAPSE code.
Its design was informed by the following primary references, without importing
their executors, agent identities or authority policies:

- AIOX Core, revision `4ef6530ff03b83aea953e4a426f95e012b8b70c5`:
  [task contracts](https://github.com/SynkraAI/aiox-core/blob/4ef6530ff03b83aea953e4a426f95e012b8b70c5/.aiox-core/docs/standards/TASK-FORMAT-SPECIFICATION-V1.md)
  and [workflow state](https://github.com/SynkraAI/aiox-core/blob/4ef6530ff03b83aea953e4a426f95e012b8b70c5/.aiox-core/data/workflow-state-schema.yaml).
- BMad Method, revision `a867e1604b365d48ea03cbd109da1066ba0c84bc`:
  [proportional planning](https://docs.bmad-method.org/plan/choose-a-planning-path/),
  [building changes](https://docs.bmad-method.org/build/build-a-change/),
  [review](https://docs.bmad-method.org/build/review-a-change/) and
  [bounded loops](https://docs.bmad-method.org/build/autonomous-development-loops/).

The separately identified engineering knowledge data is attributed to Caio
Imori, *Engenharia de Software — Base de Conhecimento*, published at
<https://mapa-engenharia-software.vercel.app/>. The source index declares
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
Imported material and its catalog adaptations retain that license; the MIT
license of the runtime does not relicense the knowledge data. Source revision,
URLs, transformations and integrity hashes accompany the data manifest.

## Simulated personas

Some optional agents simulate perspectives inspired by public authors,
investors, designers, advisors, and storytellers for educational and research
purposes. Each such file carries a notice stating that:

- the persona is a simulation, not the real person;
- no affiliation, endorsement, sponsorship, agency, or representation exists;
- generated output must not be attributed to the real person;
- public material is synthesized through language-model inference;
- use is at the user's discretion.

A represented person, estate, or authorized representative may request removal
or renaming through a GitHub issue titled `Persona Simulation Removal Request`.
Requests made in good faith will be reviewed promptly.
