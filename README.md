# TasteSpec AI — Autonomous Cultural-to-Constraint Execution Engine

Built for the **Qloo Agentic Hackathon ("Agents, but with taste")**.

**TasteSpec AI** fuses **Qloo's Cross-Domain Taste Graph (`/search` and `/v2/insights`)** with a **Deterministic Constraint Critic** in a 4-stage self-correcting loop. Instead of producing generic LLM clichés or raw recommendation lists that ignore real-world rules, TasteSpec AI turns cultural taste into verified commercial, architectural, and clinical specifications.

## 4-Agent Closed-Loop Architecture
1. **Agent 1 (Seed Resolver):** Resolves unstructured cultural inputs into canonical Qloo Entity URNs via `GET /search`.
2. **Agent 2 (Cross-Domain Graph Explorer):** Queries `GET /v2/insights` across Music, Dining, Brands, Film/TV, and Locality heatmaps.
3. **Agent 3 (Deterministic Constraint Critic):** Audits every candidate against hard physical, medical, or ROI rules. When an entity violates a constraint (e.g., high Vitamin K for a Warfarin patient or >1.2 mile catering radius), the Critic rejects it and re-queries Qloo with `signal.dislikes.entities`.
4. **Agent 4 (Executable Spec Synthesizer & MCP Server):** Produces ready-to-send B2B sponsorship outreach emails, photometric lighting schedules, and IDDSI Level 5 clinical care plans.

## Running Locally
```bash
npm install
npm run dev
```

## License
Distributed under the **MIT License**. See `LICENSE` for full details.
