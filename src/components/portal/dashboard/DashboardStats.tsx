import React from "react";
import clientsLogo from "@/assets/dashboard/client-logo.svg";
import prospectLogo from "@/assets/dashboard/prospects-logo.svg";
import { NavLink } from "react-router-dom";

interface Stats {
  numOfClients: number;
  numOfProspects: number;
}
interface StatsItemProps {
  label: string;
  icon: string;
  number: number | null;
  link: string;
  loading: boolean;
}

const DashboardStats = ({
  stats,
  loading,
}: {
  stats: Stats;
  loading: boolean;
}) => {
  const items = [
    {
      label: "Active Clients",
      icon: clientsLogo,
      number: loading ? null : stats.numOfClients,
      link: "/portal/clients/list-client",
    },
    {
      label: "New Prospects",
      icon: prospectLogo,
      number: loading ? null : stats.numOfProspects,
      link: "/portal/prospects/list-prospect",
    },
  ];

  return (
    <div className="flex w-full">
      <div className="flex gap-2 m-2 flex-col md:flex-row w-full justify-between">
        {items.map((item) => (
          <StatsItem {...item} loading={loading} key={item.label} />
        ))}
      </div>
    </div>
  );
};

const StatsItem: React.FC<StatsItemProps> = ({
  label,
  icon,
  number,
  link,
  loading,
}) => {
  return (
    <div className="bg-white w-full flex border rounded-xl justify-between">
      <NavLink to={link} className="w-full">
        <div className="flex md:flex-row gap-4 p-4 rounded-xl justify-between items-center">
          <div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{number}</h2>
                <h1 className="text-sm">{label}</h1>
              </>
            )}
          </div>
          <div>
            <img
              src={icon}
              alt=""
              className={loading ? "opacity-30 grayscale" : ""}
            />
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default DashboardStats;
