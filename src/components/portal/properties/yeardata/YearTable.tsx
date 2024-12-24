import TableBuilder from "../../TableBuilder"
import { propertyYearDataColumn } from "./columns"


const YearTable = () => {
  return (
      <div>YearTable
          <TableBuilder data={undefined} columns={propertyYearDataColumn} label={"Year Table"}/>
    </div>
  )
}

export default YearTable