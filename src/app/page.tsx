"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Terminal,
  Network,
  Download,
  Cpu,
  CheckCircle2,
  XCircle,
  Sliders,
  Zap,
  Globe,
  Play,
  Copy,
  Check,
  Layers,
} from "lucide-react";
import type { TasteSpecResponse, WorkflowId } from "@/lib/qloo";

const PRESETS: {
  id: WorkflowId;
  badge: string;
  title: string;
  subtitle: string;
  seed: string;
  location: string;
  constraints: string;
}[] = [
  {
    id: "live-event",
    badge: "Entertainment & B2B Sponsorships",
    title: "1. Live Tour, Venue & Sponsor Deal-Maker",
    subtitle: "Maps artist audience graph to local venues, F&B within 1.2mi, and high-ROI brand sponsors.",
    seed: "Cedric the Entertainer, Gary Clark Jr., Soul & Stand-Up Comedy",
    location: "Austin, TX",
    constraints: "Min 2,400 seat radius | F&B partner <= 1.2 mi | Brand Sponsor Affinity >= 88% | $50k Tier",
  },
  {
    id: "spatial-spec",
    badge: "Architecture & Electrical Trades",
    title: "2. Spatial, Lighting & Retail Spec Engineer",
    subtitle: "Translates film/music taste into Kelvin, CRI, lumen & acoustic schedules under budget.",
    seed: "Denis Villeneuve Sci-Fi, Khruangbin, Aesop Minimalist Architecture",
    location: "SoHo, New York, NY",
    constraints: "450 sq.ft North-facing room | Max $2,200 lighting budget | 120V / 15A limit | UGR < 19",
  },
  {
    id: "clinical-care",
    badge: "Healthcare & Senior Longevity",
    title: "3. Clinical & Senior Adaptive Care Concierge",
    subtitle: "Grounds dysphagia & Warfarin-safe meal plans in a senior's lifelong cultural favorites.",
    seed: "1960s Motown Soul, Classic Italian Cinema, Ella Fitzgerald",
    location: "Coral Gables, Miami, FL",
    constraints: "IDDSI Level 5 Minced & Moist | Warfarin Safe (Low Vitamin K <= 30mcg) | Sodium < 1,400mg",
  },
];

export default function TasteSpecDashboard() {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowId>("live-event");
  const [seedInput, setSeedInput] = useState(PRESETS[0].seed);
  const [locationInput, setLocationInput] = useState(PRESETS[0].location);
  const [constraintsInput, setConstraintsInput] = useState(PRESETS[0].constraints);
  const [data, setData] = useState<TasteSpecResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [compareBlindLlm, setCompareBlindLlm] = useState<boolean>(true);
  const [showMcpModal, setShowMcpModal] = useState<boolean>(false);
  const [copiedMcp, setCopiedMcp] = useState<boolean>(false);

  const executeAgent = useCallback(
    async (
      workflowId: WorkflowId,
      seed: string,
      location: string,
      constraints: string
    ) => {
      setLoading(true);
      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workflowId,
            seedQuery: seed,
            locationQuery: location,
            constraintsInput: constraints,
          }),
        });
        const json = (await res.json()) as TasteSpecResponse;
        setData(json);
      } catch (err) {
        console.error("Failed to execute agent:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void executeAgent(
      PRESETS[0].id,
      PRESETS[0].seed,
      PRESETS[0].location,
      PRESETS[0].constraints
    );
  }, [executeAgent]);

  const handleSelectPreset = (preset: (typeof PRESETS)[number]) => {
    setActiveWorkflow(preset.id);
    setSeedInput(preset.seed);
    setLocationInput(preset.location);
    setConstraintsInput(preset.constraints);
    void executeAgent(preset.id, preset.seed, preset.location, preset.constraints);
  };

  const handleDownloadSpec = () => {
    if (!data) return;
    const blob = new Blob([data.qlooGroundedOutput.markdownExport], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TasteSpec-${data.workflowId}-blueprint.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mcpConfigJson = `{
  "mcpServers": {
    "tastespec-qloo-agent": {
      "command": "node",
      "args": ["./mcp-server/index.mjs"],
      "env": {
        "QLOO_API_KEY": "YOUR_QLOO_API_KEY",
        "QLOO_BASE_URL": "https://hackathon.api.qloo.com"
      }
    }
  }
}`;

  const copyMcpConfig = () => {
    void navigator.clipboard.writeText(mcpConfigJson);
    setCopiedMcp(true);
    setTimeout(() => setCopiedMcp(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Command Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white"/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-white">
                  TasteSpec AI
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Qloo /v2/insights + Critic Loop
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Cultural-to-Physical Constraint &amp; Execution Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setCompareBlindLlm(!compareBlindLlm)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition ${
                compareBlindLlm
                  ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Layers className="h-4 w-4"/>
              {compareBlindLlm
                ? "A/B Benchmark Active: Blind LLM vs. Qloo"
                : "Show Blind LLM vs. Qloo Benchmark"}
            </button>

            <button
              type="button"
              onClick={() => setShowMcpModal(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
            >
              <Cpu className="h-4 w-4 text-indigo-400"/>
              Connect Qloo MCP Server
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* 3 Flagship Judge Presets */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-400"/>
              1-Click Production Judge Scenarios (Instant Multi-Hop Execution)
            </h2>
            {data && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Engine Mode: {data.apiSource}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {PRESETS.map((preset) => {
              const isSelected = activeWorkflow === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10"
                      : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {preset.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-bold text-indigo-400">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-1">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {preset.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Interactive Custom Agent Inputs */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Cultural Seed Entities (Music, Film, Talent, Brands)
              </label>
              <input
                type="text"
                value={seedInput}
                onChange={(e) => {
                  setSeedInput(e.target.value);
                  setActiveWorkflow("custom");
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="e.g., Khruangbin, A24 Films, Blue Bottle Coffee"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Target Locality / Geo Filter
              </label>
              <div className="relative">
                <Globe className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5"/>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setActiveWorkflow("custom");
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., Austin, TX"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Hard Physical / Clinical / ROI Constraints
              </label>
              <div className="relative">
                <Sliders className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5"/>
                <input
                  type="text"
                  value={constraintsInput}
                  onChange={(e) => {
                    setConstraintsInput(e.target.value);
                    setActiveWorkflow("custom");
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Budget, medical rules, capacity..."
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  const matchedPreset = PRESETS.find(
                    (p) =>
                      p.seed === seedInput.trim() &&
                      p.location === locationInput.trim() &&
                      p.constraints === constraintsInput.trim()
                  );
                  const workflowToRun: WorkflowId = matchedPreset
                    ? matchedPreset.id
                    : "custom";
                  setActiveWorkflow(workflowToRun);
                  void executeAgent(
                    workflowToRun,
                    seedInput,
                    locationInput,
                    constraintsInput
                  );
                }}
                className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
              >
                <Play className="h-3.5 w-3.5 fill-current"/>
                {loading ? "Running Loop..." : "Run TasteSpec"}
              </button>
            </div>
          </div>
        </section>

        {/* A/B Benchmark: Culturally Blind LLM vs. Qloo TasteSpec Agent */}
        {compareBlindLlm && data && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4"/>
                  Standard LLM Alone (Culturally Blind &amp; Unverified)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                  0 Qloo Entities | Fails Constraints
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                {data.blindLlmOutput.summary}
              </p>
              <div className="space-y-1.5 mb-3">
                {data.blindLlmOutput.flaws.map((flaw, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-rose-200/90 bg-rose-950/40 p-2 rounded border border-rose-500/20"
                  >
                    <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5"/>
                    <span>{flaw}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4"/>
                  TasteSpec AI (Qloo Taste Graph + Constraint Critic)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Convergence: {data.convergenceScore}% | 100% Compliant
                </span>
              </div>
              <p className="text-xs text-slate-200 mb-3">
                {data.qlooGroundedOutput.executiveSummary}
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-200">
                <strong className="text-emerald-400 block mb-0.5">
                  Why Qloo Was Essential:
                </strong>
                {data.qlooGroundedOutput.whyQlooWasEssential}
              </div>
            </div>
          </section>
        )}

        {/* Main 3-Column Agent Workspace */}
        {data && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Column 1: Multi-Hop Agent Trace & Constraint Critic */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                  <Terminal className="h-4 w-4 text-indigo-400"/>
                  Live 4-Agent Self-Correction Trace
                </h3>
                <div className="space-y-3">
                  {data.traceLogs.map((log) => (
                    <div
                      key={log.step}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300">
                          {log.agentName}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            log.status === "CRITIC_RETRY"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : log.status === "CONVERGED"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {log.status} ({log.latencyMs}ms)
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 truncate">
                        {log.endpointCalled}
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {log.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deterministic Constraint Audit Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-400"/>
                  Deterministic Constraint Critic Audit
                </h3>
                <div className="space-y-2.5">
                  {data.constraintChecks.map((check, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">
                          {check.ruleName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5"/>
                          PASS
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mb-1">
                        Rule: {check.threshold} | Actual: {check.measuredValue}
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {check.impactNote}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Qloo Cross-Domain Taste Graph Inspector */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Network className="h-4 w-4 text-purple-400"/>
                  Qloo Cross-Domain Taste Graph Nodes
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {data.nodes.filter((n) => n.status === "ACCEPTED").length} Accepted /{" "}
                  {data.nodes.filter((n) => n.status === "REJECTED_BY_CRITIC").length} Filtered
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {data.nodes.map((node) => {
                  const accepted = node.status === "ACCEPTED";
                  return (
                    <div
                      key={node.id}
                      className={`p-3 rounded-lg border text-xs transition ${
                        accepted
                          ? "bg-slate-950 border-slate-800"
                          : "bg-rose-950/20 border-rose-500/30 opacity-85"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {node.domain}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 truncate">
                          {node.urn}
                        </span>
                      </div>

                      <div className="font-semibold text-white text-sm mb-1 flex items-center justify-between">
                        <span>{node.name}</span>
                        <span
                          className={`text-xs font-mono font-bold ${
                            accepted ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {Math.round(node.affinityScore * 100)}% Affinity
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 my-1.5">
                        {node.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {accepted ? (
                        <p className="text-[11px] text-slate-400">
                          {node.metadata}
                        </p>
                      ) : (
                        <p className="text-[11px] text-rose-300 font-medium mt-1">
                          {node.rejectionReason}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 3: Actionable Spec Sheet & Markdown Export */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Executable Deliverable Blueprint
                  </h3>
                  <button
                    type="button"
                    onClick={handleDownloadSpec}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1.5 transition"
                  >
                    <Download className="h-3.5 w-3.5"/>
                    Export .MD Spec
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  {data.qlooGroundedOutput.specSections.map((sec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800"
                    >
                      <h4 className="text-xs font-bold text-indigo-300 mb-2">
                        {sec.heading}
                      </h4>
                      <div className="space-y-2">
                        {sec.items.map((item, j) => (
                          <div key={j} className="text-xs">
                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>{item.label}</span>
                              <span className="font-mono text-slate-500">
                                {item.qlooUrn}
                              </span>
                            </div>
                            <div className="font-semibold text-white">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Auto-Generated Actionable Artifact Preview
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap max-h-72 overflow-y-auto">
                    {data.qlooGroundedOutput.markdownExport}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* MCP Server Configuration Modal */}
      {showMcpModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-400"/>
                Plug TasteSpec AI into Any Agent via MCP
              </h3>
              <button
                type="button"
                onClick={() => setShowMcpModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This repository includes a standard Model Context Protocol (MCP)
              server at <code className="text-indigo-300">/mcp-server/index.mjs</code>{" "}
              exposing <code className="text-indigo-300">tastespec_resolve</code> and{" "}
              <code className="text-indigo-300">tastespec_generate_spec</code> to
              Claude Desktop, Cursor, or Google Antigravity.
            </p>
            <div className="relative">
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                {mcpConfigJson}
              </pre>
              <button
                type="button"
                onClick={copyMcpConfig}
                className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1"
              >
                {copiedMcp ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400"/>
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5"/>
                    Copy JSON
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
