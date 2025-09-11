import React from "react";
import { useRouter } from "next/router";
import UtilCustomInstance from "@/client/helpers/UtilCustom";
import {
  BsFillEmojiAngryFill,
  BsFillEmojiNeutralFill,
  BsFillEmojiSmileFill,
  BsPencilFill,
} from "react-icons/bs";
import { ILead } from "@/client/models/ILead";
import AgenteIcon from "@/components/Iconos/AgenteIcon";
import PropietarioIcon from "@/components/Iconos/PropietarioIcon";
import useMyLeadItem from "@/client/hooks/share/myleads/useMyLeadItem";

const MyLeadItem = ({ item, pathEdit }: { item: ILead; pathEdit: string }) => {
  const router = useRouter();

  const { itemContent, goEditData, eventMap } = useMyLeadItem(item, pathEdit);
  if (!itemContent) {
    return <div>Error: Datos del lead no disponibles.</div>;
  }
  return (
    <div className={`w-full h-auto`}>
      {/* <div className="grid pl-2 pr-2"> #0077BD 0077bd #d2ebf9*/}
      {/* <div className={`grid grid-cols-7 p-1 pl-2 text-[#0077BD]`}> */}
      <div
        onClick={() => goEditData(itemContent.id as number)}
        className={`data-table-row grid grid-cols-5 p-1 pl-2 ${
          itemContent.lbl_orden === "orden_2"
            ? "txt-orange-f3bb6d"
            : "text-[#0077BD]"
        }`}
      >
        <div className="grid col-span-2">
          <span className="flex">
            {((itemContent.tipo_lead as string) || "").trim().toLowerCase() ===
              "colaborador" ||
            ((itemContent.tipo_lead as string) || "").trim().toLowerCase() ===
              "prescriptor" ? (
              <AgenteIcon
                title="Prescriptor"
                color={"#ef8221"}
                className="w-[1.2rem] h-[1.2rem]"
              />
            ) : (
              <PropietarioIcon
                title="Propietario"
                color={"#0077bd"}
                className="w-[1.2rem] h-[1.2rem]"
              />
            )}
            {itemContent.name_tinteresa === "Mucho" ? (
              <BsFillEmojiSmileFill
                className="text-green-600"
                style={{ display: "inline" }}
                size={"1.1rem"}
              />
            ) : itemContent.name_tinteresa === "Medio" ? (
              <BsFillEmojiNeutralFill
                className="text-yellow-600"
                style={{ display: "inline" }}
                size={"1.1rem"}
              />
            ) : itemContent.name_tinteresa === "Poco" ? (
              <BsFillEmojiAngryFill
                className="text-red-600"
                style={{ display: "inline" }}
                size={"1.1rem"}
              />
            ) : (
              ""
            )}
            &nbsp;{itemContent.persona}
          </span>
        </div>

        <div>
          <span className="flex">{itemContent.telefonos_str}</span>
        </div>

        <div>
          <span className="flex">{itemContent.next_step}</span>
        </div>

        <div>
          <span className="flex">{itemContent.last_step}</span>
        </div>
      </div>
    </div>
  );
};

export default MyLeadItem;
