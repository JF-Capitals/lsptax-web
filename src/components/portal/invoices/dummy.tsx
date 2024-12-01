import { Invoices } from "./columns";


export const sampleInvoices: Invoices[] = [
  {
    id: "INV001",
    type: "Utility",
    property: {
      account: "PA123456",
      cadOwners: "John Doe, Jane Smith",
    },
    amount: "$500",
    status: "Paid",
    addedOn: "2024-11-25T14:00:00.000Z",
    reminders: ["2024-11-20T09:00:00.000Z", "2024-11-22T10:30:00.000Z"],
  },
  {
    id: "INV002",
    type: "Tax",
    property: {
      account: "PA654321",
      cadOwners: "Michael Johnson",
    },
    amount: "$1,200",
    status: "Pending",
    addedOn: "2024-11-28T11:30:00.000Z",
    reminders: ["2024-11-29T08:00:00.000Z"],
  },
  {
    id: "INV003",
    type: "Maintenance",
    property: {
      account: "PA987654",
      cadOwners: "Emily Davis",
    },
    amount: "$300",
    status: "Overdue",
    addedOn: "2024-11-15T09:15:00.000Z",
    reminders: ["2024-11-16T07:45:00.000Z", "2024-11-18T12:00:00.000Z"],
  },
  {
    id: "INV004",
    type: "Insurance",
    property: {
      account: "PA456789",
      cadOwners: "Chris Brown, Alex Green",
    },
    amount: "$1,800",
    status: "Paid",
    addedOn: "2024-11-20T13:00:00.000Z",
    reminders: [],
  },
  {
    id: "INV005",
    type: "Security",
    property: {
      account: "PA321654",
      cadOwners: "Linda White",
    },
    amount: "$400",
    status: "Pending",
    addedOn: "2024-11-27T10:45:00.000Z",
    reminders: ["2024-11-30T09:00:00.000Z"],
  },
];

// console.log(sampleInvoices);
