import { Clients } from "../../clients/list/columns";
import { Properties } from "../../properties/columns";
import { Prospect } from "@/types/types";
import DonutChart from "../Chart";
import MiniTableBuilder from "./MiniTableBuilder";
import { clientsColumn } from "./columns/clientColumns";
import { propertiesColumn } from "./columns/propColumns";
import { prospectColumn } from "./columns/prospectColumns";

type MiniTableContainerProps = {
  propData: Properties;
  clientData: Clients;
  prospectData: Prospect;
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
        <MiniTableBuilder
          data={prospectData}
          columns={prospectColumn}
          label="Prospects"
          link="/portal/prospects/list-prospect"
        />
      </div>
      {/* Third Item */}
      <div className=" rounded-xl ">
        <MiniTableBuilder
          data={propData}
          columns={propertiesColumn}
          label="Properties"
          link="/portal/properties"
        />
      </div>
      {/* Fourth Item */}
      <div className=" rounded-xl ">
        <MiniTableBuilder
          data={clientData}
          columns={clientsColumn}
          label="Clients"
          link="/portal/clients/list-clients"
        />
      </div>
    </div>
  );
};

export default MiniTableContainer;
