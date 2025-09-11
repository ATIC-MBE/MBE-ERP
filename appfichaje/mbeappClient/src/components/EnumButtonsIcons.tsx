import React, { useState, Dispatch } from "react";
import {
  AiOutlineBulb,
  AiOutlineLock,
  AiOutlineMobile,
  AiOutlinePhone,
  AiOutlineVideoCamera,
} from "react-icons/ai";

type Nulleable<T> = T | null;
type DataTypeIn = { key: string; name: string; label: string };

type EnumButtonType = {
  value: DataTypeIn;
  id: number;
  selected: Nulleable<number>;
  setSelected: Dispatch<React.SetStateAction<Nulleable<number>>>;
  isSelected: boolean;
  max: number;
  txtSize?: string;
};

type EnumButtonsType = {
  values: Array<DataTypeIn>;
  selected: Nulleable<number>;
  setSelected: Dispatch<React.SetStateAction<Nulleable<number>>>;
  txtSize?: string;
};

const EnumButton = ({
  value,
  id,
  selected,
  setSelected,
  isSelected,
  max,
  txtSize = "text-lg",
}: EnumButtonType) => (
  <button
    onClick={() => (!(selected == id) ? setSelected(id) : setSelected(null))}
    className={
      `p-2 w-auto ${txtSize} ` +
      (isSelected ? "bg-[#0077bd] " : "bg-white text-blue-800 ") +
      (id == 0 ? " rounded-l-xl " : id == max ? " rounded-r-xl " : "")
    }
  >
    <span style={{ display: "inline-flex" }}>
      {value.name === "lock" ? (
        <AiOutlineLock
          title="Lock"
          color={`${isSelected ? "white" : "#0077bd"}`}
          size={"1.3rem"}
        />
      ) : (
        ""
      )}
      {value.name === "ttlock" ? (
        <AiOutlineLock
          title="TTLock"
          color={`${isSelected ? "white" : "#0077bd"}`}
          size={"1.3rem"}
        />
      ) : (
        ""
      )}
      {value.name === "sonoff" ? (
        <AiOutlineBulb
          title="sonoff"
          color={`${isSelected ? "white" : "#0077bd"}`}
          size={"1.3rem"}
        />
      ) : (
        ""
      )}
      {value.name === "movil" ? (
        <AiOutlineMobile
          title="sonoff"
          color={`${isSelected ? "white" : "#0077bd"}`}
          size={"1.3rem"}
        />
      ) : (
        ""
      )}
      {value.name === "telefonillo" ? (
        <AiOutlinePhone
          title="sonoff"
          color={`${isSelected ? "white" : "#0077bd"}`}
          size={"1.3rem"}
        />
      ) : (
        ""
      )}
      {value.name === "camara" ? (
        <AiOutlineVideoCamera
          title="sonoff"
          color={`${isSelected ? "white" : "#0077bd"}`}
          size={"1.3rem"}
        />
      ) : (
        ""
      )}
      &nbsp;{value.label}
    </span>
  </button>
);

const EnumButtonsIcons = ({
  values,
  selected,
  setSelected,
  txtSize = "text-lg",
}: EnumButtonsType) => {
  return (
    <div className="w-auto flex justify-left divide-x-2 rounded-l-xl rounded-r-xl border border-blue text-white">
      {values.map((value, i) => (
        <div key={"EnumButton" + value.name + i} className="w-auto">
          <EnumButton
            txtSize={txtSize}
            value={value}
            id={i}
            selected={selected}
            setSelected={setSelected}
            isSelected={selected == i}
            max={values.length - 1}
          />
        </div>
      ))}
    </div>
  );
};

export default EnumButtonsIcons;
