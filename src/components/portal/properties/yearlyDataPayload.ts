import { cleanNumberInput } from "@/utils/formatCurrency";

/** Allowed per-year contingency fee overrides (percent). */
export const CONTINGENCY_FEE_OPTIONS = [0, 15, 25, 35, 45] as const;

const LABEL_TO_CAMEL: Record<string, string> = {
  "Protest Date": "protestDate",
  "BPP Rendered": "bppRendered",
  "BPP Invoice": "bppInvoice",
  "BPP Paid": "bppPaid",
  "Notice Land Value": "noticeLandValue",
  "Notice Improvement Value": "noticeImprovementValue",
  "Notice Appraised Value": "noticeAppraisedValue",
  "Final Land Value": "finalLandValue",
  "Final Improvement Value": "finalImprovementValue",
  "Final Appraised Value": "finalAppraisedValue",
  "Hearing Date": "hearingDate",
  "Invoice Date": "invoiceDate",
  "Under Litigation": "underLitigation",
  "Under Arbitration": "underArbitration",
  "Tax Rate": "taxRate",
  "Contingency Fee": "contingencyFee",
  "Paid Date": "paidDate",
  "Payment Notes": "paymentNotes",
  "Ending Market": "endingMarket",
  "Ending Appraised": "endingAppraised",
};

/** Server-calculated — never send on save. */
const CALCULATED_LABELS = new Set([
  "Notice Market Value",
  "Final Market Value",
  "Market Reduction",
  "Appraised Reduction",
  "Taxable Savings",
  "Invoice Amount",
  "Beginning Market",
  "Beginning Appraised",
]);

const NUMERIC_CAMEL_KEYS = new Set([
  "noticeLandValue",
  "noticeImprovementValue",
  "noticeAppraisedValue",
  "finalLandValue",
  "finalImprovementValue",
  "finalAppraisedValue",
  "taxRate",
  "contingencyFee",
  "endingMarket",
  "endingAppraised",
]);

export type YearlyTableRow = Record<string, string | boolean | number | undefined> & {
  year: number;
};

function normalizeValue(label: string, value: string | boolean | number | undefined): unknown {
  if (typeof value === "boolean") return value;

  const camelKey = LABEL_TO_CAMEL[label];
  if (!camelKey) return value;

  if (NUMERIC_CAMEL_KEYS.has(camelKey)) {
    const str = cleanNumberInput(String(value ?? ""));
    if (str === "" || str === "0") return 0;
    const num = parseFloat(str);
    return Number.isFinite(num) ? num : 0;
  }

  return typeof value === "string" ? value : String(value ?? "");
}

/**
 * Build v2 camelCase yearlyData for PUT /action/edit-property.
 * Keys are calendar years ("2025", "2026") — one invoice row per property + year on the backend.
 * Sends every column year shown in the edit table, not a delta.
 */
export function buildYearlyDataPayload(
  currentRows: YearlyTableRow[],
): Record<string, Record<string, unknown>> {
  const payload: Record<string, Record<string, unknown>> = {};

  currentRows.forEach((row) => {
    const yearPayload: Record<string, unknown> = {};

    for (const [label, camelKey] of Object.entries(LABEL_TO_CAMEL)) {
      if (CALCULATED_LABELS.has(label)) continue;
      yearPayload[camelKey] = normalizeValue(label, row[label] as string | boolean);
    }

    payload[String(row.year)] = yearPayload;
  });

  return payload;
}
