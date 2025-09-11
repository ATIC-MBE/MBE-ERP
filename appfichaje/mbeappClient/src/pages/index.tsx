import { Layout } from "@/components/Layout";
import React, { useState } from "react";
import Modal from "@/components/Modal";
import PageTable from "@/components/PageTable";
import Tooltip from "@/components/TooltipOLD";
import RMGPropiertieCard from "@/components/RMGPropiertieCard";
import RMGPropertiesList from "@/components/RMGPropertiesList";
import { RMGPropiertieCardType } from "@/client/types/globalTypes";
import EnumButtons from "@/components/EnumButtons";
import NumberButtonsInput from "@/components/NumberButtonsInput";

export default function Home() {
  const pisosList: Array<RMGPropiertieCardType> = [
    {
      piso: "Moncloa1",
      estado: "Activo",
      alquiler: 1500,
      muebles: 200,
      total: 1700,
      limite: 1600,
    },
    {
      piso: "Azcas1",
      estado: "Activo",
      alquiler: 1500,
      muebles: 200,
      total: 1700,
      limite: 1600,
    },
    {
      piso: "Chuecas1",
      estado: "Activo",
      alquiler: 1500,
      muebles: 200,
      total: 1700,
      limite: 1600,
    },
    {
      piso: "PH1",
      estado: "Activo",
      alquiler: 1500,
      muebles: 200,
      total: 1700,
      limite: 1600,
    },
    {
      piso: "PH2",
      estado: "Activo",
      alquiler: 1500,
      muebles: 200,
      total: 1700,
      limite: 1600,
    },
    {
      piso: "PH3",
      estado: "Activo",
      alquiler: 1500,
      muebles: 200,
      total: 1700,
      limite: 1600,
    },
    {
      piso: "Alcatraz1",
      estado: "Activo",
      alquiler: 1500,
      muebles: 200,
      total: 1700,
      limite: 1600,
    },
  ];

  const [selected, setSelected] = useState<number | null>(0);

  return (
    <Layout>
      {/* <PageTable/>  */}
      {/*<div className=" flex justify-end pr-10">
            <RMGPropertiesList PisosList={pisosList}/>
    </div>*/}
      {/* {<div className="w-min grid">
                <EnumButtons values={['Test', 'Prueba', 'Nah']} selected={selected} setSelected={setSelected} />
</div>}
            {<NumberButtonsInput/>} */}
    </Layout>
  );
}
