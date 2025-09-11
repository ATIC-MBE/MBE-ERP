import React from "react";
import { ILead } from "@/client/models/ILead";
import MyLeadItem from "./MyLeadItem";

const MyLeadsList = ({
  items,
  pathEdit,
}: {
  items: Array<ILead>;
  pathEdit: string;
}) => {
  const leads = items ? [...items] : [];

  // Ordenar los leads: "Poco" al final
  const sortedItems = [...leads].sort((a, b) => {
    if (a.name_tinteresa === "Poco" && b.name_tinteresa !== "Poco") {
      return 1;
    } else if (a.name_tinteresa !== "Poco" && b.name_tinteresa === "Poco") {
      return -1;
    } else {
      return 0;
    }
  });

  return (
    <div className="bg-white table-content">
      {sortedItems.map((item, index) => {
        return (
          <MyLeadItem key={"item-l" + index} item={item} pathEdit={pathEdit} />
        );
      })}
    </div>
  );
};

export default MyLeadsList;
