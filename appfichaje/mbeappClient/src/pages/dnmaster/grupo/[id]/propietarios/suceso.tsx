import { Layout } from "@/components/Layout";
import React from "react";
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillSave,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineComment,
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { ALERT_DANGER } from "@/client/helpers/constants";
import AlertContainer from "@/components/AlertContainer";
import useGrupoProId from "@/client/hooks/dnmaster/grupo/propietario/useGrupoProId";
import PropietarioIcon from "@/components/Iconos/PropietarioIcon";
import ButtonContainerVertical from "@/components/ButtonContainerVertical";
import FloatButton from "@/components/FloatButton";
import { MdCancel } from "react-icons/md";
import {
  FaEdgeLegacy,
  FaHospitalUser,
  FaPlusCircle,
  FaRegUser,
  FaTrashAlt,
  FaUser,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import { BsFillFilePersonFill } from "react-icons/bs";
import { FcConferenceCall } from "react-icons/fc";

const LeadId = () => {
  const {
    dataDB,
    flagInfoExtra,
    handleChange,
    handleSave,
    handleCancel,
    handleChangePropietario,
    handleOperation,
    errorValidate,
    msgError,
    listSucesos,
    fnSelectPropietario,
    handlerFlagInfoExtra,
    loadingBtnActionSave,
    loadingBtnActionDelete,
    handleDelete,
  } = useGrupoProId();

  return (
    <Layout>
      <div className="w-auto  min-h-[30rem] grid grid-flow-col">
        <div className="w-full min-h-[20rem] px-10">
          <div className="bg-[#ffffff72] h-full w-full rounded-2xl shadow-2xl p-5">
            {errorValidate ? (
              <AlertContainer typeAlert={ALERT_DANGER}>
                <div dangerouslySetInnerHTML={{ __html: msgError }} />
              </AlertContainer>
            ) : (
              <></>
            )}
            <input type="hidden" name="id" value={dataDB.id?.toString()} />

            <div className="min-h-[35rem] grid grid-cols-2 space-x-5">
              <div className="h-full grid space-y-2">
                <div className=" min-h-[18rem] bg-[#5da7d5c0] rounded-2xl p-5 space-y-4">
                  <h1 className="text-lg text-[#0077bd] font-bold">
                    Información del Grupo
                  </h1>

                  <div className="grid space-x-2">
                    <div className=" w-full flex text-xs">
                      <label className="p-2 h-min w-[5.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                        Grupo{" "}
                        <span
                          style={{ color: "red" }}
                          className="field-required"
                        >
                          *
                        </span>
                      </label>
                      <input
                        value={dataDB.nombre}
                        onChange={handleChange}
                        type="text"
                        name="nombre"
                        className="rounded-r-full p-2 w-[100%] outline-blue-800"
                      />
                    </div>
                  </div>

                  <div className="grid space-x-2">
                    <div className=" w-full flex text-xs">
                      <label className="px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                        <AiOutlineWhatsApp title="Whatsapp" size={"1.2rem"} />
                      </label>
                      <input
                        placeholder="Ingresar grupo whatsapp"
                        value={dataDB.whatsapp}
                        onChange={handleChange}
                        type="text"
                        name="whatsapp"
                        className="rounded-r-full p-2 w-[100%] outline-blue-800"
                      />
                    </div>
                  </div>

                  <div className="grid">
                    <div
                      className="flex justify-end"
                      style={{ fontSize: "16px" }}
                    >
                      <h5
                        className="acordion text-bold"
                        style={{ display: "flex" }}
                        onClick={handlerFlagInfoExtra}
                      >
                        Información adicional ...&nbsp;
                        {flagInfoExtra ? (
                          <span className="flex text-blue">
                            <AiFillCaretUp size={"1.4rem"} />
                          </span>
                        ) : (
                          <span className="flex text-blue">
                            <AiFillCaretDown size={"1.4rem"} />
                          </span>
                        )}
                      </h5>
                    </div>
                    {flagInfoExtra ? (
                      <div className="space-y-4 mt-5">
                        <div className="grid grid-cols-1 space-x-2">
                          <div className="w-full flex text-xs">
                            <label className="px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                              <FaUserTie
                                title="Info. Administrador"
                                size={"1.2rem"}
                              />
                            </label>
                            <textarea
                              placeholder="Información administrador"
                              defaultValue={dataDB.administrador}
                              onChange={handleChange}
                              className="rounded-r-full h-[4.5rem] py-2 px-2 w-[100%] outline-blue-800"
                              name="administrador"
                            ></textarea>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 space-x-2">
                          <div className="w-full flex text-xs">
                            <label className="px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                              <FaUser
                                title="Info. Presidente"
                                size={"1.2rem"}
                              />
                            </label>
                            <textarea
                              placeholder="Información presidente"
                              defaultValue={dataDB.presidente}
                              onChange={handleChange}
                              className="rounded-r-full h-[4.5rem] py-2 px-2 w-[100%] outline-blue-800"
                              name="presidente"
                            ></textarea>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 space-x-2">
                          <div className="w-full flex text-xs">
                            <label className="px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                              <FaUsers title="Info. vecinos" size={"1.2rem"} />
                            </label>
                            <textarea
                              placeholder="Información vecinos"
                              defaultValue={dataDB.vecinos}
                              onChange={handleChange}
                              className="rounded-r-full h-[4.5rem] py-2 px-2 w-[100%] outline-blue-800"
                              name="vecinos"
                            ></textarea>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 space-x-2">
                          <div className="w-full flex text-xs">
                            <label className="px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                              <FaHospitalUser
                                title="Info. portero"
                                size={"1.2rem"}
                              />
                            </label>
                            <textarea
                              placeholder="Información portero"
                              defaultValue={dataDB.portero}
                              onChange={handleChange}
                              className="rounded-r-full h-[4.5rem] py-2 px-2 w-[100%] outline-blue-800"
                              name="portero"
                            ></textarea>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 space-x-2">
                          <div className="w-full flex text-xs">
                            <label className="px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                              <FaPlusCircle title="Otros" size={"1.2rem"} />
                            </label>
                            <textarea
                              placeholder="Otros"
                              defaultValue={dataDB.otros}
                              onChange={handleChange}
                              className="rounded-r-full h-[4.5rem] py-2 px-2 w-[100%] outline-blue-800"
                              name="otros"
                            ></textarea>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 space-x-2">
                          <div className="w-full flex text-xs">
                            <label className="px-3 py-3 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                              <FaEdgeLegacy
                                title="Acceso intranet"
                                size={"1.2rem"}
                              />
                            </label>
                            <textarea
                              placeholder="Acceso Intranet"
                              defaultValue={dataDB.acceso_intranet}
                              onChange={handleChange}
                              className="rounded-r-full h-[4.5rem] py-2 px-2 w-[100%] outline-blue-800"
                              name="acceso_intranet"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <fieldset className="grid border border-solid border-gray-300 p-3 space-y-3">
                    <legend className="ml-1 mr-1 text-[#0077bd] font-bold text-ms">
                      Propietarios
                    </legend>
                    {dataDB.propietarios.length === 0 ? (
                      <div className="grid space-x-2">
                        <div className=" w-full flex text-ms">
                          <label className="px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                            <PropietarioIcon
                              title="Propietario"
                              color={"white"}
                              className="w-[1.3rem] h-[1.3rem]"
                            />
                          </label>
                          <input
                            disabled
                            value={"Sin propietarios!!"}
                            type="text"
                            name="na"
                            className="p-2 w-[100%] outline-blue-800 rounded-r-full text-bold"
                          />
                        </div>
                      </div>
                    ) : (
                      dataDB.propietarios.map((el, index) => (
                        <div
                          key={`hst-${index}`}
                          className="card-user-suceso grid rounded-2xl items-center p-4 space-y-2"
                        >
                          <div className=" w-full flex text-xs">
                            <label className="px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                              <PropietarioIcon
                                title="Propietario"
                                color={"white"}
                                className="w-[1.1rem] h-[1.1rem]"
                              />
                            </label>
                            <input
                              placeholder="Nombres"
                              value={el.nombre_completo}
                              onChange={(e) =>
                                handleChangePropietario(e, el.id)
                              }
                              type="text"
                              name="nombre_completo"
                              className="p-2 w-[70%] outline-blue-800"
                            />
                            <label className="p-2 w-[2rem] bg-white text-black col-span-2">
                              <b>|</b>
                            </label>
                            <input
                              placeholder="Teléfono"
                              className="rounded-r-full1 p-2 w-[14rem] outline-blue-800"
                              onChange={(e) =>
                                handleChangePropietario(e, el.id)
                              }
                              value={el.telefono}
                              type="text"
                              name="telefono"
                            />
                            <label
                              onClick={() => fnSelectPropietario(el.id)}
                              className={`px-2 py-2 h-auto w-[3rem] ${
                                el.isSelected === undefined ||
                                el.isSelected === false
                                  ? "bg-[#0077bd]"
                                  : "bg-red"
                              } text-white rounded-r-full col-span-2`}
                            >
                              {el.isSelected === undefined ||
                              el.isSelected === false ? (
                                <AiOutlineCheck
                                  title={`Propietario #${index + 1}`}
                                  size={"1.1rem"}
                                />
                              ) : (
                                <AiOutlineClose
                                  title={`Propietario #${index + 1}`}
                                  size={"1.1rem"}
                                />
                              )}
                            </label>
                          </div>
                          <div className=" w-full  flex text-xs">
                            <label className="px-3 py-2 h-auto w-[2.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2mm">
                              <AiOutlineMail
                                title="email"
                                color={"white"}
                                className="w-[1.1rem] h-[1.1rem]"
                              />
                            </label>
                            <input
                              placeholder="Correo"
                              value={el.email}
                              onChange={(e) =>
                                handleChangePropietario(e, el.id)
                              }
                              type="text"
                              name="email"
                              className="p-2 w-[100%] outline-blue-800 rounded-r-full"
                            />
                          </div>
                        </div>
                      ))
                    )}
                    {dataDB.propietarios.filter((el) => el.isSelected === true)
                      .length !== 0 ? (
                      <div className="grid space-x-2">
                        <div className=" w-full flex text-sx">
                          <label className="px-3 py-3 h-auto w-full rounded-l-full1 col-span-2">
                            <b className="txt-red-c62608">Importante:</b>{" "}
                            <b>
                              {
                                dataDB.propietarios.filter(
                                  (el) => el.isSelected === true
                                ).length
                              }{" "}
                            </b>{" "}
                            {dataDB.propietarios.filter(
                              (el) => el.isSelected === true
                            ).length === 1
                              ? "propietario se moverá a Leads"
                              : "propietarios se moverán a Leads"}
                          </label>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </fieldset>
                </div>
              </div>

              <div className="bg-[#c7dfee] rounded-2xl p-5 space-y-2 h-full">
                <h1 className="text-lg text-[#0077bd] font-bold">
                  Histórico sucesos
                </h1>

                <div className="grid grid-cols-2 space-x-2">
                  <div className=" w-full flex text-xs">
                    <label className="p-2 h-min w-[8rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                      Next step
                    </label>
                    <input
                      value={dataDB.next_step}
                      onChange={handleChange}
                      type="date"
                      name="next_step"
                      className="rounded-r-full p-2 w-[100%] outline-blue-800"
                    />
                  </div>
                </div>

                <div className="w-full flex text-ms">
                  <label className="px-4 py-2 h-auto w-[3.5rem] bg-[#0077bd] text-white rounded-l-full col-span-2">
                    <span className="display-icon-error">
                      <AiOutlineComment title="Comentario" size={"1.5rem"} />{" "}
                      <span style={{ color: "red" }} className="field-required">
                        {" "}
                        *{" "}
                      </span>
                    </span>
                  </label>
                  <textarea
                    placeholder="Ingresar comentarios"
                    defaultValue={dataDB.comentario_suceso}
                    onChange={handleChange}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = target.scrollHeight + "px";
                    }}
                    className="p-3 w-[100%] outline-blue-800 border-none resize-none"
                    name="comentario_suceso"
                    style={{ overflow: "hidden", borderRadius: "0px" }}
                  ></textarea>{" "}
                </div>

                <div className="w-full max-h-[30rem] min-h-[27rem] p-3 overflow-y-scroll space-y-3">
                  {listSucesos.length === 0 ? (
                    <div className="bg-white w-full h-auto p-3 rounded-lg">
                      No existen registros!!
                    </div>
                  ) : (
                    listSucesos.map((el, index) => (
                      <div
                        key={`hst-${index}`}
                        className="bg-white w-full h-auto p-3 rounded-lg"
                      >
                        {`${el.comentario}`}
                        <div className="text-sm w-full text-blue-800 font-semibold text-right">
                          {`${el.responsable}, `}{" "}
                          <span className=" font-extrabold1">{`${el.fecha_creacion_short}`}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ButtonContainerVertical>
          <FloatButton
            disabledEvent={true}
            stateDisabled={loadingBtnActionSave}
            title="Guardar"
            handler={handleSave}
            Icon={AiFillSave}
          />
          <FloatButton
            disabledEvent={true}
            stateDisabled={loadingBtnActionDelete}
            title="Eliminar"
            handler={handleDelete}
            Icon={FaTrashAlt}
          />
          <FloatButton
            title="Cancelar"
            handler={handleCancel}
            Icon={MdCancel}
          />
        </ButtonContainerVertical>
      </div>
    </Layout>
  );
};

export default LeadId;
