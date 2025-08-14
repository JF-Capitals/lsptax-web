// src/types.ts

export interface ClientData {
  id: number;
  TypeOfAcct: string;
  CLIENTNumber?: string; // Optional to match `String?` in Prisma
  CLIENTNAME?: string;
  Email?: string;
  BillingAddress: string;
  BillingEmail: string;
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
  protestDate?: string;
  hearingDate?: string;
  invoiceDate?: string;
  bppRendered?: string;
  bppInvoice?: string;
  bppPaid?: string;
  noticeLandValue?: number;
  noticeImprovementValue?: number;
  noticeMarketValue?: number;
  noticeAppraisedValue?: number;
  finalLandValue?: number;
  finalImprovementValue?: number;
  finalMarketValue?: number;
  finalAppraisedValue?: number;
  marketReduction?: number;
  appraisedReduction?: number;
  taxRate?: number;
  taxableSavings?: number;
  contingencyFee?: number;
  invoiceAmount?: number;
  paidDate?: string;
  paymentNotes?: string;
  beginningMarket?: number;
  endingMarket?: number;
  beginningAppraised?: number;
  endingAppraised?: number;
  underLitigation: boolean;
  underArbitration: boolean;
  isArchived: boolean;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSummary {
  id: any;
  isArchived: any;
  clientId: string;
  propertyNumbers: string[]; 
  totalInvoiceAmount: number;
  createdAt: string; 
}

export interface InvoiceData {
  client: ClientData;
  properties: InvoiceProperty[];
}
interface InvoiceProperty{
  propertyDetails: Property;
  invoice: Invoice[];
}

export interface PropertyData {
  clientDetails: ClientData;
  propertyDetails: Property;
  invoices: Invoice[];
}

export interface Prospect {
  BillingAddress: string;
  BillingEmail: string;
  envelopeId: string;
  id: number;
  ProspectName: string;
  Email: string;
  PHONENUMBER: string;
  MAILINGADDRESS: string;
  MAILINGADDRESSCITYTXZIP: string;
  IsArchived: boolean;
  status: string;
}
export interface ProspectPropertyData {
  clientDetails: Prospect;
  propertyDetails: Property;
}
