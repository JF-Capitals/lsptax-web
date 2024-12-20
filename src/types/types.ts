// src/types.ts

// Define the raw data structure that comes from the API
export interface Property {
  ls_prop_client_id: number;
  ls_prop_account_number: string;
  ls_prop_type: string;
  ls_prop_class: string;
  ls_prop_assessor: string;
  ls_prop_street: string;
  ls_prop_city: string;
  ls_prop_state: string;
  ls_prop_zip: string;
  ls_prop_cad_owner: string;
  ls_prop_cad_address: string;
  ls_prop_cad_mailing_address: string;
  ls_prop_aoa_signed_on: string;
  ls_prop_added_on: string;
}

// Define the structured data you want to use in the table
export interface StructuredProperty {
  clientId: number;
  propertyAccount: string;
  propertyDetails: {
    type: string;
    class: string;
    assessor: string;
    address: string[];
  };
  cadOwner: {
    name: string;
    address: string;
    mailingAddress: string;
  };
  hearingDate: string;
  aoaSigned: string;
  addedOn: string;
}
