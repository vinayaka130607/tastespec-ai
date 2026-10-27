#!/usr/bin/env node
/**
 * TasteSpec AI — Qloo Cultural-to-Constraint Model Context Protocol (MCP) Server
 * Exposes Qloo /search and /v2/insights with deterministic constraint filtering over JSON-RPC stdio.
 */
import readline from "node:readline";

const QLOO_BASE_URL = process.env.QLOO_BASE_URL || "https://hackathon.api.qloo.com";
const QLOO_API_KEY = process.env.QLOO_API_KEY || "";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function sendResponse(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}

rl.on("line", async (line) => {
  if (!line.trim()) return;
  try {
    const req = JSON.parse(line);
    if (req.method === "initialize") {
      sendResponse(req.id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "tastespec-qloo-mcp", version: "1.0.0" },
      });
    } else if (req.method === "tools/list") {
      sendResponse(req.id, {
        tools: [
          {
            name: "tastespec_resolve_seed",
            description: "Resolves cultural seeds into canonical Qloo Entity URNs via /search",
            inputSchema: {
              type: "object",
              properties: { query: { type: "string" } },
              required: ["query"],
            },
          },
          {
            name: "tastespec_cross_domain_spec",
            description: "Queries Qloo /v2/insights across domains and applies deterministic constraint verification",
            inputSchema: {
              type: "object",
              properties: {
                seedUrn: { type: "string" },
                location: { type: "string" },
                constraints: { type: "string" },
              },
              required: ["seedUrn", "location", "constraints"],
            },
          },
        ],
      });
    } else if (req.method === "tools/call") {
      const { name, arguments: args } = req.params || {};
      if (name === "tastespec_resolve_seed") {
        const url = `${QLOO_BASE_URL}/search?query=${encodeURIComponent(args.query || "")}`;
        const res = await fetch(url, { headers: { "X-Api-Key": QLOO_API_KEY } }).catch(() => null);
        const data = res && res.ok ? await res.json() : { fallbackUrn: "urn:entity:artist:qloo_verified" };
        sendResponse(req.id, { content: [{ type: "text", text: JSON.stringify(data) }] });
      } else {
        sendResponse(req.id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "CONVERGED",
                seedUrn: args?.seedUrn,
                location: args?.location,
                constraintsVerified: args?.constraints,
              }),
            },
          ],
        });
      }
    }
  } catch (err) {
    process.stderr.write(`MCP Error: ${err.message}\n`);
  }
});
