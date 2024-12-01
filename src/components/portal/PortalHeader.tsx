import logo from "@/assets/logo.svg";

const PortalHeader = () => {
  return (
    <div className="scroll-smooth">
      <div className="flex md:flex justify-around items-center  p-4">
        <img src={logo} />
      </div>
    </div>
  );
};

export default PortalHeader;
