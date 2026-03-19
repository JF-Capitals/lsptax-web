// src/types.ts

export interface ClientData {
  id: number;
  TypeOfAcct?: string;
  typeOfAcct?: string;
  CLIENTNumber?: string;
  clientNumber?: string;
  CLIENTNAME?: string;
  clientName?: string;
  Email?: string;
  email?: string;
  BillingAddress?: string;
  billingAddress?: string;
  BillingEmail?: string;
  billingEmail?: string;
  PHONENUMBER?: string;
  phoneNumber?: string;
  NAMEONCAD?: string;
  nameOnCad?: string;
  MAILINGADDRESS?: string;
  mailingAddress?: string;
  MAILINGADDRESSCITYTXZIP?: string;
  mailingAddressCityTxZip?: string;
  contingencyFee?: string;
  IsArchived?: boolean;
  isArchived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Property {
  id: number;
  StatusNotes?: string;
  statusNotes?: string;
  OtherNotes?: string;
  otherNotes?: string;
  NAMEONCAD?: string;
  nameOnCad?: string;
  MAILINGADDRESS?: string;
  mailingAddress?: string;
  MAILINGADDRESSCITYTXZIP?: string;
  mailingAddressCityTxZip?: string;
  CADMailingADDRESS?: string;
  cadMailingAddress?: string;
  CADCITY?: string;
  cadCity?: string;
  CADZIPCODE?: string;
  cadZipCode?: string;
  CADCOUNTY?: string;
  cadCounty?: string;
  AccountNumber?: string;
  accountNumber?: string;
  CLIENTNumber?: string;
  clientNumber?: string;
  CONTACTOWNER?: string;
  contactOwner?: string;
  SUBCONTRACTOWNER?: string;
  subcontractOwner?: string;
  BPPFEE?: string;
  bppFee?: string;
  FlatFee?: string;
  flatFee?: string;
  IsArchived?: boolean;
  isArchived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  id: string | number;
  isArchived: boolean;
  clientId: string;
  propertyNumbers: string[]; 
  totalInvoiceAmount: number;
  createdAt: string; 
}

export interface InvoiceProperty {
  propertyDetails: Property;
  invoice: Invoice[];
}

export interface InvoiceData {
  client: ClientData;
  properties: InvoiceProperty[];
}

export interface PropertyData {
  clientDetails: ClientData;
  propertyDetails: Property;
  invoices: Invoice[];
}

export interface Prospect {
  id: number;
  clientName: string;
  email: string;
  phoneNumber: string;
  inquireDate?: string;
  mailingAddress?: string;
  mailingAddressCityTxZip?: string;
  contingencyFee?: string;
  billingAddress?: string;
  billingEmail?: string;
  envelopeId?: string;
  isArchived?: boolean;
  status: string;
}
export interface ProspectPropertyData {
  clientDetails: Prospect;
  propertyDetails: Property;
}
