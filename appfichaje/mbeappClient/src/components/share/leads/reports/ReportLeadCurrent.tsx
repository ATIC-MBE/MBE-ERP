import useReportLeadCurrent from "@/client/hooks/share/leads/report/useReportLeadCurrent";
import SpinnerCustom from "@/components/SpinnerCustom";

const ReportLeadCurrent = () => {
  const {
    allLeads,
    nroPrescriptor,
    whatsappPrescriptor,
    leadsAtrasadosPrescriptor,
    leadsAtrasadosPropietario,
    callsPrescriptorToday,
    callsPropietarioToday,
    callsPropietarioContratadoToday,
    callsPrescriptorContratadoToday,
    leadsPendientesToday,
    loading,
  } = useReportLeadCurrent();

  return (
    <>
      {loading ? (
        <div className="text-blue text-center flex justify-center pt-1 pb-1">
          <SpinnerCustom />
        </div>
      ) : (
        <div className="grid space-y-4 text-ms col">
          <div>
            <span className="text-bold">Total Leads:</span>&nbsp;&nbsp;
            <span className="text-white text-lg bg-[#0077BD] text-bold rounded-2xl px-2 py-1">
              {allLeads?.estadistica}
            </span>
          </div>
          <div>
            <span className="text-bold">Prescriptores Contratados:</span>
            &nbsp;&nbsp;
            <span className="text-white text-lg bg-[#0077BD] text-bold rounded-2xl px-2 py-1">
              {nroPrescriptor?.estadistica}
            </span>
            , &nbsp;Whatsapp:{" "}
            <span className="text-white bg-[#0077BD] text-bold text-lg rounded-2xl px-2 py-1">
              {whatsappPrescriptor?.estadistica}
            </span>
          </div>
          <br />
          <div>
            <span className="text-bold text-lg text-green-900">
              Leads Pendientes [ Today ]:
            </span>
            &nbsp;&nbsp;
            <span className="text-lg text-white bg-green-900 text-bold rounded-2xl px-2 py-1">
              {leadsPendientesToday?.estadistica}
            </span>
          </div>

          <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4">
            <legend className="ml-1 mr-1 text-black font-bold text-lg">
              Llamadas Today&nbsp;&nbsp;
              <span className="text-lg text-white bg-[#0077BD] text-bold rounded-2xl px-2 py-1">
                {(callsPrescriptorToday?.estadistica || 0) +
                  (callsPrescriptorContratadoToday?.estadistica || 0) +
                  (callsPropietarioToday?.estadistica || 0) +
                  (callsPropietarioContratadoToday?.estadistica || 0)}
              </span>
            </legend>
            <div className="pl-5">
              <span className="text-bold">Prescriptores:</span>&nbsp;&nbsp;
              <span className="text-white bg-[#0077BD] text-bold rounded-2xl px-2 py-1">
                {(callsPrescriptorToday?.estadistica || 0) +
                  (callsPrescriptorContratadoToday?.estadistica || 0)}
              </span>
            </div>
            <div className="pl-5">
              <span className="text-bold">Propietarios:</span>&nbsp;&nbsp;
              <span className="text-white bg-[#0077BD] text-bold rounded-2xl px-2 py-1">
                {(callsPropietarioToday?.estadistica || 0) +
                  (callsPropietarioContratadoToday?.estadistica || 0)}
              </span>
            </div>
          </fieldset>
          <br />
          <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3 mb-4">
            <legend className="ml-1 mr-1 text-black font-bold text-lg text-red-700">
              Leads atrasados&nbsp;&nbsp;
              <span className="text-lg text-white bg-red-700 text-bold rounded-2xl px-2 py-1">
                {(leadsAtrasadosPrescriptor?.estadistica || 0) +
                  (leadsAtrasadosPropietario?.estadistica || 0)}
              </span>{" "}
              <span className="text-lg" style={{ fontSize: "26px" }}>
                &#128557;&nbsp;
              </span>
            </legend>
            <div className="pl-5">
              <span className="text-bold">Prescriptores:</span>&nbsp;&nbsp;
              <span className="text-white bg-[#0077BD] text-bold rounded-2xl px-2 py-1">
                {leadsAtrasadosPrescriptor?.estadistica}
              </span>
            </div>
            <div className="pl-5">
              <span className="text-bold">Propietarios:</span>&nbsp;&nbsp;
              <span className="text-white bg-[#0077BD] text-bold rounded-2xl px-2 py-1">
                {leadsAtrasadosPropietario?.estadistica}
              </span>
            </div>
          </fieldset>
        </div>
      )}
    </>
  );
};

export default ReportLeadCurrent;
