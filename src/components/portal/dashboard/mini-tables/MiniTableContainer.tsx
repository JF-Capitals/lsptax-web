import { Clients } from "../../clients/list/columns";
// import { ContractOwner } from "../../contract-owner/columns";
import { Properties } from "../../properties/columns";
import { Prospect } from "@/types/types";
import DonutChart from "../Chart";
import MiniTableBuilder from "./MiniTableBuilder";
import { clientsColumn } from "./columns/clientColumns";
import { propertiesColumn } from "./columns/propColumns";
import { prospectColumn } from "./columns/prospectColumns";
// import { contractOwnerColumns } from "./columns/contractOwnerColumns";

type MiniTableContainerProps = {
  propData: Properties;
  clientData: Clients;
  prospectData: Prospect;
  // contractOwnersData: ContractOwner;
};

const MiniTableContainer = ({ propData,clientData,prospectData }: MiniTableContainerProps) => {
  return (
    <div className="m-2 flex flex-col gap-2">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="md:w-1/2 border rounded-xl ">
          <DonutChart />
        </div>
        <div className="md:w-1/2">
          <MiniTableBuilder
            data={prospectData}
            columns={prospectColumn}
            label="Prospects"
            link="/portal/prospects/list-prospect"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="md:w-1/2 w-full">
          <MiniTableBuilder
            data={propData}
            columns={propertiesColumn}
            label="Properties"
            link="/portal/properties"
          />
        </div>
        <div className="md:w-1/2">
          <MiniTableBuilder
            data={clientData}
            columns={clientsColumn}
            label="Clients"
            link="/portal/clients/list-clients"
          />
        </div>
      </div>
    </div>
  );
};

export default MiniTableContainer;
