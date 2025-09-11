import React from "react";
import {
  AiOutlineBulb,
  AiOutlineLock,
  AiOutlineMobile,
  AiOutlinePhone,
  AiOutlineVideoCamera,
} from "react-icons/ai";
import { DeviceType } from "@/client/types/globalTypes";

const DeviceTag = ({
  item,
  handleChangeStateDevice,
}: {
  item: DeviceType;
  handleChangeStateDevice: (id: number) => void;
}) => {
  const getIconDevice = (code: string) => {
    return (
      <span className="flex" style={{ display: "inline-flex" }}>
        {code === "lock" ? (
          <AiOutlineLock title="Lock" color={`green`} size={"1.5rem"} />
        ) : (
          ""
        )}
        {code === "ttlock" ? (
          <AiOutlineLock title="TTLock" color={`green`} size={"1.5rem"} />
        ) : (
          ""
        )}
        {code === "sonoff" ? (
          <AiOutlineBulb title="sonoff" color={`#ebb601`} size={"1.5rem"} />
        ) : (
          ""
        )}
        {code === "movil" ? (
          <AiOutlineMobile title="sonoff" color={`#0077BD`} size={"1.5rem"} />
        ) : (
          ""
        )}
        {code === "telefonillo" ? (
          <AiOutlinePhone title="sonoff" color={`#ff5e00`} size={"1.5rem"} />
        ) : (
          ""
        )}
        {code === "camara" ? (
          <AiOutlineVideoCamera
            title="sonoff"
            color={`black`}
            size={"1.5rem"}
          />
        ) : (
          ""
        )}
      </span>
    );
  };

  const bgTag = (action: string, estado: number): string => {
    let _bgTagStr = "";
    if (estado === 1 && action === "add")
      _bgTagStr = "bg-[#ffffffc8] border-2 border-[#0077BD]";
    else if ([0, 1].includes(estado) && action === "delete")
      _bgTagStr = "bg-red-50 border-2 border-[red]";
    else if (estado === 0 && action === "add")
      _bgTagStr = "bg-gray-50 border-2 border-[gray]";
    return _bgTagStr;
  };

  return (
    <div
      onClick={() => handleChangeStateDevice(item.id)}
      className={`card-action flex text-blue-800 ${bgTag(
        item.action || "",
        item.estado
      )} text-bold rounded-2xl px-4 py-2`}
    >
      {getIconDevice(item.type)}
      <span className="flex">
        &nbsp;{item.type === "lock" ? item.codigo : item.nombre}
      </span>
    </div>
  );
};

export default DeviceTag;
