import { Properties } from "./columns";

export const sampleProperties: Properties[] = [
  {
    clientId: "C001",
    propertyAccount: "PA123456",
    propertyDetails: {
      type: "Residential",
      class: "Class A",
      assessor: "Assessor 1",
      address: "123 Main St, Springfield, IL",
    },
    cadOwner: {
      name: "John Doe",
      address: "456 Elm St, Springfield, IL",
      mailingAddress: "PO Box 789, Springfield, IL",
    },
    hearingDate: "2024-12-05T10:30:00.000Z",
    aoaSigned: "Yes",
    addedOn: "2024-11-20T14:45:00.000Z",
  },
  {
    clientId: "C002",
    propertyAccount: "PA654321",
    propertyDetails: {
      type: "Commercial",
      class: "Class B",
      assessor: "Assessor 2",
      address: "789 Oak St, Chicago, IL",
    },
    cadOwner: {
      name: "Jane Smith",
      address: "101 Pine St, Chicago, IL",
      mailingAddress: "PO Box 456, Chicago, IL",
    },
    hearingDate: "2025-01-10T09:15:00.000Z",
    aoaSigned: "No",
    addedOn: "2024-11-25T16:00:00.000Z",
  },
  {
    clientId: "C003",
    propertyAccount: "PA987654",
    propertyDetails: {
      type: "Industrial",
      class: "Class C",
      assessor: "Assessor 3",
      address: "222 Maple St, Naperville, IL",
    },
    cadOwner: {
      name: "Michael Johnson",
      address: "333 Birch St, Naperville, IL",
      mailingAddress: "PO Box 111, Naperville, IL",
    },
    hearingDate: "2024-12-15T14:00:00.000Z",
    aoaSigned: "Yes",
    addedOn: "2024-11-28T12:00:00.000Z",
  },
  {
    clientId: "C004",
    propertyAccount: "PA456789",
    propertyDetails: {
      type: "Agricultural",
      class: "Class D",
      assessor: "Assessor 4",
      address: "555 Willow St, Peoria, IL",
    },
    cadOwner: {
      name: "Emily Davis",
      address: "666 Cedar St, Peoria, IL",
      mailingAddress: "PO Box 222, Peoria, IL",
    },
    hearingDate: "2024-12-20T11:45:00.000Z",
    aoaSigned: "No",
    addedOn: "2024-11-18T09:30:00.000Z",
  },
  {
    clientId: "C005",
    propertyAccount: "PA321654",
    propertyDetails: {
      type: "Mixed Use",
      class: "Class E",
      assessor: "Assessor 5",
      address: "777 Ash St, Aurora, IL",
    },
    cadOwner: {
      name: "Chris Brown",
      address: "888 Redwood St, Aurora, IL",
      mailingAddress: "PO Box 333, Aurora, IL",
    },
    hearingDate: "2025-01-05T13:30:00.000Z",
    aoaSigned: "Yes",
    addedOn: "2024-11-27T10:15:00.000Z",
  },
];

