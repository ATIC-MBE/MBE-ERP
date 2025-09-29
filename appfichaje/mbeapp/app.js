// Socket client
//const io = require("socket.io-client");

//Librerias
const app = require("express")()
const express = require("express")
const fetch = require('node-fetch')

require("dotenv").config()
args = process.argv.slice(2)
PORT = args[0] == "dev" ? process.env.DEVPORT : process.env.PORT

// const { Client: ClientDB } = require('pg')

// SIN USO

const bodyParser = require("body-parser")
const exphbs = require("express-handlebars")
const Handlebars = require('handlebars')
// const session = require('express-session')
const session = require('cookie-session')

const ewelink = require('ewelink-api');

var Logs = require("./modules/Logs")
const userDataJSON = require("./modules/data/userData.json")
const pisoDataJSON = require("./modules/data/pisosData.json")
const actionsCardDataJSON = require("./modules/data/actionsCardData.json")
const locationCardDataJSON = require("./modules/data/locationCard.json")
const typeCardDataJSON = require("./modules/data/typeCard.json")
const ApartmentServiceInstance = require("./modules/services/ApartmentService")
const Util = require("./modules/js/Util")
const KeyServiceInstance = require("./modules/services/KeyService")
const LogServiceInstance = require("./modules/services/LogService")
const TypeCodeServiceInstance = require("./modules/services/TypeCodeService")
const EWeLinkServiceInstance = require("./modules/services/EWeLinkService")
const AuthServiceInstance = require("./modules/services/AuthService")
const ApiConfigurationInstance = require("./modules/services/ApiConfiguration")
const FirstLoginServiceInstance = require("./modules/services/FirstLoginService")
const { Constants, RouteApp, getDataGitHub,
    encryptData, getDevicesServer, getLabelAction,
    formatDateSQLToScreen,
    getLabelTypeCard, processDataLog, getCardByTypeKey } = require("./modules/js/Util")()

try {
    Logs.init() // quitar solo para login de usuario y pisos
} catch (err) {
    console.log('error al iniciar google-spreadsheet');
}

// ======= SOCKETS ON SERVIDOR [TEMPORAL SIN USO] =========
    // Inicializar socket, indicandole cual esta haciendo la conexión al TCP
    // const socketIo = io(Constants().URL_SERVER, {
    //     query: {
    //         "dslave": "mchapp"
    //     }
    // })

    // // Reconexion por errores de sockets
    // socketIo.on("connect_error", () => {
    //     console.log('error connect')
    //     setTimeout(() => {
    //         socketIo.connect()
    //     }, 1000)
    // })

    // // Reconexion por salida del servidor
    // socketIo.on("disconnect", (reason) => {
    //     if (reason === "io server disconnect") {
    //         console.log('server podrido')
    //         // the disconnection was initiated by the server, you need to reconnect manually
    //         socketIo.connect();
    //     }
    //     // else the socket will automatically try to reconnect
    // })

    // // Captura evento servidor
    // socketIo.on("changeqr", async (from, msg) => {
    //     console.log(from, msg)
    // })
// ======= END SOCKETS =======

// Variables generales que guardan registro de usuarios y pisos
var users;
let pisos = [];

app.use(express.static('public'));

// app.use(session({
//     secret: "This is a secret",
//     resave: false,
//     saveUninitialized: false
// }))

// 86400000 24h  82800000 23h  129600000 1dia y medio
app.use(session({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false,
    maxAge: 129600000
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Funciones a usar en el HTML
/*const hbs = exphbs.create({
    helpers: {
        actionOL: TestBluetooth.actionOpenLock
    }
});*/

app.engine("handlebars", exphbs.engine())
//app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")

// app.engine("handlebars", exphbs.engine)

Handlebars.registerHelper('eachPiso', function (context, options) {
    var fn = options.fn, inverse = options.inverse, ctx;
    var ret = "";

    let _startFlag = true
    let _endFlag = false
    let _init = true
    let _nroCardsRow = 2

    if (context && context.length > 0) {
        for (var i = 0, j = context.length; i < j; i++) {
            ctx = Object.create(context[i]);
            // Clone data
            // ctx = { ...Object.create(context[i]) }
            ctx.id_dispositivo_ref = context[i].id_dispositivo_ref,
                ctx.id = parseInt(context[i].id || '0')
            ctx.etiqueta = context[i].etiqueta || ''
            ctx.ciudad = context[i].ciudad || ''
            ctx.codigo_postal = context[i].codigo_postal || ''
            ctx.direccion = context[i].direccion || ''
            ctx.nro_edificio = context[i].nro_edificio || ''
            ctx.nro_piso = context[i].nro_piso || ''
            ctx.codigo = context[i].codigo || ''
            ctx.index = i + 1;
            ctx.keys = context[i].keys || []
            ctx.existCards = (context[i].keys || []).length !== 0

            // Seccion para cargar el codigo actual
            let codeOBJ = {
                codigo: context[i].codigo || undefined,
                startTime: context[i].timestamp_inicio || undefined,
                endTime: context[i].timestamp_fin || undefined,
                fechaVigInicio: context[i].fecha_vig_inicio || undefined,
                fechaVigFin: context[i].fecha_vig_fin || undefined
            }

            let { code = '', startTime = '', endTime = '', existCode = false, isCodeActive = false } = {}

            if (codeOBJ.codigo) {
                existCode = true
                code = codeOBJ.codigo
                startTime = formatDateSQLToScreen(codeOBJ.fechaVigInicio)
                endTime = formatDateSQLToScreen(codeOBJ.fechaVigFin)
                try {
                    let endTimeNumber = (codeOBJ.endTime) ? parseInt(codeOBJ.endTime) * 1000 : new Date().getTime()
                    let timeCurrent = new Date().getTime()
                    if (timeCurrent < endTimeNumber) isCodeActive = true
                } catch (err) { }
            }

            ctx.code = code
            ctx.existCode = existCode
            ctx.isCodeActive = isCodeActive

            // Definir corte, nro de tarjetas por fila
            if (_init) {
                ctx.showrowstart = _startFlag
                ctx.showrowend = _endFlag
                _init = !_init
            } else if ((i + 1) % _nroCardsRow !== 0) {
                ctx.showrowstart = false
                ctx.showrowend = false
            } else if ((i + 1) % _nroCardsRow === 0) {
                ctx.showrowstart = !_startFlag
                ctx.showrowend = !_endFlag
                _init = !_init
            }
            ret = ret + fn(ctx);
        }
    } else {
        ret = inverse(this);
    }
    return ret;
});

// SIN USO
// const getUsersRepo = async () => {
//     try {
//         users = await Logs.get()
//         if (users.length === 0) throw 'Error no hay datos'
//     } catch (err) {
//         console.log('Error al obtener usuarios desde google-spreadsheet');
//         try {
//             users = await getDataGitHub(Constants().URL_GITHUB_USERS_DATA)
//         } catch (err) {
//             console.log('Error al obtener usuarios desde GitHub');
//             users = userDataJSON;
//         }
//     }
// }

const getPisosRepo = async () => {
    try {
        // pisos = await Logs.getPisos()
        pisos = (await ApartmentServiceInstance.getAll()).data.filter(el => el.estado === 1)
    } catch (err) {
        console.log('Error al obtener pisos from DB');
        try {
            pisos = await getDataGitHub(Constants().URL_GITHUB_PISOS_DATA)
        } catch (err) {
            console.log('Error al obtener pisos desde GitHub');
            pisos = pisoDataJSON;
        }
    }
}

const getPisosRepoByDepartment = async (nameDepartment) => {
    try {
        pisos = (await ApartmentServiceInstance.getAllByDepartment(nameDepartment)).data.filter(el => el.estado === 1)
    } catch (err) {
        console.log('Error al obtener pisos from DB');
        try {
            pisos = await getDataGitHub(Constants().URL_GITHUB_PISOS_DATA)
        } catch (err) {
            console.log('Error al obtener pisos desde GitHub');
            pisos = pisoDataJSON;
        }
    }
}

//Middlewares
var auth = async (req, res, next) => {
    // Esta validación de login solo es para el tema de fichaje. [Deberia habilitarse para todo el mch, cuando se protega los endpoinst publicos]
    if (`${req.route.path}`.includes("fichar")) {
        req.session.pathprev = req.route.path
        req.session.qr = req.query.qr

        const _tokenIsValid = await AuthServiceInstance.tokenIsValid(req.session.token)
        //console.log('token is valida: ', _tokenIsValid)

        // verificar token y si esta podrido o a punto de podrirse -> solicitar login
        if( !_tokenIsValid ) {
            req.session.token = undefined
            req.session.name = undefined
            req.session.role = undefined
            req.session.id = undefined
            req.session.department = undefined
        }
    }
    
    if (req.session && req.session.name != undefined)
        return next();
    else
        return res.redirect("/qrentry");
}

var nAuth = (req, res, next) => {
    const { routePublic } = RouteApp();
    // console.log(req.route.path)
    if (req.session && req.session.name != undefined) {
        if (routePublic.includes(req.route.path)) return next();
        else return res.redirect("/");
    } else
        return next();
}

//Chequea el rol de los usuarios
function checkRole(roles) {
    return (req, res, next) => {
        if (inArray(req.session.role, roles) == true)
            return next();
        else
            return res.send("Cant acces this page")
    }
}
function inArray(el, array) {
    var res = false
    array.forEach(element => {
        if (el == element) res = true

    });
    return res
}


//Metodos
//Views
app.get("/login", nAuth, (req, res) => {
    // Capture QR token from query parameter for check-in flow
    const qrToken = req.query.qr
    if (qrToken) {
        req.session.qr = qrToken
        req.session.pathprev = "/fichar"
        console.log('QR token captured for check-in:', qrToken)
    }
    res.render("login")
})

/**
 * QR Entry page for check-in - generates QR codes that redirect to login
 */
app.get("/qrentry", (req, res) => {
    res.render("qrentry")
})

/**
 * Renderizado a pagina principal
 */
app.get("/", auth, (req, res) => {
    const _departmentLogin = req.session.department

    // Verificación previa para el acceso de GAVIR [VERIFICACION TEMPORAL], role Propietario
    const _isPropietarioLogin = req.session.role === 'propietario'
    const _urlGestionPisos = _isPropietarioLogin ? 'mispisos' : 'pisosSender'

    res.render("index", {
        noPropietario: !_isPropietarioLogin,
        urlGestionPisos: _urlGestionPisos
    })
})

/**
 * EndPoint: Ruta para redirigir a página departamental MYD
 */
app.get("/myd", auth, checkRole(["myd", "mydmaster"]), async (req, res) => {
    // Redirigir al cliente Next.js en puerto 3000 (o puerto configurado)
    const clientUrl = process.env.CLIENT_URL || 'http://185.252.233.57:3000';
    res.redirect(`${clientUrl}/myd`);
})

/**
 * EndPoint: Metodo para controlar la gestión de dispositivos de la oficina
 * OLD: "Admin", "Limpieza", "Oficina", "Root"
 */
app.get("/sender", auth, checkRole(["admin",
                                    "aca", "acamaster",
                                    "superadmin",
                                    "atic", "aticmaster",
                                    "rrhh", "rrhhmaster",
                                    "ceo",
                                    "ade", "ademaster",
                                    "myd", "mydmaster"]), async (req, res) => {
    const { URL_SERVER: urlServer, deviceOficina } = Constants();
    const scripts = [{ script: '/js/Constants.js' },
    { script: '/js/Util.js' },
    { script: '/js/GestionOficina.js' }];
    const user = req.session.name;

    await getPisosRepo()

    let devOficina = pisos.filter(el => el.id_dispositivo_ref.toLowerCase() === deviceOficina.toLowerCase())[0] ||
    {
        id: 0,
        id_dispositivo_ref: deviceOficina,
        existDevice: false,
        dispositivos: []
    }
    let codeDevice = devOficina.id_dispositivo_ref

    const ldevicesSTR = [...devOficina.dispositivos].map(el => el.type.toString().toLowerCase()).join('|')

    const isWelock = ldevicesSTR.includes(Util().Constants().typeDevice_Lock)
    const isSONOFF = ldevicesSTR.includes(Util().Constants().typeDevice_Sonoff)
    const isPortal = ldevicesSTR.includes(Util().Constants().typeDevice_Telefonillo)

    let [idDeviceLock, idDevicePortal, idDeviceSonoff, idPiso] = [0, 0, 0, (devOficina.id || 0)]
    let lDevicesSonoff = []

    if (isWelock) idDeviceLock = devOficina.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Lock)[0].id
    if (isPortal) idDevicePortal = devOficina.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Telefonillo)[0].id
    if (isSONOFF) {
        idDeviceSonoff = devOficina.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Sonoff)[0].id
        lDevicesSonoff = [...(devOficina.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Sonoff))]
    }

    let [nameStateSONOFF, imgStateSONOFF] = ['Desconectado', 'bombillaDISC.png']

    res.render('sender', {
        title: 'MyCityHome',
        scripts: scripts,
        codeDevice: codeDevice, // deviceOficina   
        urlServer,
        user,
        stateSONOFF: 'NA',
        sonoffExist: isSONOFF,
        nameStateSONOFF,
        imgStateSONOFF,
        isPortal,
        idDevicePortal,
        isWelock,
        idDeviceLock,
        isSONOFF,
        idDeviceSonoff,
        lIdsDevices: lDevicesSonoff.map(el => el.id),
        lDevicesSonoff,
        idPiso
    });
})

/**
 * EndPoint: Metodo para cargar los pisos
 * OLD: "Admin", "Oficina", "Root"
 */
app.get("/pisosSender", auth, checkRole([   "admin", 
                                    "aca", "acamaster", 
                                    "superadmin", 
                                    "atic", "aticmaster", 
                                    "rrhh", "rrhhmaster",
                                    "ceo", 
                                    "ade", "ademaster",
                                    "myd", "mydmaster"]), async (req, res) => {
    const scripts = [{ script: '/js/PisoSender.js' }];

    await getPisosRepo()

    // Filtrar pisos: para atic se muestran todos los pisos, incluidos los test/prueba
    if (req.session.role !== 'atic') {
        pisos = pisos.filter(el => !(/(test|prueba).*/.test(el.id_dispositivo_ref.toString().trim().toLowerCase())))
    }

    warning = ''

    if (req.query.res) {
        warning = req.query.res == '0' ? `
        <div class="alert alert-success" role="alert">
            Solicitud enviada con exito
        </div>
        `: `
        <div class="alert alert-danger" role="alert">
            Este piso no se encuentra conectado
        </div>
        `
    }
    options = `<option data-id='0' selected value='0|NA'>Seleccionar Piso</option>`
    pisos.forEach(el => {
        options += `<option data-id='${el.id}' value='${el.id}|${el.id_dispositivo_ref.toString().trim()}'>${el.etiqueta.toString().trim()}</option>`
    })

    // let optionsLocks = `<option data-id='0' selected value='0|NA'>Seleccionar</option>`

    res.render("pisosSender", {
        options: options,
        warning,
        scripts: scripts,
    })
})

/**
 * EndPoint: Metodo para cargar el piso del propietario que lleva la gestion
 * ["Admin", "Oficina", "Root", "Propietario"]
 */
app.get("/mispisos", auth, checkRole(["propietario"]), async (req, res) => {
    const scripts = [{ script: '/js/PisoSender.js' }];

    const _departmentLogin = req.session.department

    await getPisosRepoByDepartment(_departmentLogin)

    // Filtar pisos: solo pisos que tienen lock
    // if (req.session.role !== 'Root') {
    //     pisos = pisos.filter(el => !(/(test|prueba).*/.test(el.id_dispositivo_ref.toString().trim().toLowerCase())))
    // }

    warning = ''

    if (req.query.res) {
        warning = req.query.res == '0' ? `
        <div class="alert alert-success" role="alert">
            Solicitud enviada con exito
        </div>
        `: `
        <div class="alert alert-danger" role="alert">
            Este piso no se encuentra conectado
        </div>
        `
    }
    options = `<option data-id='0' selected value='0|NA'>Seleccionar Piso</option>`
    pisos.forEach(el => {
        options += `<option data-id='${el.id}' value='${el.id}|${el.id_dispositivo_ref.toString().trim()}'>${el.etiqueta.toString().trim()}</option>`
    })

    // let optionsLocks = `<option data-id='0' selected value='0|NA'>Seleccionar</option>`

    res.render("mispisos", {
        options: options,
        warning,
        scripts: scripts,
        departmentLogin: _departmentLogin,
        pisos: pisos
    })
})

app.get("/access", (req, res) => {
    res.render('access')
})

/**
 * EndPoint: Metodo para encriptar contraseña online
 * ["Admin", "Root"]
 */
app.get("/encryptdata", auth, checkRole(["atic"]), (req, res) => {
    let txt = req.query.txt
    res.json({ txtencrypt: encryptData(txt) })
})

// View Pantalla de sugerencias
// Renderiza al formulario de SUGERENCIA
app.get("/sugerencias", nAuth, (req, res) => {
    res.render("sugerencias")
})

/**
 * Mostrar las manijas de un piso
 * ["Root", "Admin"]
 */
app.get("/getlocksbyflat", auth, checkRole(["admin", 
                                            "aca", "acamaster", 
                                            "superadmin", 
                                            "atic", "aticmaster", 
                                            "rrhh", "rrhhmaster",
                                            "ceo", 
                                            "ade", "ademaster",
                                            "myd", "mydmaster"]), async (req, res) => {
    const codeDevice = req.query.piso || '' // PARAM DESDE URL
    const idPiso = req.query.idpiso
    try {
        let pisoData = pisos.filter(el => el.id.toString().trim() === idPiso.trim())[0] ||
        {
            id: 0,
            etiqueta: codeDevice,
            id_dispositivo_ref: codeDevice,
            existDevice: false,
            dispositivos: []
        }
        let showLocks = false
        let _lDevicesLocks = []
        if (pisoData) {
            _lDevicesLocks = pisoData.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Lock)
            showLocks = _lDevicesLocks.length > 1
        }

        res.json({
            status: 1,
            data: _lDevicesLocks,
            showLocks
        })
    } catch (err) {
        res.json({ status: -1 });
    }
})

/**
 * EndPoint: Gestionar las acciones de la domotica del piso
 * ["Admin", "Oficina", "Root", "Propietario"]
 */
app.get("/gestionpisos", auth, checkRole([  "admin", 
                                            "aca", "acamaster", 
                                            "superadmin", 
                                            "atic", "aticmaster", 
                                            "rrhh", "rrhhmaster",
                                            "ceo", 
                                            "ade", "ademaster",
                                            "myd", "mydmaster"]), async (req, res) => {
    const { URL_SERVER: urlServer } = Constants()
    let lactionsCard = actionsCardDataJSON
    let llocationCard = locationCardDataJSON
    let ltypeCard = typeCardDataJSON
    const scripts = [{ script: '/js/Constants.js' },
    { script: '/js/Util.js' },
    { script: '/js/GestionPiso.js' }];

    // PARAM DESDE URL
    const codeDevice = req.query.piso || ''
    const _getIdPiso = req.query.idpiso || 0
    const _getIdDevice = req.query.iddevice || 0


    const user = req.session.name
    const rolUser = req.session.role
    const showFieldTypeCard = ["admin", "superadmin", "dn", "atic", "ceo", "dnmaster"].includes(rolUser)
    const showFieldTypeCode = ["admin", "superadmin", "dn", "atic", "ceo", "dnmaster"].includes(rolUser)
    const isRoot = ["admin", "superadmin", "dn", "atic", "ceo", "dnmaster"].includes(rolUser)

    let lTypesCodesDB = (await TypeCodeServiceInstance.getAll()).data
    let pisoData = pisos.filter(el => el.id.toString().trim() === _getIdPiso.toString().trim())[0] ||
    // let pisoData = pisos.filter(el => el.id_dispositivo_ref.trim() === codeDevice.trim())[0] || 
    {
        id: 0,
        etiqueta: codeDevice,
        id_dispositivo_ref: codeDevice,
        existDevice: false,
        dispositivos: []
    }
    pisoData = { existDevice: true, ...pisoData }
    const ldevicesSTR = [...pisoData.dispositivos].map(el => el.type.toString().toLowerCase()).join('|')

    const isWelock = ldevicesSTR.includes(Util().Constants().typeDevice_Lock)
    const isSONOFF = ldevicesSTR.includes(Util().Constants().typeDevice_Sonoff)
    const isPortal = ldevicesSTR.includes(Util().Constants().typeDevice_Telefonillo)

    let [idDeviceLock, idDevicePortal, idDeviceSonoff, idPiso] = [0, 0, 0, pisoData.id]
    let lDevicesSonoff = []
    // Por ahora solo carga la información de un solo dispostivo type: lock
    // if ( isWelock ) idDeviceLock = pisoData.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Lock)[0].id
    let _deviceLockSel = {}
    if (isWelock) {
        _deviceLockSel = (_getIdDevice) ?
            pisoData.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Lock &&
                el.id.toString().trim() === _getIdDevice.toString().trim())[0]
            :
            pisoData.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Lock)[0]
        idDeviceLock = _deviceLockSel.id
    }
    if (isPortal) idDevicePortal = pisoData.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Telefonillo)[0].id
    if (isSONOFF) {
        // idDeviceSonoff = pisoData.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Sonoff)[0].id
        lDevicesSonoff = pisoData.dispositivos.filter(el => el.type.toString().trim() === Util().Constants().typeDevice_Sonoff)
    }

    let [nameStateSONOFF, imgStateSONOFF] = ['Desconectado', 'bombillaDISC.png']

    res.render('gestionPisos', {
        title: 'Gestión de piso',
        scripts: scripts,
        etiqueta: (_getIdDevice) ? `${pisoData.etiqueta}: ${_deviceLockSel.etiqueta_dispositivo}` : pisoData.etiqueta,
        codeDevice,
        urlServer,
        lactionsCard,
        llocationCard,
        ltypeCard,
        user,
        showFieldTypeCard,
        isWelock,
        isSONOFF,
        isPortal,
        existDevice: pisoData.existDevice,
        rolUser,
        isRoot,
        stateSONOFF: 'NA',
        nameStateSONOFF,
        sonoffExist: isSONOFF,
        imgStateSONOFF,
        noShowData: false,
        idPiso,
        idDeviceLock,
        idDevicePortal,
        lDevicesSonoff,
        lIdsDevices: lDevicesSonoff.map(el => el.id),
        lTypesCodesDB,
        showFieldTypeCode,
        pathBack: (req.session.department || 'mch') === 'mch' ? 'pisosSender' : 'mispisos'
    });
})

app.get("/testdb", nAuth, async (req, res) => {
    // let data = (await KeyServiceInstance.getAll()).data
    // let { lcardsData: lcardsDataNormal = [] } = getCardByTypeKey(
    //     data.filter(el => el.tipo_tarjeta.trim().toLowerCase() === Constants().TYPE_CARD_CODE_NORMAL.toLowerCase()), 
    //     undefined, 
    //     Constants().TYPE_CARD_CODE_NORMAL
    // )
    // let lKeysMaestra = data.filter(el => el.tipo_tarjeta.trim().toLowerCase() === Constants().TYPE_CARD_CODE_MAESTRA.toLowerCase())
    // let { lcardsData: lcardsDataMaestra = [] } = getCardByTypeKey(lKeysMaestra, 'Oficina', Constants().TYPE_CARD_CODE_MAESTRA)
    // res.json({ status: -1, lcardsDataNormal, lcardsDataMaestra, lKeysMaestra });

    // let dataLogsAll = await LogServiceInstance.getAllByPiso(2)
    res.json({ status: -1 });
})

/**
 * EndPoint: Obtiene las tarjetas de la manija by Piso
 * ["Root", "Admin"]
 */
app.get("/gettarjetasbyflat", auth, checkRole([ "admin", 
                                                "aca", "acamaster", 
                                                "superadmin", 
                                                "atic", "aticmaster", 
                                                "rrhh", "rrhhmaster",
                                                "ceo", 
                                                "ade", "ademaster",
                                                "myd", "mydmaster"]), async (req, res) => {
    const codeDevice = req.query.piso // PARAM DESDE URL
    const idQrIn = (req.query.idQr) ? `M${req.query.idQr.toString().trim()}` : undefined // PARAM DESDE URL
    const user = req.session.name
    try {
        const lKeysDB = (await KeyServiceInstance.getAll()).data

        // keys type NORMAL
        let { lcardsData: lcardsDataNormal = [] } = getCardByTypeKey(
            lKeysDB.filter(el => el.tipo_tarjeta.trim().toLowerCase() === Constants().TYPE_CARD_CODE_NORMAL.toLowerCase()),
            undefined,
            Constants().TYPE_CARD_CODE_NORMAL
        )

        // keys type MAESTRA
        let lKeysMaestra = lKeysDB.filter(el => el.tipo_tarjeta.trim().toLowerCase() === Constants().TYPE_CARD_CODE_MAESTRA.toLowerCase())
        let { lcardsData: lcardsDataMaestra = [] } = getCardByTypeKey(lKeysMaestra, codeDevice, Constants().TYPE_CARD_CODE_MAESTRA)

        let dataMaestra = lKeysMaestra.filter(el => el.idqr === idQrIn)[0]
        let isKeyMaestra = dataMaestra ? 1 : 0
        let keyMaestra = (isKeyMaestra === 1) ? {
            id: dataMaestra.id,
            idqr: dataMaestra.idqr,
            qr: dataMaestra.qr,
            piso: null,
            ubicacion: dataMaestra.ubicacion,
            tipo_tarjeta: dataMaestra.tipo_tarjeta
        } : {}
        let isRoot = (["admin", "superadmin", "dn", "atic", "ceo", "dnmaster"].includes(req.session.role)) ? 1 : 0

        let lDataResult = (["admin", "superadmin", "dn", "atic", "ceo", "dnmaster"].includes(req.session.role)) ? [...lcardsDataNormal, ...lcardsDataMaestra] : lcardsDataNormal
        res.json({
            status: 1,
            data: lDataResult,
            isKeyMaestra,
            isRoot,
            keyMaestra
        })
    } catch (err) {
        res.json({ status: -1 });
    }
})

/**
 * EndPoint: Listar todos los dispositivos conectados al servidor
 * ["Root", "Admin"]
 */
app.get("/devicesmanagement", auth, checkRole([ "admin", 
                                                "superadmin", 
                                                "atic", "aticmaster", 
                                                "rrhh", "rrhhmaster",
                                                "ceo"]), async (req, res) => {
    const { URL_SERVER: urlServer,
        TYPE_CODE_DEVICE: codeDevice,
        MSN_TABLE_EMPTY: msgTableEmpty
    } = Constants()
    const scripts = []
    const user = req.session.name
    let dataDevices = []
    let dataDevicesIsEmpty = true
    let dataClient = {
        title: 'Gestión de dispostivos',
        scripts: scripts,
        urlServer,
        user,
        dataDevices,
        dataDevicesIsEmpty,
        msgTableEmpty
    }

    try {
        dataDevices = await getDevicesServer()
        // Agrega nuevas propiedades para estilos dinamicos
        dataDevices = dataDevices.map(data => {
            let statusBool = (data.status === 'Conectado') ? true : false
            let labelAction = (data.inProcessing) ? 'SI' : 'NO'
            labelAction = (data.typeDeviceCode === codeDevice) ? '--' : labelAction
            let dateDisconnected = (data.dateDisconnected) ? data.dateDisconnected : '--'
            return { ...data, statusBool, labelAction, dateDisconnected }
        })
            .sort((pVal, qVal) => {
                const _dataOrderI = pVal.dateConnection.toUpperCase()
                const _dataOrderII = qVal.dateConnection.toUpperCase()
                return (_dataOrderII < _dataOrderI) ? -1 : (_dataOrderII > _dataOrderI) ? 1 : 0
            })
            .sort((pVal, qVal) => {
                const _statusI = pVal.status.toUpperCase()
                const _statusII = qVal.status.toUpperCase()
                return (_statusI < _statusII) ? -1 : (_statusI > _statusII) ? 1 : 0
            })
            .map((el, index) => ({ ...el, index: index + 1 }))
        dataDevicesIsEmpty = dataDevices.length === 0
        res.render('devicesManagement', { ...dataClient, dataDevices: dataDevices, dataDevicesIsEmpty });
    } catch (err) {
        res.render('devicesManagement', { ...dataClient });
    }
})

app.get("/admin/first-login", auth, checkRole(["admin", "superadmin"]), async (req, res) => {
    const scripts = []
    let registros = []
    let warning = ''

    try {
        const apiResponse = await FirstLoginServiceInstance.getAll(req.session.token)
        if (apiResponse?.data) {
            registros = apiResponse.data.map((item, index) => {
                let fecha = 'N/A'
                try {
                    fecha = item.first_login_at ? formatDateSQLToScreen(item.first_login_at) : 'N/A'
                } catch (err) {}

                let userAgentShort = item.first_login_user_agent || 'N/A'
                if (userAgentShort.length > 80) userAgentShort = `${userAgentShort.substring(0, 77)}...`

                let metadataJson = '{}'
                try {
                    metadataJson = JSON.stringify(item.metadata || {}, null, 2)
                } catch (err) {}

                return {
                    index: index + 1,
                    username: item.username || 'N/A',
                    nombre_completo: item.nombre_completo || 'N/A',
                    email: item.email || 'N/A',
                    department: item.department || 'N/A',
                    estado: item.estado,
                    first_login_at: fecha,
                    ip: item.first_login_ip || 'N/A',
                    user_agent: userAgentShort,
                    metadata_json: metadataJson
                }
            })
        } else if (apiResponse?.error) {
            warning = `<div class="alert alert-danger" role="alert">${apiResponse.error}</div>`
        }
    } catch (err) {
        console.log('Error obteniendo datos de primer acceso', err)
        warning = `<div class="alert alert-danger" role="alert">Error al obtener los datos, inténtelo más tarde.</div>`
    }

    res.render('firstLoginReport', {
        title: 'Primer acceso de usuarios',
        scripts,
        warning,
        registros,
        existRegistros: registros.length > 0
    })
})

app.get("/admin/first-login/daily", auth, checkRole(["admin", "superadmin"]), async (req, res) => {
    const scripts = []
    let registros = []
    let warning = ''
    const rawDate = typeof req.query.date === 'string' ? req.query.date : undefined
    let appliedDate = rawDate || ''
    let appliedDateHuman = ''
    let total = 0

    const resolveDate = (value) => {
        const isoPattern = /^\d{4}-\d{2}-\d{2}$/
        if (value && isoPattern.test(value)) {
            const parsed = new Date(`${value}T00:00:00Z`)
            if (!Number.isNaN(parsed.getTime())) return value
        }
        return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())
    }

    const todayIso = resolveDate()

    try {
        const apiResponse = await FirstLoginServiceInstance.getDaily(req.session.token, rawDate)
        if (apiResponse?.data) {
            registros = apiResponse.data.map((item, index) => {
                let fechaCompleta = 'N/A'
                let fechaCorta = 'N/A'
                let hora = '---'

                try {
                    if (item.first_login_at) {
                        fechaCompleta = formatDateSQLToScreen(item.first_login_at)
                        const [fechaLocal, horaLocal] = fechaCompleta.split(' ')
                        fechaCorta = fechaLocal || 'N/A'
                        hora = horaLocal || '---'
                    }
                } catch (err) {}

                let userAgentShort = item.first_login_user_agent || 'N/A'
                if (userAgentShort.length > 80) userAgentShort = `${userAgentShort.substring(0, 77)}...`

                let metadataJson = '{}'
                try {
                    metadataJson = JSON.stringify(item.metadata || {}, null, 2)
                } catch (err) {}

                return {
                    index: index + 1,
                    username: item.username || 'N/A',
                    nombre_completo: item.nombre_completo || 'N/A',
                    email: item.email || 'N/A',
                    department: item.department || 'N/A',
                    estado: item.estado,
                    fechaCompleta,
                    fechaCorta,
                    hora,
                    ip: item.first_login_ip || 'N/A',
                    user_agent: userAgentShort,
                    metadata_json: metadataJson
                }
            })

            appliedDate = apiResponse.appliedDate || resolveDate(rawDate)
            total = apiResponse.total || registros.length
        } else if (apiResponse?.error) {
            warning = `<div class="alert alert-danger" role="alert">${apiResponse.error}</div>`
            appliedDate = resolveDate(rawDate)
        }
    } catch (err) {
        console.log('Error obteniendo verificación diaria de primer acceso', err)
        warning = `<div class="alert alert-danger" role="alert">Error al obtener los datos diarios, inténtelo más tarde.</div>`
        appliedDate = resolveDate(rawDate)
    }

    if (!appliedDate) appliedDate = todayIso
    try {
        appliedDateHuman = formatDateSQLToScreen(`${appliedDate} 00:00:00`).split(' ')[0]
    } catch (err) {
        appliedDateHuman = appliedDate
    }

    res.render('firstLoginDailyReport', {
        title: 'Verificación diaria de primeros accesos',
        scripts,
        warning,
        registros,
        existRegistros: registros.length > 0,
        appliedDate,
        appliedDateHuman,
        total,
        todayIso
    })
})

/**
 * EndPoint: carga el detailsflat
 * ["Root", "Admin", "Propietario"]
 */
app.get("/detailsflat", auth, checkRole([   "admin", 
                                            "aca", "acamaster", 
                                            "superadmin", 
                                            "atic", "aticmaster", 
                                            "rrhh", "rrhhmaster",
                                            "ceo", 
                                            "ade", "ademaster",
                                            "myd", "mydmaster"]), async (req, res) => {
    const { MSN_TABLE_EMPTY: msgTableEmpty
    } = Constants()
    const scripts = []
    const user = req.session.name

    // PARAM DESDE URL
    let codeDevice = req.query.piso || '';
    const idPiso = req.query.idPiso || 0;
    const _getIdDevice = req.query.idDevice || 0

    // PARAM DESDE URL
    // const codeDevice = req.query.piso || ''
    // const _getIdPiso = req.query.idpiso || 0
    // const _getIdDevice = req.query.iddevice || 0

    let dataDevices = []
    let dataDevicesIsEmpty = true
    // req.session.role === "Root" || req.session.role === "Propietario"
    const mCodigoPermanete = (["admin", "superadmin", "dn", "atic", "ceo", "dnmaster", "propietario"].includes(req.session.role)) ? 'Solo usarlo cuando no pueda generar un código temporal' :
        'Solicitar a ATIC si y solo si NO pueda generar un código temporal'
    let dataClient = {
        title: `Historial de eventos del piso`,
        scripts: scripts,
        user,
        dataDevices,
        codeDevice,
        dataDevicesIsEmpty,
        msgTableEmpty,
        mCodigoPermanete
    }

    try {
        // let pisoDB = pisos.find(el => el.id.toString() === idPiso.toString())
        let detailPisoDB = undefined
        if (req.session.role === 'propietario') {
            let pisoDB = pisos.find(el => el.id.toString() === idPiso.toString())
            if (pisoDB)
                detailPisoDB = _getIdDevice ? (await ApartmentServiceInstance.getDetailsApartmentByIdAndIdDevice(idPiso, _getIdDevice)).data
                    : (await ApartmentServiceInstance.getDetailsApartmentById(idPiso)).data
        } else {
            detailPisoDB = _getIdDevice ? (await ApartmentServiceInstance.getDetailsApartmentByIdAndIdDevice(idPiso, _getIdDevice)).data
                : (await ApartmentServiceInstance.getDetailsApartmentById(idPiso)).data
        }
        // let detailPisoDB = _getIdDevice ? (await ApartmentServiceInstance.getDetailsApartmentByIdAndIdDevice(idPiso, _getIdDevice)).data
        //                                 : (await ApartmentServiceInstance.getDetailsApartmentById(idPiso)).data
        // dataClient.codeDevice = _getIdDevice ? `${detailPisoDB.etiqueta}, ${detailPisoDB.etiqueta_dispositivo}`:`${detailPisoDB.etiqueta}`
        // Si el piso no existe
        if (!detailPisoDB) {
            dataClient = {
                ...dataClient,
                lugar_piso: 'NA',
                codigo_postal: 'NA',
                direccion_piso: 'NA',
                codeDevice: 'No existe piso'
            }
            throw 'No existe piso'
        }

        let dataLogsAllDB = detailPisoDB.logs || []

        // Seccion para cargar el codigo actual
        let codeOBJ = {
            codigo: detailPisoDB.codigo || undefined,
            startTime: detailPisoDB.timestamp_inicio || undefined,
            endTime: detailPisoDB.timestamp_fin || undefined,
            fechaVigInicio: detailPisoDB.fecha_vig_inicio || undefined,
            fechaVigFin: detailPisoDB.fecha_vig_fin || undefined
        }
        let { code = '', startTime = '', endTime = '', existCode = false, isCodeActive = false } = {}
        if (codeOBJ.codigo) {
            existCode = true
            code = codeOBJ.codigo
            startTime = formatDateSQLToScreen(codeOBJ.fechaVigInicio)
            endTime = formatDateSQLToScreen(codeOBJ.fechaVigFin)
            try {
                let endTimeNumber = (codeOBJ.endTime) ? parseInt(codeOBJ.endTime) * 1000 : new Date().getTime()
                let timeCurrent = new Date().getTime()
                if (timeCurrent < endTimeNumber) isCodeActive = true
            } catch (err) { }
        }

        const lKeysDB = detailPisoDB.keys || []

        // Seccion para cargar las tarjetas type: NORMAL
        let lcardsData = lKeysDB.filter(el => el.tipo_tarjeta.trim().toLowerCase() === Constants().TYPE_CARD_CODE_NORMAL.toLowerCase())
        let lcards = lcardsData.map(el => el.idqr.trim())
        let cardsCurrent = lcards.join(' <b>|</b> ')
        let existCards = lcards.length !== 0

        // Seccion para cargar las tarjetas type: MAESTRA
        let lcardsDataM = lKeysDB.filter(el => el.tipo_tarjeta.trim().toLowerCase() === Constants().TYPE_CARD_CODE_MAESTRA.toLowerCase())
        let lcardsM = lcardsDataM.map(el => el.idqr.trim())
        let cardsCurrentM = lcardsM.join(' <b>|</b> ')
        let existCardsM = lcardsM.length !== 0
        let showCardsM = ["admin", "superadmin", "dn", "atic", "ceo", "dnmaster"].includes(req.session.role)

        const lugarPiso = `${detailPisoDB.pais}, ${detailPisoDB.ciudad}`
        const direccionPiso = `${detailPisoDB.direccion || ''}, Nro ${detailPisoDB.nro_edificio}, ${detailPisoDB.nro_piso}`
        const isWelock = detailPisoDB.codigo_permanente && detailPisoDB.codigo_permanente.toString().trim().length !== 0 ? true : false

        codeDevice = _getIdDevice ? `${(detailPisoDB.etiqueta || codeDevice).trim()}, ${detailPisoDB.etiqueta_dispositivo}` : `${(detailPisoDB.etiqueta || codeDevice).trim()}`
        dataClient = {
            ...dataClient, code, startTime, endTime, existCode, isCodeActive,
            cardsCurrent, existCards, lcardsData: lcardsData,
            cardsCurrentM, existCardsM, showCardsM,
            codigo_permanente: (["admin", "superadmin", "dn", "atic", "ceo", "dnmaster", "propietario"].includes(req.session.role)) ? detailPisoDB.codigo_permanente : ' x----x ',
            isWelock,
            lugar_piso: lugarPiso,
            codigo_postal: detailPisoDB.codigo_postal || 'NA',
            direccion_piso: direccionPiso,
            codeDevice
        }

        // Logs
        dataDevices = [...dataLogsAllDB]
        dataDevices.splice(15)

        dataDevices = dataDevices.map((el, index) => {
            let statusResult = el.resultado === Constants().STATUS_ACTION_CORRECTO
            let labelAction = getLabelAction(el.accion)
            let labelType = getLabelTypeCard(parseInt(el.data.type))
            let dateStart = el.fecha_vig_inicio
            let dateEnd = el.fecha_vig_fin
            let dataJSON = { labelType, dateStart, dateEnd }
            try {
                let data = el.data
                dataJSON = { ...dataJSON, ...data, etiqueta_dispositivo: el.etiqueta_dispositivo }
            } catch (err) { }

            let infoAdicional = processDataLog(JSON.stringify(dataJSON))
            // let infoAdicional = {}
            return {
                Index: index + 1,
                Usuario: el.usuario,
                FechaLog: formatDateSQLToScreen(el.fecha),
                Cliente: el.id_dispositivo_ref,
                Accion: labelAction,
                Resultado: el.resultado,
                statusResult,
                infoAdicional
            }
        })

        dataDevicesIsEmpty = dataDevices.length === 0
        res.render('detailsflat', {
            ...dataClient,
            dataDevices: dataDevices,
            dataDevicesIsEmpty,
            pathBack: (req.session.department || 'mch') === 'mch' ? 'pisosSender' : 'mispisos'
        });
    } catch (err) {
        console.log(err)
        res.render('detailsflat', {
            ...dataClient,
            pathBack: (req.session.department || 'mch') === 'mch' ? 'pisosSender' : 'mispisos'
        });
    }
})

// Guarda la sugerencia
app.post("/savesugerencia", nAuth, async (req, res) => {
    let stateSave = 0;
    const reqMotivo = req.body.motivo;
    const repObservacion = req.body.observacion;

    // Esta parte debe estar en una funcion
    let date = Math.floor(new Date().getTime() / 1000)
    let h = 3600
    let dia = 24 * h
    let fCurrent = [date - 8 * h, date + dia - 8 * h, date]

    try {
        await Logs.addSugerencia({
            Fecha: fCurrent[2] / 86400 + 25569,
            Motivo: reqMotivo,
            Observacion: repObservacion
        })
        await Logs.sheetSugerencia.saveUpdatedCells();
        stateSave = 1; // OK
    } catch (error) {
        stateSave = 0; // Error
    }

    res.json({ state: stateSave });
})

//Encender luz - Generar nuevo codigo
app.post('/update', auth, async (req, res) => { // Envia la request
    if (req.body.cmd == 'toggleLight') {
        let idDeviceIn = parseInt(req.body.idDevice) || 0
        let idPisoIn = parseInt(req.body.idPiso) || 0
        let statusSONOFF = { error: 403, msg: "device not exist!!" }
        let pisoData = pisos.filter(el => el.id === idPisoIn)[0] ||
        {
            id: 0,
            id_dispositivo_ref: 'NA',
            existDevice: false,
            dispositivos: []
        }
        let deviceSonoff = pisoData.dispositivos.filter(el => el.id === idDeviceIn)[0]
        if (!deviceSonoff) {
            res.json(statusSONOFF)
            return
        }
        let respWeLock = await toggleDeviceApi(deviceSonoff.id)
        if (respWeLock) {
            if (respWeLock.data.error === 0) respWeLock = { ...respWeLock.data, error: undefined }
        }
        statusSONOFF = respWeLock || statusSONOFF
        res.json(statusSONOFF)
    }
})

app.post('/openPortalSONOFF', async (req,response) => {
    const idDevice = parseInt(req.body.idDevice?.toString()) || 3
    let endPointApi = `https://mch-api.vercel.app/api/public/devices/${idDevice}/sonoff/status`
    // ${ApiConfigurationInstance.pathApi}/api/public/devices/${idDevice}/sonoff/status

    let dataResult = { state: 1, error: undefined }
    try {
        if ( idDevice <= 0 || idDevice === NaN ) throw new Error('Error')
        await EWeLinkServiceInstance.setStatusByIdDevice(idDevice)
    } catch (err) {
        console.log(err)
        dataResult = { state: 0, error: 'Error, intentelo mas tarde!!' }
    }

    response.json(dataResult)
})

app.get('/getstatussonoff', auth, async (req, res) => { // Envia la request
    let idDevicesIn = (req.query.idDevices || 0).toString()
    let idPisoIn = parseInt(req.query.idPiso) || 0
    let statusSONOFF = { error: 403, msg: "device not exist!!" }
    let pisoData = pisos.filter(el => el.id === idPisoIn)[0] ||
    {
        id: 0,
        id_dispositivo_ref: 'NA',
        existDevice: false,
        dispositivos: []
    }
    let lIdDevices = idDevicesIn.split('|')
    let lDeviceSonoff = pisoData.dispositivos.filter(el => lIdDevices.findIndex(ell => el.id.toString() === ell) !== -1)
    if (lDeviceSonoff.length === 0) {
        res.json(statusSONOFF)
        return
    }

    let statusTmp = (await getStatusDeviceSONOFFMultiApi(...lDeviceSonoff))
    if (statusTmp.error) {
        res.json(statusSONOFF)
        return
    }

    res.json(statusTmp)
})

/**
 * API endpoint for check-in functionality - Proxy to external API
 */
app.post("/api/share/app/mch/fichar", async (req, res) => {
    try {
        console.log('Check-in API called:', req.body);
        
        // Forward the request to the external API endpoint
        const externalApiEndpoint = process.env.API_ENDPOINT || 'https://mch-api.vercel.app';
        const externalApiUrl = `${externalApiEndpoint}/api/share/app/mch/fichar`;
        
        console.log('Forwarding to external API:', externalApiUrl);
        
        const response = await fetch(externalApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': req.headers.token || req.headers.authorization || '',
                'x-username': req.headers['x-username'] || req.body.username || ''
            },
            body: JSON.stringify(req.body)
        });
        
        const result = await response.json();
        console.log('External API response:', result);
        
        if (response.ok && result.data) {
            res.json({
                status: 1,
                message: 'Check-in registered successfully',
                data: result.data
            });
        } else {
            console.log('External API error:', result);
            res.status(response.status || 500).json({
                status: 0,
                error: result.error || 'Error, no se puede guardar la información, intentelo más tarde!!'
            });
        }
        
    } catch (error) {
        console.error('Check-in API error:', error);
        res.status(500).json({
            status: 0,
            error: 'Error, no se puede guardar la información, intentelo más tarde!!'
        });
    }
});

/**
 * DELETE endpoint for removing fichaje entries
 */
app.delete("/api/share/app/mch/fichar/:id", async (req, res) => {
    try {
        console.log('=== DELETE FICHAJE API ===');
        
        const fichajeId = req.params.id;
        const token = req.headers.token || req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({
                status: 0,
                error: 'Token de autenticación requerido'
            });
        }
        
        if (!fichajeId) {
            return res.status(400).json({
                status: 0,
                error: 'ID del fichaje requerido'
            });
        }
        
        // Call the external API to delete the fichaje
        const externalApiUrl = `${process.env.MCH_API_ENDPOINT || 'http://185.252.233.57:3006'}/api/rrhh/fichajeoficina/${fichajeId}`;
        
        console.log('Calling external delete API:', externalApiUrl);
        console.log('Token:', token);
        
        const response = await fetch(externalApiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        
        const result = await response.json();
        console.log('External API delete response:', result);
        
        if (response.ok && result.data) {
            res.json({
                status: 1,
                data: result.data,
                message: 'Fichaje eliminado exitosamente'
            });
        } else {
            res.status(response.status || 500).json({
                status: 0,
                error: result.error || 'Error al eliminar el fichaje'
            });
        }
        
    } catch (error) {
        console.error('Delete fichaje API error:', error);
        res.status(500).json({
            status: 0,
            error: 'Error interno del servidor'
        });
    }
});

/**
 * Test route for debugging check-in API with real login
 */
app.get("/test-checkin", async (req, res) => {
    try {
        console.log('=== TESTING CHECK-IN API WITH REAL LOGIN ===')
        
        // Step 1: Get a real token by logging in
        console.log('Step 1: Logging in...')
        const loginResult = await AuthServiceInstance.login("Gonzalo MBE", "welcome1")
        console.log('Login result:', loginResult)
        
        if (!loginResult || !loginResult.token) {
            res.json({ error: 'Login failed', loginResult })
            return
        }
        
        const realToken = loginResult.token
        console.log('Got real token:', realToken)
        
        // Step 2: Use the real token to call the check-in API
        const apiEndpoint = process.env.API_ENDPOINT || 'http://185.252.233.57:3000';
        const apiUrl = `${apiEndpoint}/api/share/app/mch/fichar`;
        console.log('API Endpoint:', apiUrl);
        
        const testData = {
            username: "Gonzalo MBE",
            qr: "qr_test123_" + Date.now(), // Use QR format similar to the real ones
            ip: "localhost",
            timestamp: Math.floor(Date.now() / 1000)
        }
        
        console.log('Test data:', testData)
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': realToken,  // Use 'token' header instead of 'Authorization'
                'x-username': 'Gonzalo MBE'
            },
            body: JSON.stringify(testData)
        })
        
        const result = await response.json()
        console.log('API Response Status:', response.status)
        console.log('API Response:', result)
        
        res.json({
            status: response.status,
            endpoint: apiEndpoint,
            token: realToken,
            result: result
        })
        
    } catch (error) {
        console.error('Test error:', error)
        res.json({ error: error.message })
    }
})

/**
 * Controller fichar, carga la pantalla para el respectivo fichaje
 */
app.get("/fichar", auth, checkRole([    "admin", 
                                        "aca", "acamaster", 
                                        "superadmin", 
                                        "atic", "aticmaster", 
                                        "rrhh", "rrhhmaster",
                                        "ceo", 
                                        "ade", "ademaster",
                                        "myd", "mydmaster"]), async (req, res) => {
    const { URL_SERVER: urlServer } = Constants()
    const scripts = [
        { script: '/js/Constants.js' },
        { script: '/js/Util.js' },
        { script: '/js/Fichar.js' }
    ]
    
    let _tokenQR = req.query.qr || ''
    let _tokenLogin = req.session.token
    const user = req.session.name;

    console.log('Loading fichar page for user:', user, 'with QR:', _tokenQR)

    // REMOVED: Server-side API call that was causing duplicate check-ins
    // The JavaScript on the client will handle the API call instead
    // This prevents the double API call issue (server + client = entrada + salida)
    
    /*
    // If QR token is present, make direct API call to register check-in
    if (_tokenQR && user) {
        try {
            console.log('Making direct API call for QR check-in:', user, _tokenQR)
            const apiEndpoint = process.env.API_ENDPOINT || 'http://185.252.233.57:3000';
            const apiUrl = `${apiEndpoint}/api/share/app/mch/fichar`;
            console.log('API Endpoint:', apiUrl)
            
            const checkInData = {
                username: user,
                qr: _tokenQR,
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'localhost',
                timestamp: Math.floor(Date.now() / 1000)
            }
            
            console.log('Sending check-in data:', checkInData)
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': _tokenLogin,  // Use 'token' header instead of 'Authorization'
                    'x-username': user // Add username to headers as well
                },
                body: JSON.stringify(checkInData)
            })
            
            const result = await response.json()
            console.log('Check-in API response status:', response.status)
            console.log('Check-in API response:', result)
            
            if (response.ok && (result.status === 1 || result.data)) {
                console.log('QR check-in registered successfully for user:', user)
            } else {
                console.log('QR check-in failed. Status:', response.status, 'Response:', result)
            }
        } catch (error) {
            console.error('Error making check-in API call:', error)
        }
    }
    */

    // res.json({ txtencrypt: encryptData(txt) })

    res.render('fichar', {
        title: 'MyCityHome',
        scripts: scripts,   
        urlServer,
        user,
        tokenQR: _tokenQR,
        tokenLogin: _tokenLogin
    });
})

/**
 * Captura los datos de la persona que hace login
 */
app.post("/login", async (req, res) => {
    const forwardedFor = req.headers['x-forwarded-for']
    const clientIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || req.socket.remoteAddress
    const userAgent = req.get('User-Agent') || ''
    const originHost = req.get('host') || ''
    const metadataLogin = {
        ip: clientIp,
        userAgent,
        source: 'mbeapp-web',
        endpoint: req.originalUrl,
        host: originHost,
        forwardedFor: forwardedFor || null
    }

    console.log(`ip -> ${clientIp}`)
    let _userLogin = await checkUser(req.body.name || '', req.body.password || '', metadataLogin)
    if ( _userLogin ) {   
            req.session.token = _userLogin.token
            req.session.name = _userLogin.data.username
            req.session.id = _userLogin.data.id
            
            // Cambiar
            let _rolMain = [ ..._userLogin.data.roles ].find(el => el.ismain === true)
            req.session.role = ( _rolMain ) ? `${_rolMain.id}` : 'na'
    
            // Obtiene el departamento del usuario logeado
            req.session.department = _userLogin.data.department || 'na' // importante para ver el tema de los GAVIRs
            //console.log('token user: ', req.session.token)
            console.log('session-qr-redirect: ', req.session.qr)
            console.log('session-qr-encode-redirect: ', encodeURIComponent(req.session.qr))
            if (`${req.session.pathprev}`.includes("fichar")) res.redirect(`${req.session.pathprev}?qr=${encodeURIComponent(req.session.qr)}`)
            else res.redirect("/")
    }else { 
        res.redirect("/qrentry")
    }
})

app.post("/logout", (req, res) => {
    req.session.token = undefined
    req.session.name = undefined
    req.session.role = undefined
    req.session.id = undefined
    req.session.department = undefined
    req.session.pathprev = undefined
    req.session.qr = undefined
    res.redirect("/login")
})

app.listen(PORT, () => { console.log("Running on Port: ", PORT) })

// Sin uso
function checkUserOld(username, pass) {
    out = false
    users.forEach(user => {
        if (user.name == username && user.password === encryptData(pass)) {
            out = user.role;
        }
    })
    return out;
}

async function checkUser(user, password, metadata = {}) {
    let _result = undefined
    try {
        _result = await AuthServiceInstance.login(user, password, metadata)
    }catch(err) {
        console.log('Error al consumir API')
    }
    return _result
}

/**
 * Obtiene el departamento [SOLUCIÓN TEMPORAL para extraer pisos de propietarios]
 * SIN USO
 */
function getDepartment(username, pass) {
    out = false
    users.forEach(user => {
        if (user.name == username && user.password === encryptData(pass)) {
            out = user.department;
        }
    })
    return out;
}

/**
 * SIN USO
 * @param {*} deviceName 
 * @returns 
 */
async function toggleDeviceForName(deviceName) {
    let responseData = undefined
    try {
        const connection = new ewelink({
            email: Constants().emailEWL,
            password: Constants().passwordEWL,
            region: Constants().regionEWL,
        });

        const device = (await connection.getDevices())
            .filter(el => el.productModel.trim() === "BASIC" && el.name === deviceName.trim())[0];
        if (!device) return responseData
        responseData = await connection.toggleDevice(device.deviceid)
    } catch (err) {
        responseData = { error: 503, msg: "error, call eWelink api!!" }
        console.log(`Error, to call toggleDevice on device [${deviceName}]. Apagar/encender luz!!`);
    }
    return responseData
};

// SIN USO [ANTERIOR API TERCERO]
async function toggleDevice(idDevice) {
    let responseData = undefined
    try {
        const connection = new ewelink({
            email: Constants().emailEWL,
            password: Constants().passwordEWL,
            region: Constants().regionEWL,
        });

        responseData = await connection.toggleDevice(idDevice)
    } catch (err) {
        responseData = { error: 503, msg: "error, call eWelink api!!" }
        console.log(`Error, to call toggleDevice on device [${deviceName}]. Apagar/encender luz!!`);
    }
    return responseData
};

async function getStatusDeviceSONOFFSingle(idDevice) {
    let responseData = undefined
    try {
        const connection = new ewelink({
            email: Constants().emailEWL,
            password: Constants().passwordEWL,
            region: Constants().regionEWL,
        });
        responseData = await connection.getDevicePowerState(idDevice)
    } catch (err) {
        responseData = { error: 503, msg: "error, call eWelink api!!" }
        console.log(`Error, to call getStatusDeviceSONOFF on device [${deviceName}]!!`);
    }
    return responseData
}

// SIN USO [API DE TERCEROS]
async function getStatusDeviceSONOFFMulti(...lDevices) {
    let responseData = undefined
    let rData = { data: [] }
    try {
        const connection = new ewelink({
            email: Constants().emailEWL,
            password: Constants().passwordEWL,
            region: Constants().regionEWL,
        });

        let cont = 0
        while (cont < lDevices.length) {
            let dataSonoff = await connection.getDevicePowerState(lDevices[cont].codigo)
            rData.data.push({ ...dataSonoff, id: lDevices[cont].id })
            cont++
        }
    } catch (err) {
        responseData = { error: 503, msg: "error, call eWelink api!!" }
        rData = { ...responseData, ...rData }
        console.log(`Error, to call getStatusDeviceSONOFF on device [${deviceName}]!!`);
    }
    return rData
}

/**
 * Funcionando actualmente, consume API de ERP. Se consume directamente el API eWeLink
 * @param  {...any} lDevices 
 * @returns 
 */
async function getStatusDeviceSONOFFMultiApi(...lDevices) {
    let responseData = undefined
    let rData = { data: [] }
    try {
        let cont = 0
        while (cont < lDevices.length) {
            let dataSonoff = await EWeLinkServiceInstance.getStatusByIdDevice(lDevices[cont].id)
            let dataCleaner = { state: 'NA', error: undefined }
            if (dataSonoff.data.error === 0) {
                dataCleaner.state = (dataSonoff.data.data.online) ? dataSonoff.data.data.params.switch : 'NA'
            } else dataCleaner.error = dataSonoff.data.error
            rData.data.push({ ...dataCleaner, id: lDevices[cont].id })
            cont++
        }
    } catch (err) {
        responseData = { error: 503, msg: "error, call api ERP!!" }
        rData = { ...responseData, ...rData }
        console.log(`Error, to call getStatusDeviceSONOFF on device [${deviceName}]!!`);
    }
    return rData
}

async function toggleDeviceApi(idDevice) {
    let responseData = undefined
    try {
        // responseData = await connection.toggleDevice(idDevice)
        responseData = await EWeLinkServiceInstance.setStatusByIdDevice(idDevice)
    } catch (err) {
        responseData = { error: 503, msg: "error, call ERP api!!" }
        console.log(`Error, to call toggleDevice on device [${deviceName}]. Apagar/encender luz!!`);
    }
    return responseData
};
