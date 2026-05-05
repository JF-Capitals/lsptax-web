import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CLIENT_LIFECYCLE_PHASES,
  createLifecycleLabelResolver,
  describeTransitionEnd,
  formatLifecycleHistoryRow,
  getPhaseTitle,
  getStepLabel,
  parseCanonicalHistoryEntry,
  parseLifecycleHistoryAtMs,
  type LifecyclePhaseDef,
  type LifecyclePhaseId,
} from "@/constants/clientLifecycle";
import type { ClientLifecyclePayload } from "@/types/clientLifecycle";
import { editClient } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, ChevronDown, History, LoaderCircle, Route } from "lucide-react";

type StepVisual = "done" | "current" | "upcoming";

function phaseIndex(phaseId: string | null | undefined): number {
  if (!phaseId) return -1;
  return CLIENT_LIFECYCLE_PHASES.findIndex((p) => p.id === phaseId);
}

function stepVisual(
  phase: LifecyclePhaseDef,
  stepIndex: number,
  currentPhaseId: string | null | undefined,
  currentStepId: string | null | undefined,
): StepVisual {
  const pi = phaseIndex(currentPhaseId);
  const pThis = phaseIndex(phase.id);
  if (pThis < 0 || pi < 0) return "upcoming";
  if (pThis < pi) return "done";
  if (pThis > pi) return "upcoming";

  const curIdx = phase.steps.findIndex((s) => s.id === currentStepId);
  if (curIdx < 0) return "upcoming";
  if (stepIndex < curIdx) return "done";
  if (stepIndex === curIdx) return "current";
  return "upcoming";
}

interface ClientLifecyclePanelProps {
  clientId: number | string;
  lifecycle: ClientLifecyclePayload | null | undefined;
  onUpdated: () => void | Promise<void>;
}

export function ClientLifecyclePanel({ clientId, lifecycle, onUpdated }: ClientLifecyclePanelProps) {
  const { toast } = useToast();
  /** Collapsible panel; collapsed users still see “current step” from the disclosure header */
  const [lifecycleOpen, setLifecycleOpen] = useState(true);
  const [focusedPhaseId, setFocusedPhaseId] = useState<LifecyclePhaseId | null>(
    (lifecycle?.phaseId as LifecyclePhaseId) ?? CLIENT_LIFECYCLE_PHASES[0].id,
  );
  const [notesDraft, setNotesDraft] = useState(lifecycle?.notes ?? "");
  const [saving, setSaving] = useState<string | null>(null);

  const currentPhaseId = lifecycle?.phaseId ?? null;
  const currentStepId = lifecycle?.stepId ?? null;
  const completedAt = lifecycle?.completedAt ?? null;
  const notesDirty = notesDraft !== (lifecycle?.notes ?? "");

  useEffect(() => {
    const pid = lifecycle?.phaseId as LifecyclePhaseId | null | undefined;
    setFocusedPhaseId(pid ?? CLIENT_LIFECYCLE_PHASES[0].id);
    setNotesDraft(lifecycle?.notes ?? "");
  }, [lifecycle?.phaseId, lifecycle?.stepId, lifecycle?.notes, lifecycle?.completedAt]);

  const focusedPhase =
    CLIENT_LIFECYCLE_PHASES.find((p) => p.id === focusedPhaseId) ?? CLIENT_LIFECYCLE_PHASES[0];

  const saveLifecycle = useCallback(
    async (updates: Record<string, unknown>) => {
      try {
        await editClient(String(clientId), updates);
        toast({
          title: "Lifecycle updated",
          description:
            typeof updates.lifecycleNotes === "string"
              ? "Notes saved."
              : `${getPhaseTitle(String(updates.lifecyclePhase ?? ""))} — ${getStepLabel(String(updates.lifecyclePhase ?? ""), String(updates.lifecycleStep ?? ""))}`,
        });
        await onUpdated();
      } catch {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Could not save lifecycle. Try again.",
        });
      } finally {
        setSaving(null);
      }
    },
    [clientId, onUpdated, toast],
  );

  const onPickStep = (phaseId: LifecyclePhaseId, stepId: string) => {
    if (phaseId === currentPhaseId && stepId === currentStepId) return;
    setSaving(`step:${phaseId}:${stepId}`);
    void saveLifecycle({
      lifecyclePhase: phaseId,
      lifecycleStep: stepId,
    });
  };

  const onSaveNotes = () => {
    setSaving("notes");
    void saveLifecycle({ lifecycleNotes: notesDraft.trim() || "" });
  };

  function isSavingStep(phaseId: LifecyclePhaseId, stepId: string) {
    return saving === `step:${phaseId}:${stepId}`;
  }

  const labelResolver = useMemo(
    () => createLifecycleLabelResolver(lifecycle?.phases),
    [lifecycle?.phases],
  );

  /** Chronological: oldest → newest (`at` ascending); newest is last row = current pipeline state. */
  const historyTimeline = useMemo(() => {
    const h = lifecycle?.history;
    if (!Array.isArray(h)) return [];
    type Item = {
      raw: unknown;
      atMs: number;
      isoAt: string;
      canonicalReturn: ReturnType<typeof parseCanonicalHistoryEntry>;
    };
    const items: Item[] = h.map((row) => {
      const record = row as Record<string, unknown>;
      const atMs = parseLifecycleHistoryAtMs(record);
      const atStr =
        typeof record.at === "string" && record.at.trim()
          ? record.at.trim()
          : atMs !== null && Number.isFinite(atMs)
            ? new Date(atMs).toISOString()
            : "";
      return {
        raw: row,
        atMs: atMs ?? Number.POSITIVE_INFINITY,
        isoAt: atStr,
        canonicalReturn: parseCanonicalHistoryEntry(row),
      };
    });
    items.sort((a, b) => {
      const d = a.atMs - b.atMs;
      if (d !== 0) return d;
      return a.isoAt.localeCompare(b.isoAt);
    });
    return items.slice(-50);
  }, [lifecycle?.history]);

  const latestTransition = [...historyTimeline]
    .reverse()
    .find((item) => item.canonicalReturn != null)?.canonicalReturn;

  const historyMatchesSummary =
    !latestTransition ||
    (latestTransition.to.phase === currentPhaseId &&
      latestTransition.to.step === currentStepId);

  const phaseStrip = CLIENT_LIFECYCLE_PHASES;
  const currentPi = phaseIndex(currentPhaseId);

  return (
    <section className="mt-10">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-950/5">
        <button
          type="button"
          aria-expanded={lifecycleOpen}
          aria-controls="client-lifecycle-panel"
          onClick={() => setLifecycleOpen((o) => !o)}
          className={cn(
            "flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50/90 sm:gap-4 sm:px-5 sm:py-5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-2",
            lifecycleOpen && "border-b border-slate-100",
          )}
        >
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <Route className="h-5 w-5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="client-lifecycle-heading" className="text-2xl font-bold tracking-tight text-slate-900">
              Client lifecycle
            </h2>
            <p id="client-lifecycle-heading-description" className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
              Seven phases from onboarding through billing — expand to change step, notes, and history.
            </p>

            {currentPhaseId && currentStepId ? (
              <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Current step</span>
                <span className="text-sm font-semibold leading-snug text-slate-900">
                  {labelResolver.stepLabel(currentStepId, currentPhaseId)}
                </span>
                {completedAt ? (
                  <span className="text-xs font-normal text-slate-500 sm:ml-auto">
                    Updated <time dateTime={completedAt}>{new Date(completedAt).toLocaleString()}</time>
                  </span>
                ) : null}
              </div>
            ) : currentPhaseId && !currentStepId ? (
              <div className="mt-3">
                <Badge variant="outline" className="border-amber-200 bg-amber-50 font-normal text-amber-900">
                  Phase set — choose a step when expanded
                </Badge>
              </div>
            ) : (
              <div className="mt-3">
                <Badge variant="outline" className="border-amber-200 bg-amber-50 font-normal text-amber-900">
                  Not started — expand to set first step
                </Badge>
              </div>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 pt-1">
            <ChevronDown
              className={cn(
                "h-6 w-6 text-slate-500 transition-transform duration-200",
                lifecycleOpen && "rotate-180",
              )}
              aria-hidden
            />
            <span className="hidden text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:block">
              {lifecycleOpen ? "Hide" : "Show"}
            </span>
          </div>
        </button>

        <div
          id="client-lifecycle-panel"
          role="region"
          aria-labelledby="client-lifecycle-heading"
          aria-describedby="client-lifecycle-heading-description"
          hidden={!lifecycleOpen}
          className={cn(!lifecycleOpen && "hidden")}
        >
          {/* Phase rail */}
          <div className="border-b border-slate-100 bg-gradient-to-b from-slate-50/90 to-white px-3 py-5 sm:px-5">
          <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-widest text-slate-500 sm:text-left">
            Phases
          </p>
          <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ol className="flex min-w-max items-start justify-center gap-0 sm:justify-start">
              {phaseStrip.map((phase, i) => {
                const isFocused = phase.id === focusedPhaseId;
                const isCurrentSlot = i === currentPi;
                const past = currentPi >= 0 && i < currentPi;

                return (
                  <li key={phase.id} className="flex items-start">
                    <button
                      type="button"
                      onClick={() => setFocusedPhaseId(phase.id)}
                      title={phase.title}
                      className={cn(
                        "group relative flex w-[4.5rem] flex-col items-center gap-2 rounded-xl px-1 py-2 transition-all sm:w-[5.25rem]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-2",
                        isFocused && "bg-white shadow-md ring-1 ring-slate-200/80",
                        !isFocused && "hover:bg-white/70",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold tabular-nums transition-all",
                          past && "bg-emerald-600 text-white shadow-sm",
                          isCurrentSlot && !past && "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200",
                          !past && !isCurrentSlot && currentPi >= 0 && "bg-slate-200 text-slate-700",
                          currentPi < 0 && "bg-slate-200 text-slate-700",
                        )}
                      >
                        {past ? <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} /> : phase.order}
                      </span>
                      <span
                        className={cn(
                          "line-clamp-2 text-center text-[10px] font-semibold leading-tight sm:text-[11px]",
                          isFocused ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900",
                          isCurrentSlot && "text-indigo-700",
                        )}
                      >
                        {phase.shortTitle}
                      </span>
                    </button>
                    {i < phaseStrip.length - 1 && (
                      <div
                        className="mx-0 mt-[18px] h-1 w-2 shrink-0 rounded-full bg-slate-200 sm:mx-0.5 sm:h-1.5 sm:w-8 md:w-12"
                        role="presentation"
                        aria-hidden
                      >
                        <div
                          className={cn(
                            "h-full w-full rounded-full transition-colors duration-300",
                            i < currentPi ? "bg-emerald-500" : "bg-slate-200",
                          )}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="space-y-0 divide-y divide-slate-100">
          {/* Selected phase + steps */}
          <div className="px-4 py-6 sm:px-6">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Phase {focusedPhase.order} of {CLIENT_LIFECYCLE_PHASES.length}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">{focusedPhase.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{focusedPhase.summary}</p>
            </div>

            <ol className="relative space-y-0">
              {focusedPhase.steps.map((step, si) => {
                const vis = stepVisual(focusedPhase, si, currentPhaseId, currentStepId);
                const isSavingThis = isSavingStep(focusedPhase.id, step.id);
                const isMarkedCurrent =
                  focusedPhase.id === currentPhaseId && step.id === currentStepId && !!currentStepId;
                const rowDone = vis === "done";
                const isLast = si === focusedPhase.steps.length - 1;

                return (
                  <li key={step.id} className="relative flex gap-0">
                    <div className="flex w-9 shrink-0 flex-col items-center pt-1 sm:w-10" aria-hidden>
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                          rowDone && "border-emerald-500 bg-emerald-50 text-emerald-700",
                          isMarkedCurrent && "border-indigo-600 bg-indigo-600 text-white shadow-sm",
                          !rowDone && !isMarkedCurrent && "border-slate-200 bg-white text-slate-400",
                        )}
                      >
                        {rowDone ? <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={2.5} /> : si + 1}
                      </div>
                      {!isLast && (
                        <div
                          className={cn(
                            "my-1 w-px flex-1 min-h-[12px]",
                            rowDone ? "bg-emerald-200" : "bg-slate-200",
                          )}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 pb-6 pl-3 sm:pl-5">
                      <div
                        className={cn(
                          "rounded-xl border p-4 transition-shadow sm:flex sm:items-stretch sm:justify-between sm:gap-4",
                          isMarkedCurrent &&
                            "border-indigo-200 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-100/80",
                          rowDone && !isMarkedCurrent && "border-slate-100 bg-slate-50/50",
                          !rowDone &&
                            !isMarkedCurrent &&
                            "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm",
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900">{step.title}</span>
                            {isMarkedCurrent && (
                              <Badge className="h-5 border-0 bg-indigo-600 px-2 text-[10px] font-semibold uppercase tracking-wide text-white hover:bg-indigo-600">
                                Active
                              </Badge>
                            )}
                            {rowDone && !isMarkedCurrent && (
                              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                        </div>
                        <div className="mt-4 shrink-0 sm:mt-0 sm:flex sm:items-center">
                          <Button
                            type="button"
                            variant={isMarkedCurrent ? "secondary" : "outline"}
                            size="sm"
                            className={cn(
                              "h-9 w-full min-w-[8.5rem] font-medium shadow-none sm:w-auto",
                              isMarkedCurrent && "cursor-default bg-slate-100 text-slate-600",
                              !isMarkedCurrent && "border-slate-200 hover:bg-slate-50 hover:text-slate-900",
                            )}
                            disabled={(!!saving && !isSavingThis) || isMarkedCurrent}
                            onClick={() => onPickStep(focusedPhase.id, step.id)}
                          >
                            {isSavingThis ? (
                              <span className="inline-flex items-center gap-2">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Saving…
                              </span>
                            ) : isMarkedCurrent ? (
                              "Active step"
                            ) : rowDone ? (
                              "Move here"
                            ) : (
                              "Set to this step"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Notes */}
          <div className="bg-slate-50/40 px-4 py-6 sm:px-6">
            <label htmlFor={`lifecycle-notes-${clientId}`} className="text-sm font-semibold text-slate-900">
              Notes at this lifecycle position
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Shown with the client · saved entries appear in history below
            </p>
            <textarea
              id={`lifecycle-notes-${clientId}`}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              rows={4}
              className={cn(
                "mt-3 min-h-[5.5rem] w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-inner",
                "placeholder:text-slate-400",
                "focus-visible:border-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25",
              )}
              placeholder="Filing deadlines, CAD batch ID, hearing prep checklist, settlement terms…"
            />
            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                variant="blue"
                size="sm"
                className="min-w-[7rem]"
                disabled={!notesDirty || !!saving}
                onClick={onSaveNotes}
              >
                {saving === "notes" ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Saving…
                  </span>
                ) : (
                  "Save notes"
                )}
              </Button>
            </div>
          </div>

          {/* History */}
          {historyTimeline.length > 0 && (
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 sm:px-6 marker:content-none [&::-webkit-details-marker]:hidden">
                <History className="h-4 w-4 shrink-0 text-slate-500" />
                <span>Lifecycle history</span>
                <span className="font-normal text-slate-500">({historyTimeline.length} events)</span>
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-slate-100 bg-slate-50/60 px-3 py-4 sm:px-5">
                {!historyMatchesSummary && latestTransition ? (
                  <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                    Last history transition does not match the client’s summary{" "}
                    <code className="rounded bg-white/70 px-1">phaseId</code> /{" "}
                    <code className="rounded bg-white/70 px-1">stepId</code>. Refresh after save or reconcile on the server.
                  </p>
                ) : null}
                <ul className="relative space-y-0">
                  {historyTimeline.map((item, idx) => {
                    const isLatest = idx === historyTimeline.length - 1;
                    const canonical = item.canonicalReturn;
                    const ts = canonical
                      ? new Date(canonical.at)
                      : Number.isFinite(item.atMs)
                        ? new Date(item.atMs)
                        : null;
                    const timeLabel =
                      ts && !Number.isNaN(ts.getTime())
                        ? ts.toLocaleString()
                        : canonical
                          ? canonical.at
                          : item.isoAt || "—";

                    return (
                      <li key={`${idx}-${item.isoAt || idx}`} className="relative flex gap-3 pb-8 last:pb-0">
                        <div className="flex w-10 shrink-0 flex-col items-center pt-1" aria-hidden>
                          <span
                            className={cn(
                              "flex h-2.5 w-2.5 shrink-0 rounded-full border-2 border-white shadow-sm ring-2",
                              isLatest ? "bg-indigo-600 ring-indigo-200" : "bg-slate-300 ring-slate-200",
                            )}
                          />
                          {idx < historyTimeline.length - 1 ? (
                            <span className="mt-2 w-px min-h-[2.5rem] flex-1 bg-slate-200" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1 pb-1">
                          <div className="flex flex-wrap items-baseline gap-2 gap-y-1">
                            <time
                              className={cn(
                                "text-[11px] font-semibold uppercase tracking-wide text-slate-500",
                                isLatest && "text-indigo-700",
                              )}
                              dateTime={canonical?.at ?? item.isoAt}
                            >
                              {timeLabel}
                            </time>
                            {isLatest ? (
                              <Badge className="h-5 border-0 bg-indigo-600 px-2 py-0 text-[10px] font-semibold uppercase tracking-wide text-white hover:bg-indigo-600">
                                Current
                              </Badge>
                            ) : null}
                          </div>
                          {canonical ? (
                            <>
                              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium leading-snug text-slate-900">
                                <span>{describeTransitionEnd(canonical.from, labelResolver)}</span>
                                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                                <span>{describeTransitionEnd(canonical.to, labelResolver)}</span>
                              </p>
                              {canonical.notes ? (
                                <p className="mt-2 rounded-md border border-slate-100 bg-white/80 px-3 py-2 text-sm leading-relaxed text-slate-700">
                                  {canonical.notes}
                                </p>
                              ) : null}
                            </>
                          ) : (
                            <p className="mt-2 text-sm leading-relaxed text-slate-700">
                              {formatLifecycleHistoryRow(item.raw, labelResolver)}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
