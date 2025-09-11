import { deviceWeLink, resulteWeLink } from '../types/GlobalTypes'
import axios from "axios"
import UtilInstance from './Util'

class EWeLink {
    public region = 'eu'
    public domain = 'eu-apia.coolkit.cc'
    public familyId = '60ec2a2e860d94000952f43a'
    public appId = 'BC3XM7gFuqd8oKAfgL5Lh7TmDrVzuzWo' // hola soy jaqui debes de borrar la app id antes en ewelink dev de ahi creas una nueva app y cambias estos parametros luego debes autentificar como en el tutorial
    public appSecret = 'wm3JlA1UrTLjH0LYv4akYCRbeC4xMrV8'

    constructor() {}

    /**
     * https://coolkit-technologies.github.io/eWeLink-API/#/en/PlatformOverview
     * @param length 
     * @returns 
     */
    randomWord(length: number): string {
        let str = ""
        let arr = [
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l','m', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L','M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        ]

        for (let i = 0; i < length; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1))
            str += arr[pos]
        }

        return str;
    }

    async getListDeviceOLD(token: string): Promise<Array<deviceWeLink>> {
        let pathOne = `https://${EWeLinkInstance.domain}/v2/device/thing?familyid=${EWeLinkInstance.familyId}&beginIndex=-999999`
        let pathTwo = `https://${EWeLinkInstance.domain}/v2/device/thing?familyid=${EWeLinkInstance.familyId}&beginIndex=-16`
        //thingStore/getAllDevice
        // let pathThree = 
        
        let result: Array<deviceWeLink> = []
        try {
            let _config = {
                url: `${pathOne}`,
                method: 'GET',
                headers: {
                    'X-CK-Nonce': `${EWeLinkInstance.randomWord(8)}`,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const responseOne = await axios(_config)

            console.log(responseOne.data.total)

            _config = {
                url: `${pathTwo}`,
                method: 'GET',
                headers: {
                    'X-CK-Nonce': `${EWeLinkInstance.randomWord(8)}`,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const responseTwo = await axios(_config)

            let data = [...(responseOne.data.data.thingList as Array<any>), ...(responseTwo.data.data.thingList as Array<any>)]
            data.forEach(el => {
                let data: deviceWeLink = {
                    name: el.itemData.name,
                    deviceid: el.itemData.deviceid,
                    online: el.itemData.online,
                    params: {
                        switch: el.itemData.params.switch,
                        pulse: el.itemData.params.pulse
                    }
                }
                result.push(data)
            })
        } catch (error) {}

        // console.log(result)

        return result
    }


    async getListDevice(token: string): Promise<Array<deviceWeLink>> {
        let _numPage = 30
        let _index = -999999
        
        let result: Array<deviceWeLink> = []
        try {
            let data: Array<any> = []
            let _cont = 1
            while ( true ) {
                let _path = `https://${EWeLinkInstance.domain}/v2/device/thing?familyid=${EWeLinkInstance.familyId}&num=${_numPage}&beginIndex=${_index}`
                let _config = {
                    url: `${_path}`,
                    method: 'GET',
                    headers: {
                        'X-CK-Nonce': `${EWeLinkInstance.randomWord(8)}`,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
                
                let _responseEwelink = await axios(_config)
                let _total = _responseEwelink.data.data.total
                let _listData = _responseEwelink.data.data.thingList as Array<any>
                let _nroPages = Math.ceil(_total/_numPage)

                data = [ ...data, ..._listData ]

                if ( _nroPages === 1 || _nroPages === 0 ) break
                else {
                    if ( _cont >= _nroPages ) break
                    _cont++
                    _index = _listData[_numPage-1].index // last element
                }
            }

            data.forEach(el => {
                let data: deviceWeLink = {
                    name: el.itemData.name,
                    deviceid: el.itemData.deviceid,
                    online: el.itemData.online,
                    params: {
                        switch: el.itemData.params.switch,
                        pulse: el.itemData.params.pulse
                    }
                }
                result.push(data)
            })
        } catch (error) {}

        return result
    }

    /**
     * Retorna información de la última conexion a los servidores de eWeLink
     * Si el SonOff esta fuera de linea, retorna un switch: off
     * Al intentar cambiar el estado, si el error es 4002, el dispositivo esta desconectado
     * @param token 
     * @param idDevice 
     * @returns 
     */
    async getLastStatus(token: string, idDevice: string): Promise<resulteWeLink> {
        let path = `https://${EWeLinkInstance.domain}/v2/device/thing/status?type=1&id=${idDevice}&params=switch|pulse`

        let result: resulteWeLink = {
            error: -1,
            msg: 'Error desconocido!!'
        }

        try {
            const _config = {
                url: `${path}`,
                method: 'GET',
                headers: {
                    'X-CK-Nonce': `${EWeLinkInstance.randomWord(8)}`,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await axios(_config)
            result = response.data as resulteWeLink
        } catch (error) {}

        return result
    }

    async getCurrentStatus(token: string, idDevice: string): Promise<resulteWeLink> {
        let result: resulteWeLink = {
            error: -1,
            msg: 'Error desconocido!!'
        }

        try {
            const lDeviceEWeLink: Array<deviceWeLink> = await EWeLinkInstance.getListDevice(token)
            let data = lDeviceEWeLink.find( el => el.deviceid === idDevice )
            if ( data ) {
                result = {
                    error: 0,
                    msg: '',
                    data: { ...data }
                }
            }
        } catch (error) {}

        return result
    }

    async setStatus(token: string, idDevice: string): Promise<resulteWeLink> {
        const statusDevice = await EWeLinkInstance.getCurrentStatus(token, idDevice)
        // Validar para valores
        let _status = statusDevice.data!.params.switch
        let _online = statusDevice.data!.online
        let _valStatus = _online ? ( _status === 'on' ? 'off' : 'on' ) : 'off'

        let path = `https://${EWeLinkInstance.domain}/v2/device/thing/status`

        let result: resulteWeLink = {
            error: -1,
            msg: 'Error desconocido!!',
            data: {
                name: statusDevice.data!.name,
                deviceid: statusDevice.data!.deviceid,
                online: statusDevice.data!.online, 
                params: 
                {   
                    switch: _valStatus, 
                    pulse: statusDevice.data!.params.pulse 
                } 
            }
        }

        let data = {
            type: 1,
            id: idDevice,
            params: {
                switch: _valStatus
            }
        }

        try {
            const _config = {
                url: `${path}`,
                method: 'POST',
                headers: {
                    'X-CK-Nonce': `${EWeLinkInstance.randomWord(8)}`,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
            };
            const response = await axios(_config)
            let _result = response.data as resulteWeLink
            if ( _result.error === 4002 ) _result.msg = 'Dispositivo desconectado'
            result = { ...result, error: _result.error, msg: _result.msg }
        } catch (error) {}

        return result
    }

    async refreshToken(refreshToken: string): Promise<resulteWeLink> {
        let path = `https://${EWeLinkInstance.domain}/v2/user/refresh`

        let result: resulteWeLink = {
            error: -1,
            msg: 'Error desconocido!!'
        }

        let data = { rt: refreshToken }

        try {
            const _config = {
                url: `${path}`,
                method: 'POST',
                headers: {
                    'X-CK-Appid': `${EWeLinkInstance.appId}`,
                    'X-CK-Nonce': `${EWeLinkInstance.randomWord(8)}`,
                    'Authorization': `Sign ${UtilInstance.createSign(EWeLinkInstance.appSecret, JSON.stringify(data))}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
            };
            const response = await axios(_config)
            console.log(response.data)
            let _result = response.data as resulteWeLink
            // if ( _result.error === 4002 ) _result.msg = 'Dispositivo desconectado'
            // result = { ...result, error: _result.error, msg: _result.msg }
            result = { ..._result }
        } catch (error) {}

        return result
    }
}

const EWeLinkInstance = new EWeLink()
Object.freeze(EWeLinkInstance)

export default EWeLinkInstance