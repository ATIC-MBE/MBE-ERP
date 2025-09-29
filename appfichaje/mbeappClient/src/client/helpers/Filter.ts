import { JSONObject } from "../types/globalTypes"
import UtilCustomInstance from "./UtilCustom"

class Filter {
    constructor() {}

    setLead(data: JSONObject): void {
        let _estatus = parseInt(data.estatus.toString() || '-2')
        // let _tipoLead = data.tipo_lead && data.tipo_lead === '-2' ? '-2' : data.tipo_lead
        localStorage.setItem("ns_start", data.ns_start || '')
        localStorage.setItem("ns_end", data.ns_end || '')
        localStorage.setItem("idresponsable", data.idresponsable || '0')
        localStorage.setItem("tipo_lead", data.tipo_lead)
        localStorage.setItem("estatus", _estatus.toString())
        localStorage.setItem("telefono", data.telefono || '')
        localStorage.setItem("persona", data.persona || '')
        localStorage.setItem("search_all", data.search_all || '')
    }

    getLead(): JSONObject {
        return {
                ns_start: localStorage.getItem('ns_start') === undefined || localStorage.getItem('ns_start') === null ? '' : localStorage.getItem('ns_start'),
                ns_end: localStorage.getItem('ns_end') === undefined || localStorage.getItem('ns_end') === null ? '' : localStorage.getItem('ns_end'),
                idresponsable: localStorage.getItem('idresponsable') === undefined || localStorage.getItem('idresponsable') === null ? 0 : parseInt(localStorage.getItem('idresponsable')!),
                tipo_lead: localStorage.getItem('tipo_lead') === undefined || localStorage.getItem('tipo_lead') === null ? '' : localStorage.getItem('tipo_lead'),
                estatus: localStorage.getItem('estatus') === undefined || localStorage.getItem('estatus') === null ? 1 : parseInt(localStorage.getItem('estatus')!),
                telefono: localStorage.getItem('telefono') === undefined || localStorage.getItem('telefono') === null ? '' : localStorage.getItem('telefono'),
                persona: localStorage.getItem('persona') === undefined || localStorage.getItem('persona') === null ? '' : localStorage.getItem('persona'),
                search_all: localStorage.getItem('search_all') === undefined || localStorage.getItem('search_all') === null ? '' : localStorage.getItem('search_all')
        }
    }

    setMyLead(data: JSONObject): void {
        // let _tipoLead = data.tipo_lead === 'Todos' ? '' : (data.tipo_lead || 'Na')
        localStorage.setItem("ml_ns_start", data.ns_start || '')
        localStorage.setItem("ml_ns_end", data.ns_end || '')
        localStorage.setItem("ml_idresponsable", data.idresponsable || '0')
        localStorage.setItem("ml_tipo_lead", data.tipo_lead)
        localStorage.setItem("ml_telefono", data.telefono || '')
        localStorage.setItem("ml_persona", data.persona || '')
        localStorage.setItem("ml_search_all", data.search_all || '')
    }

    getMyLead(): JSONObject {
        return {
                ns_start: localStorage.getItem('ml_ns_start') === undefined || localStorage.getItem('ml_ns_start') === null ? '' : localStorage.getItem('ml_ns_start'),
                ns_end: localStorage.getItem('ml_ns_end') === undefined || localStorage.getItem('ml_ns_end') === null ? '' : localStorage.getItem('ml_ns_end'),
                idresponsable: localStorage.getItem('ml_idresponsable') === undefined || localStorage.getItem('ml_idresponsable') === null ? 0 : parseInt(localStorage.getItem('ml_idresponsable')!),
                tipo_lead: localStorage.getItem('ml_tipo_lead') === undefined || localStorage.getItem('ml_tipo_lead') === null ? '' : localStorage.getItem('ml_tipo_lead'),
                telefono: localStorage.getItem('ml_telefono') === undefined || localStorage.getItem('ml_telefono') === null ? '' : localStorage.getItem('ml_telefono'),
                persona: localStorage.getItem('ml_persona') === undefined || localStorage.getItem('ml_persona') === null ? '' : localStorage.getItem('ml_persona'),
                search_all: localStorage.getItem('ml_search_all') === undefined || localStorage.getItem('ml_search_all') === null ? '' : localStorage.getItem('ml_search_all'),
        }
    }

    setPrescriptor(data: JSONObject): void {
        localStorage.setItem("search_all_pre", data.search_all || '')
    }

    getPrescriptor(): JSONObject {
        return {
            search_all: localStorage.getItem('search_all_pre') === undefined || localStorage.getItem('search_all_pre') === null ? '' : localStorage.getItem('search_all_pre'),
        }
    }

    setPropietario(data: JSONObject): void{
        // localStorage.setItem("telefono_pro", data.telefono || '')
        // localStorage.setItem("persona_pro", data.persona || '')
        localStorage.setItem("search_all_pro", data.search_all || '')
    }
    getPropietario(): JSONObject{
        return{
            // telefono:localStorage.getItem('telefono_pro')  === undefined || localStorage.getItem('telefono_pro') === null ? '' : localStorage.getItem('telefono_pro'),
            // persona:localStorage.getItem('persona_pro') === undefined || localStorage.getItem('persona_pro') === null ? '' : localStorage.getItem('persona_pro')
            search_all: localStorage.getItem('search_all_pro') === undefined || localStorage.getItem('search_all_pro') === null ? '' : localStorage.getItem('search_all_pro'),
        }
    }

    /**
     * Filtros SET Layout Piso Comercial [RMG]
     * @param data 
     */
    setPisoComercial(data: JSONObject): void {
        localStorage.setItem("search_all_pc", data.search_all || '')
        localStorage.setItem("ds_nro_dormitorios_pc", data.ds_nro_dormitorios || -1)
        localStorage.setItem("cp_ocupacion_maxima_pc", data.cp_ocupacion_maxima || -1)
        localStorage.setItem("ds_nro_camas_pc", data.ds_nro_camas || -1)
        localStorage.setItem("bs_nro_banios_pc", data.bs_nro_banios || -1)
        localStorage.setItem("total_pc", data.total || -1)
        localStorage.setItem("total_start_pc", data.total_start || -1)
        localStorage.setItem("total_end_pc", data.total_end || -1)
        localStorage.setItem("estado_general_pc", data.estado_general || -2)
    }

    /**
     * Filtros GET Layout Piso Comercial [RMG]
     * @returns 
     */
    getPisoComercial(): JSONObject {
        return {
            search_all: localStorage.getItem('search_all_pc') === undefined || localStorage.getItem('search_all_pc') === null ? '' : localStorage.getItem('search_all_pc'),
            ds_nro_dormitorios: localStorage.getItem('ds_nro_dormitorios_pc') === undefined || localStorage.getItem('ds_nro_dormitorios_pc') === null ? -1 : localStorage.getItem('ds_nro_dormitorios_pc'),
            cp_ocupacion_maxima: localStorage.getItem('cp_ocupacion_maxima_pc') === undefined || localStorage.getItem('cp_ocupacion_maxima_pc') === null ? -1 : localStorage.getItem('cp_ocupacion_maxima_pc'),
            ds_nro_camas: localStorage.getItem('ds_nro_camas_pc') === undefined || localStorage.getItem('ds_nro_camas_pc') === null ? -1 : localStorage.getItem('ds_nro_camas_pc'),
            bs_nro_banios: localStorage.getItem('bs_nro_banios_pc') === undefined || localStorage.getItem('bs_nro_banios_pc') === null ? -1 : localStorage.getItem('bs_nro_banios_pc'),
            total: localStorage.getItem('total_pc') === undefined || localStorage.getItem('total_pc') === null ? -1 : localStorage.getItem('total_pc'),
            total_start: localStorage.getItem('total_start_pc') === undefined || localStorage.getItem('total_start_pc') === null ? -1 : localStorage.getItem('total_start_pc'),
            total_end: localStorage.getItem('total_end_pc') === undefined || localStorage.getItem('total_end_pc') === null ? -1 : localStorage.getItem('total_end_pc'),
            estado_general: localStorage.getItem('estado_general_pc') === undefined || localStorage.getItem('estado_general_pc') === null ? -2 : localStorage.getItem('estado_general_pc'),
        }
    }

    /**
     * Filtros SET Layout Control limpieza [ADE]
     * @param data 
     */
    setControlLimpieza(data: JSONObject): void {
        localStorage.setItem("search_all_cl", data.search_all || '')
        localStorage.setItem("m_start_cl", data.m_start || '')
        localStorage.setItem("m_end_cl", data.m_end || '')
        localStorage.setItem("iduser_cl", data.iduser || '0')
    }

    /**
     * Filtros GET Layout Control limpieza [RMG]
     * @returns 
     */
    getControlLimpieza(): JSONObject {
        return {
            search_all: localStorage.getItem('search_all_cl') === undefined || localStorage.getItem('search_all_cl') === null ? '' : localStorage.getItem('search_all_cl'),
            m_start: localStorage.getItem('m_start_cl') === undefined || localStorage.getItem('m_start_cl') === null ? '' : localStorage.getItem('m_start_cl'),
            m_end: localStorage.getItem('m_end_cl') === undefined || localStorage.getItem('m_end_cl') === null ? '' : localStorage.getItem('m_end_cl'),
            iduser: localStorage.getItem('iduser_cl') === undefined || localStorage.getItem('iduser_cl') === null ? 0 : parseInt(localStorage.getItem('iduser_cl')!),
        }
    }

     /**
     * Filtros SET Layout Fichaje
     * @param data 
     */
     setFichaje(data: JSONObject): void {
          localStorage.setItem("search_all_fo", data.search_all || '')
          localStorage.setItem("m_start_fo", UtilCustomInstance.normalizeDateInput(data.m_start as string) || '')
          localStorage.setItem("m_end_fo", UtilCustomInstance.normalizeDateInput(data.m_end as string) || '')
        
    }

     /**
     * Filtros GET Layout Control limpieza [RMG]
     * @returns 
     */
        getFichaje(): JSONObject {
            const storedStart = localStorage.getItem('m_start_fo')
            const storedEnd = localStorage.getItem('m_end_fo')
            const normalizedStart = UtilCustomInstance.normalizeDateInput(storedStart)
            const normalizedEnd = UtilCustomInstance.normalizeDateInput(storedEnd)
            return {
                search_all: localStorage.getItem('search_all_fo') === undefined || localStorage.getItem('search_all_fo') === null ? '' : localStorage.getItem('search_all_fo'),
                m_start: normalizedStart || UtilCustomInstance.getDateCurrentISO(),
                m_end: normalizedEnd || UtilCustomInstance.getDateCurrentISO(),
            
            }
        }

    /**
    * Filtros SET layout Devices
    * @param data 
    */
    setDevice(data:JSONObject): void {
    localStorage.setItem("search_all_atic", data.search_all || '')
    }

    /**
     * Filtros GET layout Devices
     * @returns 
     */
    getDevice():JSONObject {
        return{
            search_all:localStorage.getItem('search_all_atic') === undefined || localStorage.getItem('search_all_atic') === null ? '' : localStorage.getItem('search_all_atic'),
        }
    }

    /**
     * Filtros SET layout Key
     * @param data 
     */
    setKey(data:JSONObject): void {
        localStorage.setItem("search_all_key", data.search_all || '')
    }

    /**
     * Filtros GET layout Key
     * @returns 
     */
    getKey():JSONObject {
        return{
            search_all:localStorage.getItem('search_all_key') === undefined || localStorage.getItem('search_all_key') === null ? '' : localStorage.getItem('search_all_key'),
        }
    }
    
    /**
     * 
     * @param data 
     */
    setUsersRRHH(data: JSONObject): void{
        localStorage.setItem("search_all_users_rrhh", data.search_all || '')
    }

    /**
     * 
     * @returns 
     */
    getUsersRRHH(): JSONObject{
        return{
            search_all: localStorage.getItem('search_all_users_rrhh') === undefined || localStorage.getItem('search_all_users_rrhh') === null ? '' : localStorage.getItem('search_all_users_rrhh'),
        }
    }


      /**
     * 
     * @param data 
     */
      setVacaciones(data: JSONObject): void{
        localStorage.setItem("search_all_vacaciones", data.search_all || '')
    }

    /**
     * 
     * @returns 
     */
    getVacaciones(): JSONObject{
        return{
            search_all: localStorage.getItem('search_all_vacaciones') === undefined || localStorage.getItem('search_all_vacaciones') === null ? '' : localStorage.getItem('search_all_vacaciones'),
        }
    }


     /**
     * 
     * @param data 
     */
     setEsquema(data: JSONObject): void{
        localStorage.setItem("search_all_esquema", data.search_all || '')
    }

    /**
     * 
     * @returns 
     */
    getEsquema(): JSONObject{
        return{
            search_all: localStorage.getItem('search_all_esquema') === undefined || localStorage.getItem('search_all_esquema') === null ? '' : localStorage.getItem('search_all_esquema'),
        }
    }

    /**
     * 
     * @param data 
     */
    setPerfilesDN(data: JSONObject): void{
        localStorage.setItem("search_all_perfil_dn", data.search_all || '')
    }

    /**
     * 
     * @returns 
     */
    getPerfilesDN(): JSONObject{
        return{
            search_all: localStorage.getItem('search_all_perfil_dn') === undefined || localStorage.getItem('search_all_perfil_dn') === null ? '' : localStorage.getItem('search_all_perfil_dn'),
        }
    }

    setPisoColaborador(data: JSONObject): void {
        localStorage.setItem("search_all_col", data.search_all || '')
        localStorage.setItem("ds_nro_dormitorios_col", data.ds_nro_dormitorios || -1)
        localStorage.setItem("cp_ocupacion_maxima_col", data.cp_ocupacion_maxima || -1)
        localStorage.setItem("bs_nro_banios_col", data.bs_nro_banios || -1)
        localStorage.setItem("total_start_col", data.total_start || -1)
        localStorage.setItem("total_end_col", data.total_end || -1)
    }

    /**
     * Filtros GET Layout Piso Comercial [RMG]
     * @returns 
     */
    getPisoColaborador(): JSONObject {
        return {
            search_all: localStorage.getItem('search_all_col') === undefined || localStorage.getItem('search_all_col') === null ? '' : localStorage.getItem('search_all_col'),
            ds_nro_dormitorios: localStorage.getItem('ds_nro_dormitorios_col') === undefined || localStorage.getItem('ds_nro_dormitorios_col') === null ? -1 : localStorage.getItem('ds_nro_dormitorios_col'),
            cp_ocupacion_maxima: localStorage.getItem('cp_ocupacion_maxima_col') === undefined || localStorage.getItem('cp_ocupacion_maxima_col') === null ? -1 : localStorage.getItem('cp_ocupacion_maxima_col'),
            bs_nro_banios: localStorage.getItem('bs_nro_banios_col') === undefined || localStorage.getItem('bs_nro_banios_col') === null ? -1 : localStorage.getItem('bs_nro_banios_col'),
            total_start: localStorage.getItem('total_start_col') === undefined || localStorage.getItem('total_start_col') === null ? -1 : localStorage.getItem('total_start_col'),
            total_end: localStorage.getItem('total_end_col') === undefined || localStorage.getItem('total_end_col') === null ? -1 : localStorage.getItem('total_end_col'),
        }
    }

    setPisoShare(data: JSONObject): void {
        localStorage.setItem("search_all_share", data.search_all || '')
    }

    /**
     * Filtros GET Layout Pisos de todos los perfiles [ALL]
     * @returns 
     */
    getPisoShare(): JSONObject {
        return {
            search_all: localStorage.getItem('search_all_share') === undefined || localStorage.getItem('search_all_share') === null ? '' : localStorage.getItem('search_all_share'),
        }
    }

    setPisosDA(data: JSONObject): void {
        localStorage.setItem("search_all_da", data.search_all || '')
    }

    /**
     * Filtros GET Layout Pisos de todos los perfiles [ALL]
     * @returns 
     */
    getPisosDA(): JSONObject {
        return {
            search_all: localStorage.getItem('search_all_da') === undefined || localStorage.getItem('search_all_da') === null ? '' : localStorage.getItem('search_all_da'),
        }
    }

    /**
     * Filtros SET Layout Limite precio [RMG]
     * @param data 
     */
    setLimitePrecio(data: JSONObject): void {
        localStorage.setItem("search_all_lp", data.search_all || '')
        localStorage.setItem("m_start_lp", data.m_start || '')
        localStorage.setItem("m_end_lp", data.m_end || '')
        localStorage.setItem("state_sol_lp", data.state_sol || '0')
    }

    /**
     * Filtros GET Layout Control limpieza [RMG]
     * @returns 
     */
    getLimitePrecio(): JSONObject {
        return {
            search_all: localStorage.getItem('search_all_lp') === undefined || localStorage.getItem('search_all_lp') === null ? '' : localStorage.getItem('search_all_lp'),
            m_start: localStorage.getItem('m_start_lp') === undefined || localStorage.getItem('m_start_lp') === null ? '' : localStorage.getItem('m_start_lp'),
            m_end: localStorage.getItem('m_end_lp') === undefined || localStorage.getItem('m_end_lp') === null ? '' : localStorage.getItem('m_end_lp'),
            iduser: localStorage.getItem('state_sol_lp') === undefined || localStorage.getItem('state_sol_lp') === null ? 0 : parseInt(localStorage.getItem('state_sol_lp')!),
        }
    }

    /**
     * Delete todas las variables de filtro del localstorage
     */
    resetLogout(): void {
        // Lead
        localStorage.removeItem('ns_start')
        localStorage.removeItem('ns_end')
        localStorage.removeItem('idresponsable')
        localStorage.removeItem('tipo_lead')
        localStorage.removeItem('estatus')
        localStorage.removeItem('telefono')
        localStorage.removeItem('persona')
        localStorage.removeItem('search_all')

        // MyLead
        localStorage.removeItem('ml_ns_start')
        localStorage.removeItem('ml_ns_end')
        localStorage.removeItem('ml_idresponsable')
        localStorage.removeItem('ml_tipo_lead')
        localStorage.removeItem('ml_telefono')
        localStorage.removeItem('ml_persona')
        localStorage.removeItem('ml_search_all')

        // filtros de prescriptores
        localStorage.removeItem('search_all_pre')

        // filtros de propietarios
        // localStorage.removeItem('telefono_pro')
        // localStorage.removeItem('persona_pro')
        localStorage.removeItem('search_all_pro')

        // filtros piso comercial [RMG]
        localStorage.removeItem('search_all_pc')
        localStorage.removeItem('ds_nro_dormitorios_pc')
        localStorage.removeItem('cp_ocupacion_maxima_pc')
        localStorage.removeItem('ds_nro_camas_pc')
        localStorage.removeItem('bs_nro_banios_pc')
        localStorage.removeItem('total_pc')
        localStorage.removeItem('total_start_pc')
        localStorage.removeItem('total_end_pc')
        localStorage.removeItem('estado_general_pc')

        // filtros control [ATIC]
        localStorage.removeItem('search_all_atic')
        localStorage.removeItem('search_all_key')

        // filtros control limpieza [ADE]
        localStorage.removeItem('search_all_cl')
        localStorage.removeItem('m_start_cl')
        localStorage.removeItem('m_end_cl')
        localStorage.removeItem('iduser_cl')

        // filtros fichaje [rrhh]
        localStorage.removeItem('search_all_fo')
        localStorage.removeItem('m_start_fo')
        localStorage.removeItem('m_end_fo')

        // filtros RRHH
        localStorage.removeItem('search_all_users_rrhh')

        // filtros COLABORADOR
        localStorage.removeItem('search_all_col')
        localStorage.removeItem('ds_nro_dormitorios_col')
        localStorage.removeItem('cp_ocupacion_maxima_col')
        localStorage.removeItem('bs_nro_banios_col')
        localStorage.removeItem('total_start_col')
        localStorage.removeItem('total_end_col')

        // filtros PISOS share
        localStorage.removeItem("search_all_share")

        // filtros Pisos DA
        localStorage.removeItem("search_all_da")

        // filtros Limite precio
        localStorage.removeItem('search_all_lp')
        localStorage.removeItem('m_start_lp')
        localStorage.removeItem('m_end_lp')
        localStorage.removeItem('state_sol_lp')

        //filtros Vacaciones

        localStorage.removeItem('search_all_vacaciones')

        //filtros Esquema
        localStorage.removeItem("search_all_esquema")
    }
}

const FilterInstance = new Filter()
Object.freeze(FilterInstance)

export default FilterInstance