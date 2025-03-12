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
  protestDate?: string;
  hearingDate?: string;
  invoiceDate?: string;
  bppRendered?: string;
  bppInvoice?: string;
  bppPaid?: string;
  noticeLandValue?: string;
  noticeImprovementValue?: string;
  noticeMarketValue?: string;
  noticeAppraisedValue?: string;
  finalLandValue?: string;
  finalImprovementValue?: string;
  finalMarketValue?: string;
  finalAppraisedValue?: string;
  marketReduction?: string;
  appraisedReduction?: string;
  taxRate?: string;
  taxableSavings?: string;
  contingencyFee?: string;
  invoiceAmount?: string;
  paidDate?: string;
  paymentNotes?: string;
  beginningMarket?: string;
  endingMarket?: string;
  beginningAppraised?: string;
  endingAppraised?: string;
  underLitigation: boolean;
  underArbitration: boolean;
  isArchived: boolean;
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
  invoice: Invoice[];
}

export interface PropertyData {
  clientDetails: ClientData;
  propertyDetails: Property;
  invoices: Invoice[];
}

export interface Prospect {
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
