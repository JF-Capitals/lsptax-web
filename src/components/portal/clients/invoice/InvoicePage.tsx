import { getInvoice, getInvoiceByPropertyId } from "@/store/data";
import { InvoiceData } from "@/types/types";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import InvoiceDetails2025 from "./InvoiceDetails2025";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routes } from "@/routes/ROUTES";

type NormalizationResult = {
  invoiceData?: InvoiceData;
  debug: Record<string, unknown>;
};

const mapPropertyOnlyPayload = (
  payload: unknown
): InvoiceData | undefined => {
  if (!payload || typeof payload !== "object") return undefined;

  const maybePayload = payload as {
    propertyDetails?: unknown;
    invoices?: unknown;
  };

  if (!maybePayload.propertyDetails || !Array.isArray(maybePayload.invoices)) {
    return undefined;
  }

  const propertyDetails = maybePayload.propertyDetails as Record<string, unknown>;

  // New API returns invoice details by property. Build a compatible client object
  // from available property fields so existing invoice views continue to render.
  const fallbackClient = {
    id: Number(propertyDetails.clientId ?? 0),
    clientName: String(propertyDetails.clientName ?? propertyDetails.nameOnCad ?? ""),
    clientNumber: String(propertyDetails.clientNumber ?? ""),
    mailingAddress: String(propertyDetails.mailingAddress ?? ""),
    mailingAddressCityTxZip: String(propertyDetails.mailingAddressCityTxZip ?? ""),
    contingencyFee: String(propertyDetails.contingencyFee ?? "0"),
    email: String(propertyDetails.email ?? ""),
    phoneNumber: String(propertyDetails.phoneNumber ?? ""),
  };

  return {
    client: fallbackClient,
    properties: [
      {
        propertyDetails: maybePayload.propertyDetails as InvoiceData["properties"][number]["propertyDetails"],
        invoice: maybePayload.invoices as InvoiceData["properties"][number]["invoice"],
      },
    ],
  };
};

const mapCandidateToInvoice = (candidate: unknown): InvoiceData | undefined => {
  const propertyOnly = mapPropertyOnlyPayload(candidate);
  if (propertyOnly) return propertyOnly;

  if (!candidate || typeof candidate !== "object") return undefined;

  const maybeInvoice = candidate as {
    client?: unknown;
    clientDetails?: unknown;
    properties?: unknown;
    propertyDetails?: unknown;
    invoices?: unknown;
  };

  const client = (maybeInvoice.client ?? maybeInvoice.clientDetails) as InvoiceData["client"];
  let properties = (maybeInvoice.properties ?? []) as unknown;

  // Some endpoints return one property payload shape:
  // { client|clientDetails, propertyDetails, invoices }
  if (
    (!Array.isArray(properties) || properties.length === 0) &&
    maybeInvoice.propertyDetails &&
    Array.isArray(maybeInvoice.invoices)
  ) {
    properties = [
      {
        propertyDetails: maybeInvoice.propertyDetails,
        invoice: maybeInvoice.invoices,
      },
    ];
  }

  if (!client || !Array.isArray(properties)) return undefined;
  return { client, properties: properties as InvoiceData["properties"] };
};

const normalizeInvoiceData = (raw: unknown): NormalizationResult => {
  if (!raw) return { debug: { reason: "empty raw payload", rawType: typeof raw } };

  const source = (raw as { data?: unknown }).data ?? raw;
  const sourceArray = Array.isArray(source) ? source : [source];

  // Case: single property-only payload from GET /api/invoice/:propertyId
  const propertyOnly = mapPropertyOnlyPayload(source);
  if (propertyOnly) {
    return {
      invoiceData: propertyOnly,
      debug: {
        sourceType: Array.isArray(source) ? "array" : "single",
        sourceLength: sourceArray.length,
        normalizedAs: "property-only-payload",
        mappedProperties: propertyOnly.properties.length,
      },
    };
  }

  // Case: array of property payloads:
  // [{ client|clientDetails, propertyDetails, invoices }, ...]
  if (sourceArray.length > 0 && sourceArray.every((item) => item && typeof item === "object")) {
    const first = sourceArray[0] as {
      client?: unknown;
      clientDetails?: unknown;
      propertyDetails?: unknown;
      invoices?: unknown;
    };
    if (
      (first.client || first.clientDetails) &&
      first.propertyDetails &&
      Array.isArray(first.invoices)
    ) {
      const client = (first.client ?? first.clientDetails) as InvoiceData["client"];
      const properties = sourceArray
        .map((item) => item as { propertyDetails?: unknown; invoices?: unknown })
        .filter((item) => item.propertyDetails && Array.isArray(item.invoices))
        .map((item) => ({
          propertyDetails: item.propertyDetails,
          invoice: item.invoices,
        }));

      return {
        invoiceData: { client, properties: properties as InvoiceData["properties"] },
        debug: {
          sourceType: Array.isArray(source) ? "array" : "single",
          sourceLength: sourceArray.length,
          normalizedAs: "property-payload-array",
          mappedProperties: properties.length,
        },
      };
    }
  }

  // Fallback: pick first mappable object in list
  const mapped = sourceArray.map(mapCandidateToInvoice).find(Boolean);
  if (mapped) {
    return {
      invoiceData: mapped,
      debug: {
        sourceType: Array.isArray(source) ? "array" : "single",
        sourceLength: sourceArray.length,
        normalizedAs: "single-candidate",
        propertyCount: mapped.properties.length,
      },
    };
  }

  const firstObject = sourceArray.find((item) => item && typeof item === "object") as
    | Record<string, unknown>
    | undefined;
  return {
    debug: {
      sourceType: Array.isArray(source) ? "array" : "single",
      sourceLength: sourceArray.length,
      firstObjectKeys: firstObject ? Object.keys(firstObject) : [],
      reason: "Could not map payload to InvoiceData",
    },
  };
};

const InvoicePage = () => {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const clientId = searchParams.get("clientId");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | undefined>();
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableYears = Array.from(
    new Set(
      (invoiceData?.properties ?? [])
        .flatMap((property) => property.invoice)
        .map((invoice) => invoice.year)
    )
  ).sort((a, b) => b - a);

  useEffect(() => {
    if (!propertyId && !clientId) {
      setInvoiceData(undefined);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchInvoiceData = async () => {
      try {
        const response = propertyId
          ? await getInvoiceByPropertyId({ propertyId })
          : await getInvoice({ clientId: clientId as string });
        const { invoiceData: normalized, debug } = normalizeInvoiceData(response);
        if (import.meta.env.DEV) {
          const debugIdentifier = propertyId
            ? `propertyId=${propertyId}`
            : `clientId=${clientId}`;
          console.group(`[InvoicePage] invoice payload debug for ${debugIdentifier}`);
          console.log("Raw response:", response);
          console.log("Normalization debug:", debug);
          console.log("Normalized invoice data:", normalized);
          console.groupEnd();
        }
        if (!cancelled) {
          setInvoiceData(normalized);
        }
      } catch (e) {
        console.error("Error fetching invoice data:", e);
        if (!cancelled) {
          setInvoiceData(undefined);
          setError("Failed to load invoice data. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchInvoiceData();
    return () => {
      cancelled = true;
    };
  }, [clientId, propertyId]);

  if (!propertyId && !clientId) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[40vh] px-4 text-center">
        <p className="text-lg font-semibold text-red-600">Property ID is required</p>
        <p className="text-muted-foreground max-w-md">
          Open invoices from a property so the URL includes{" "}
          <code className="text-sm bg-muted px-1 rounded">?propertyId=…</code>.
        </p>
        <Button asChild variant="outline">
          <Link to={routes.clients.list()}>Back to clients</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-semibold text-gray-700">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4 px-4">
        <p className="text-lg font-semibold text-red-700">{error}</p>
        <Button asChild variant="outline">
          <Link to={routes.clients.list()}>Back to clients</Link>
        </Button>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4 px-4">
        <p className="text-lg font-semibold text-gray-700">No invoice data for this client.</p>
        <Button asChild variant="outline">
          <Link to={routes.clients.list()}>Back to clients</Link>
        </Button>
      </div>
    );
  }

  if (!invoiceData.client || !Array.isArray(invoiceData.properties)) {
    console.error("Invalid invoice data structure:", invoiceData);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg font-semibold text-red-700">Error: Invalid data structure</p>
          <p className="text-sm text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-[980px] px-3 pt-4">
        {availableYears.length > 0 && (
          <div className="mb-3 w-[180px]">
            <Select
              onValueChange={(value) => setSelectedYear(Number(value))}
              value={selectedYear.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <InvoiceDetails2025 invoice={invoiceData} selectedYear={selectedYear} />
    </div>
  );
};

export default InvoicePage;
