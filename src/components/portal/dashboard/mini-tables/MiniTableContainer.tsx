import { Clients } from "../../clients/list/columns";
import { Properties } from "../../properties/columns";
import { Prospect } from "@/types/types";
import DonutChart from "../Chart";
import MiniTableBuilder from "./MiniTableBuilder";
import { clientsColumn } from "./columns/clientColumns";
import { propertiesColumn } from "./columns/propColumns";
import { prospectColumn } from "./columns/prospectColumns";

type MiniTableContainerProps = {
  propData: Properties[];
  clientData: Clients[];
  prospectData: Prospect[];
};

const MiniTableContainer = ({
  propData,
  clientData,
  prospectData,
}: MiniTableContainerProps) => {
  return (
    <div className="m-2 grid grid-cols-1 md:grid-cols-2 gap-2">
      {/* First Item */}
      <div className=" rounded-xl border ">
        <DonutChart />
      </div>
      {/* Second Item */}
      <div className=" rounded-xl ">
        <MiniTableBuilder<Prospect>
          data={prospectData}
          columns={prospectColumn as import("@tanstack/react-table").ColumnDef<Prospect, any>[]}
          label="Prospects"
          link="/portal/prospects/list-prospect"
        />
      </div>
      {/* Third Item */}
      <div className=" rounded-xl ">
        <MiniTableBuilder<Properties>
          data={propData}
          columns={propertiesColumn as import("@tanstack/react-table").ColumnDef<Properties, any>[]}
          label="Properties"
          link="/portal/properties"
        />
      </div>
      {/* Fourth Item */}
      <div className=" rounded-xl ">
        <MiniTableBuilder<Clients>
          data={clientData}
          columns={clientsColumn as import("@tanstack/react-table").ColumnDef<Clients, any>[]}
          label="Clients"
          link="/portal/clients/list-clients"
        />
      </div>
    </div>
  );
};

export default MiniTableContainer;
