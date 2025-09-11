
import React from "react";
import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import UtilCustomInstance from "../../../../../client/helpers/UtilCustom";
import {
  LOGO_MCH_B64,
  MARGINS_REPORT,
  CROSS_REPORT,
  CHECK_REPORT,
} from "../../../../../client/helpers/constants";
import { AiOutlineFilePdf } from "react-icons/ai";
import FetchApiServiceInstance from "../../../../../client/services/FetchApiService";

// typeShow: btn(boton, btn table) [default], ad [accedo directo]
type propsInput = {
  idReport: number;
  dateReport: string;
  lblButton?: string;
  typeShow?: string;
};

type dataList = {
  etiqueta: string;
  dispositivos: Array<{ type: string; state: string }>;
};

type estadisticaEstados = {
  sonoff: { nOn: number; nOff: number };
  lock: { nOn: number; nOff: number };
  ttlock: { nOn: number; nOff: number };
  movil: { nOn: number; nOff: number };
  telefonillo: { nOn: number; nOff: number };
  camara: { nOn: number; nOff: number };
};

// Variables globales por reporte
const titleReport = `Reporte de dispositivos [Disponibilidad]`;
const headerTableReport: Array<RowInput> = [
  [
    "Piso",
    "Móvil",
    "Manija",
    "Manija TTLock",
    "Luces",
    "Telefonillo",
    "Cámara",
  ],
];

/**
 * Preprocesa la información, para ser mostrada en PDF
 * @param lData
 * @param result
 */
const prettyDataList = (
  lData: Array<dataList>,
  result: Array<RowInput>
): estadisticaEstados => {
  let _totalSonoffOnline = 0;
  let _totalSonoffOffline = 0;

  let _totalMovilOnline = 0;
  let _totalMovilOffline = 0;

  let _totalLockOnline = 0;
  let _totalLockOffline = 0;

  let _totalTTLockOnline = 0;
  let _totalTTLockOffline = 0;

  let _totalTelefonilloOnline = 0;
  let _totalTelefonilloOffline = 0;

  let _totalCamaraOnline = 0;
  let _totalCamaraOffline = 0;

  lData.forEach((el, index) => {
  let _row: any[] = [];
    let _sonoff = el.dispositivos.find((el) => el.type === "sonoff");
    let _lock = el.dispositivos.find((el) => el.type === "lock");
    let _ttlock = el.dispositivos.find((el) => el.type === "ttlock");
    let _movil = el.dispositivos.find((el) => el.type === "movil");
    let _telefonillo = el.dispositivos.find((el) => el.type === "telefonillo");
    let _camara = el.dispositivos.find((el) => el.type === "camara");

    // Sumatoria de dispositivos Online / Offline
    _totalSonoffOnline += _sonoff
      ? _sonoff.state.trim().toLocaleLowerCase() === "online"
        ? 1
        : 0
      : 0;
    _totalSonoffOffline += _sonoff
      ? _sonoff.state.trim().toLocaleLowerCase() === "offline"
        ? 1
        : 0
      : 0;

    //_totalLockOnline += _lock ? (_lock.state.trim().toLocaleLowerCase()==='online' ? 1 : 0) : 0
    //_totalLockOffline += _lock ? (_lock.state.trim().toLocaleLowerCase()==='offline' ? 1 : 0) : 0

    _totalLockOnline += _lock
      ? (parseInt(_lock.state.trim().toLocaleLowerCase()) || 0) > 25
        ? 1
        : 0
      : 0;
    _totalLockOffline += _lock
      ? (parseInt(_lock.state.trim().toLocaleLowerCase()) || 0) <= 25
        ? 1
        : 0
      : 0;

    _totalTTLockOnline += _ttlock
      ? (parseInt(_ttlock.state.trim().toLocaleLowerCase()) || 0) > 25
        ? 1
        : 0
      : 0;
    _totalTTLockOffline += _ttlock
      ? (parseInt(_ttlock.state.trim().toLocaleLowerCase()) || 0) <= 25
        ? 1
        : 0
      : 0;

    _totalMovilOnline += _movil
      ? _movil.state.trim().toLocaleLowerCase() === "online"
        ? 1
        : 0
      : 0;
    _totalMovilOffline += _movil
      ? _movil.state.trim().toLocaleLowerCase() === "offline"
        ? 1
        : 0
      : 0;

    _totalTelefonilloOnline += _telefonillo
      ? _telefonillo.state.trim().toLocaleLowerCase() === "online"
        ? 1
        : 0
      : 0;
    _totalTelefonilloOffline += _telefonillo
      ? _telefonillo.state.trim().toLocaleLowerCase() === "offline"
        ? 1
        : 0
      : 0;

    _totalCamaraOnline += _camara
      ? _camara.state.trim().toLocaleLowerCase() === "online"
        ? 1
        : 0
      : 0;
    _totalCamaraOffline += _camara
      ? _camara.state.trim().toLocaleLowerCase() === "offline"
        ? 1
        : 0
      : 0;

    _row.push(el.etiqueta);
    _row.push(_movil ? _movil.state : ""); // movil
    _row.push(_lock ? _lock.state : ""); // lock
    _row.push(_ttlock ? _ttlock.state : ""); // ttlock
    _row.push(_sonoff ? _sonoff.state : ""); // sonoff
    _row.push(_telefonillo ? _telefonillo.state : ""); // telefonillo
    _row.push(_camara ? _camara.state : ""); // camara

    result.push(_row);
  });

  return {
    sonoff: { nOn: _totalSonoffOnline, nOff: _totalSonoffOffline },
    lock: { nOn: _totalLockOnline, nOff: _totalLockOffline },
    ttlock: { nOn: _totalTTLockOnline, nOff: _totalTTLockOffline },
    movil: { nOn: _totalMovilOnline, nOff: _totalMovilOffline },
    telefonillo: {
      nOn: _totalTelefonilloOnline,
      nOff: _totalTelefonilloOffline,
    },
    camara: { nOn: _totalCamaraOnline, nOff: _totalCamaraOffline },
  };
};

const MarcacionReport = (props: propsInput) => {
  const { dateReport, idReport, lblButton, typeShow = "btn" } = props;

  const drawIcon = (typeShow: string) => {
    switch (typeShow) {
      case "btn": // boton
        return (
          <>
            {lblButton ? (
              <div
                onClick={generatePdf}
                className="link-reports flex rounded-full card-action"
              >
                {lblButton}&nbsp;&nbsp;
                <AiOutlineFilePdf className="mt-1" title="Generar PDF" />
              </div>
            ) : (
              <div
                onClick={generatePdf}
                className="icon-table-row grid justify-center rounded-full w-[2rem] h-[1.6rem] card-action"
              >
                <AiOutlineFilePdf className="mt-1" title="Generar PDF" />
              </div>
            )}
          </>
        );
      case "ad": // acceso directo
        return (
          <>
            <div
              onClick={generatePdf}
              className="card-acceso-directo h-min text-[1rem] rounded-xl border border-blue text-white mt-3"
            >
              <div className="w-[10rem] h-[12rem] bg-[#fffffffb] rounded-xl shadow-sm grid grid-rows-3">
                <div className="row-span-3 grid items-center justify-items-center-xx">
                  <div className=" flex flex-col items-center space-y-2">
                    <AiOutlineFilePdf
                      title={"Reporte dispositivos"}
                      color="#0077BD"
                      size={"5rem"}
                    />
                    <h1 className="text-ms text-[#0077bd] text-center hover:text-[#ef8221] hover:text-[#ef8221]">
                      <b>Reporte dispositivos</b>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const generatePdf = async () => {
    const _doc = new jsPDF();
    _doc.setProperties({
      title: "ReporteDispositivos",
    });

    const _pageSize = _doc.internal.pageSize;

    let _imgData = `data:image/png;base64,${LOGO_MCH_B64}`;
    let _imgCross = `data:image/png;base64,${CROSS_REPORT}`;
    let _imgCheck = `data:image/png;base64,${CHECK_REPORT}`;

    let statusHttpUS = 200;

    let lData = await FetchApiServiceInstance.getAllData(
      `/api/reports/ratic/devicereport/${idReport}`,
      (err) => {
        const { status } = err.response!;
        statusHttpUS = status;
      }
    );

    let _dataListReport: Array<RowInput> = [];
    const {
      sonoff: _sonoff,
      lock: _lock,
      movil: _movil,
      telefonillo: _telefonillo,
      camara: _camara,
    } = prettyDataList(lData as Array<dataList>, _dataListReport);

    autoTable(_doc, {
      head: [...headerTableReport],
      body: [..._dataListReport],
      margin: { top: MARGINS_REPORT.top + 15, left: MARGINS_REPORT.left },
      tableWidth: 170,
      headStyles: {
        fillColor: "#0077BD",
      },
      didDrawPage: (data) => {
        // Header
        _doc.addImage(_imgData, 148, 10, 45, 20);
        _doc.setFontSize(14);
        _doc.text(
          `${titleReport}`,
          MARGINS_REPORT.left + 50,
          MARGINS_REPORT.top
        );
        _doc.setFontSize(11).setFont(_doc.getFont().fontName, "bold");
        _doc.text(`Fecha:`, MARGINS_REPORT.left, MARGINS_REPORT.top + 8);
        _doc.setFont(_doc.getFont().fontName, "normal");
        _doc.text(
          `${dateReport}`,
          MARGINS_REPORT.left + 13,
          MARGINS_REPORT.top + 8
        );
        // Fin Header
      },
      didDrawCell: function (data) {
        let _cellData = data.cell;
        let _valueCell = (_cellData.raw as string) || "";

        if (
          [1, 3, 4, 5].includes(data.column.index) &&
          data.cell.section === "body"
        ) {
          if (_valueCell.toLocaleLowerCase() === "offline") {
            _doc.addImage(
              _imgCross,
              _cellData.x + 5,
              _cellData.y + 2.5,
              2.6,
              2.6
            );
          } else if (_valueCell.toLocaleLowerCase() === "online") {
            _doc.addImage(
              _imgCheck,
              _cellData.x + 5,
              _cellData.y + 2.5,
              2.8,
              2.8
            );
          }
        } else if (
          [2].includes(data.column.index) &&
          data.cell.section === "body"
        ) {
          let _valueInt = parseInt(_valueCell) || -1;
          if (_valueInt < 0) {
          } else if (_valueInt <= 25 && _valueInt >= 0) {
            _doc.addImage(
              _imgCross,
              _cellData.x + 5,
              _cellData.y + 2.5,
              2.6,
              2.6
            );
          } else {
            _doc.addImage(
              _imgCheck,
              _cellData.x + 5,
              _cellData.y + 2.5,
              2.8,
              2.8
            );
          }
        }
      },

      didParseCell: function (cell) {
        if (
          [1, 2, 3, 4, 5].includes(cell.column.index) &&
          cell.section === "body"
        ) {
          cell.cell.styles.textColor = [255, 255, 255];
        }

        // Pintar el piso de ROJO si hay un dispositivo OFFLINE
        // if( [0].includes(cell.column.index) ) {
        //     let _countOffline = ((cell.row.raw as Array<string>).map(el => (el.toLocaleLowerCase() === 'offline'? 1 : 0)) as Array<number>).reduce((a,b) => (a+b), 0)
        //     if (_countOffline !== 0 ) {
        //         cell.cell.styles.textColor = [255, 0, 0]
        //         // cell.cell.styles.fontStyle = 'bold'
        //     }
        // }
      },
    });


    let _finalY = (_doc as any).lastAutoTable.finalY;
    const pageWidth = _doc.internal.pageSize.getWidth();

    //_doc.setLineDash([10, 10], 0);
    _doc.line(
      MARGINS_REPORT.left,
      _finalY + 8,
      pageWidth - 250,
      _finalY + 8
    );

    _doc.setFontSize(11).setFont(_doc.getFont().fontName, "bold");
    _doc.text(`Resumen`, MARGINS_REPORT.left, _finalY + 13);
    _doc.line(
      MARGINS_REPORT.left,
      _finalY + 15,
      pageWidth - 250,
      _finalY + 15
    );

    _finalY += 7; // aumenta la distancia del alto

    // MOVIL
    //_doc.setFontSize(11).setFont(_doc.getFont().fontName, 'bold')
    _doc.setFont(_doc.getFont().fontName, "normal");
    _doc.text(`Móvil`, MARGINS_REPORT.left, _finalY + 15);
    _doc.setFont(_doc.getFont().fontName, "normal");
    _doc.text(`${_movil.nOn}`, MARGINS_REPORT.left + 28, _finalY + 15);
    _doc.addImage(_imgCheck, MARGINS_REPORT.left + 34, _finalY + 12, 3, 3);
    _doc.text(`${_movil.nOff}`, MARGINS_REPORT.left + 48, _finalY + 15);
    _doc.addImage(_imgCross, MARGINS_REPORT.left + 54, _finalY + 12, 3, 3);

    // LOCK
    _doc.setFontSize(11).setFont(_doc.getFont().fontName, "normal");
    _doc.text(`Manija`, MARGINS_REPORT.left, _finalY + 22);
    _doc.setFont(_doc.getFont().fontName, "normal");
    _doc.text(`${_lock.nOn}`, MARGINS_REPORT.left + 28, _finalY + 22);
    _doc.addImage(_imgCheck, MARGINS_REPORT.left + 34, _finalY + 19, 3, 3);
    _doc.text(`${_lock.nOff}`, MARGINS_REPORT.left + 48, _finalY + 22);
    _doc.addImage(_imgCross, MARGINS_REPORT.left + 54, _finalY + 19, 3, 3);

    // LUCES
    _doc.setFontSize(11).setFont(_doc.getFont().fontName, "normal");
    _doc.text(`Luces`, MARGINS_REPORT.left, _finalY + 29);
    _doc.setFont(_doc.getFont().fontName, "normal");
    _doc.text(`${_sonoff.nOn}`, MARGINS_REPORT.left + 28, _finalY + 29);
    _doc.addImage(_imgCheck, MARGINS_REPORT.left + 34, _finalY + 26, 3, 3);
    _doc.text(`${_sonoff.nOff}`, MARGINS_REPORT.left + 48, _finalY + 29);
    _doc.addImage(_imgCross, MARGINS_REPORT.left + 54, _finalY + 26, 3, 3);

    // TELEFONILLO
    _doc.setFontSize(11).setFont(_doc.getFont().fontName, "normal");
    _doc.text(`Telefonillo`, MARGINS_REPORT.left, _finalY + 36);
    _doc.setFont(_doc.getFont().fontName, "normal");
    _doc.text(`${_telefonillo.nOn}`, MARGINS_REPORT.left + 28, _finalY + 36);
    _doc.addImage(_imgCheck, MARGINS_REPORT.left + 34, _finalY + 33, 3, 3);
    _doc.text(`${_telefonillo.nOff}`, MARGINS_REPORT.left + 48, _finalY + 36);
    _doc.addImage(_imgCross, MARGINS_REPORT.left + 54, _finalY + 33, 3, 3);

    // CAMARA
    _doc.setFontSize(11).setFont(_doc.getFont().fontName, "normal");
    _doc.text(`Cámara`, MARGINS_REPORT.left, _finalY + 43);
    _doc.setFont(_doc.getFont().fontName, "normal");
    _doc.text(`${_camara.nOn}`, MARGINS_REPORT.left + 28, _finalY + 43);
    _doc.addImage(_imgCheck, MARGINS_REPORT.left + 34, _finalY + 40, 3, 3);
    _doc.text(`${_camara.nOff}`, MARGINS_REPORT.left + 48, _finalY + 43);
    _doc.addImage(_imgCross, MARGINS_REPORT.left + 54, _finalY + 40, 3, 3);

    _doc.line(
      MARGINS_REPORT.left,
      _finalY + 47,
      pageWidth - 250,
      _finalY + 47
    );

    _doc.output("dataurlnewwindow");
  };

  return <>{drawIcon(typeShow)}</>;
};

export default MarcacionReport;
