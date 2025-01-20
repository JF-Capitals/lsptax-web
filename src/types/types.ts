// src/types.ts

export interface ClientData {
  id: number;
  TypeOfAcct: string;
  CLIENTNumber?: string; // Optional to match `String?` in Prisma
  CLIENTNAME?: string;
  Email?: string;
  PHONENUMBER?: string;
  NAMEONCAD?: string;
  MAILINGADDRESS?: string;
  MAILINGADDRESSCITYTXZIP?: string;
  IsArchived: boolean; // Boolean with default handled in backend
  createdAt: Date;
  updatedAt: Date;
}
export interface Property {
  id: number;
  StatusNotes?: string;
  OtherNotes?: string;
  NAMEONCAD?: string;
  MAILINGADDRESS?: string;
  MAILINGADDRESSCITYTXZIP?: string;
  CADMailingADDRESS?: string;
  CADCITY?: string;
  CADZIPCODE?: string;
  CADCOUNTY?: string;
  AccountNumber?: string;
  CLIENTNumber?: string;
  CONTACTOWNER?: string;
  SUBCONTRACTOWNER?: string;
  BPPFEE?: string;
  CONTINGENCYFee?: string;
  FlatFee?: string;
  IsArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  invoices?: InvoiceData[];
}

export interface Invoice {
  id: number;
  AccountNumber?: string;
  CLIENTNumber?: string;
  BPPInvoice?: string;
  BPPInvoicePaid?: string;
  NoticeMarketValue?: string;
  FinalMarketValue?: string;
  MarketValueReduction?: string;
  NoticeAppraisedValue?: string;
  FinalAppraisedValue?: string;
  ValueAppraisedValueReduction?: string;
  ValueOverallTaxRate?: string;
  ValueTaxSavings?: string;
  Contingency?: string;
  ContingencyFeeDue?: string;
  TaxBPPBPPLastYearAppraised?: string;
  TaxBPPFinalAppraisedTotal?: string;
  TaxBPPAppraisedValueReduction?: string;
  TaxBPPOverallTaxRate?: string;
  TaxBPPTaxSavings?: string;
  TaxBPPContingencyFee?: string;
  TaxBPPDue?: string;
  JustBPPBPPLastYearAppraised?: string;
  BPPThisYearAppraised?: string;
  ProtestInvoice?: string;
  ProtestInvoicePaid?: string;
  ONLYMarketChangeInARB?: string;
  NoticeAppraisedTotal?: string;
  ArbitrationFinalAppraisedTotal?: string;
  ArbitrationAppraisedValueReduction?: string;
  ArbitrationOverallTaxRate?: string;
  TaxSavings?: string;
  ArbitrationContingencyFee?: string;
  ArbitrationDue?: string;
  ARBFee?: string;
  ComptrollerRefundCK?: string;
  CollectOrRefund?: string;
  ARBInvoice?: string;
  ClientPaidOrArbRefundUsed?: string;
  TotalDue?: string;
  TypeOfService?: string;
  AnyRandamServiceInvoice?: string;
  RandomServiceFeeInvoicePaid?: string;
  LastYearAppraised?: string;
  Value2525FinalAppraisedTotal?: string;
  Value2525AppraisedValueReduction?: string;
  Value2525OverallTaxRate?: string;
  Value2525TaxSavings?: string;
  Value2525ContingencyFee?: string;
  Value2525Due?: string;
  PastDue?: string;
  PastDuePaid?: string;
  IsArchived: boolean;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSummary {
  clientId: string;
  propertyNumbers: string[]; 
  totalContingencyFeeDue: number;
  createdAt: string; 
}

export interface InvoiceData {
  client: ClientData;
  properties: InvoiceProperty[];
}
interface InvoiceProperty{
  propertyDetails: Property;
  invoice: Invoice;
}

export interface PropertyData {
  clientDetails: ClientData;
  propertyDetails: Property;
  invoices: Invoice[];
}
