import { NextRequest, NextResponse } from "next/server";
import { runTasteSpecPipeline, WorkflowId } from "@/lib/qloo";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      workflowId?: WorkflowId;
      seedQuery?: string;
      locationQuery?: string;
      constraintsInput?: string;
    };

    const workflowId: WorkflowId = body.workflowId || "live-event";
    const result = await runTasteSpecPipeline({
      workflowId,
      seedQuery: body.seedQuery,
      locationQuery: body.locationQuery,
      constraintsInput: body.constraintsInput,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected agent error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
