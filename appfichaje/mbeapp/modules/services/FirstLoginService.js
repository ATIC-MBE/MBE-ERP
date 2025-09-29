const fetch = require('node-fetch');
const ApiConfigurationInstance = require('./ApiConfiguration');

class FirstLoginService {
      async getAll(token) {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/admin/users/first-login`
            if (!endPointApi) return { data: [] }

            let dataResult = { data: [] }
            try {
                  const headers = { 'Content-Type': 'application/json' }
                  if (token) headers.token = token
                  const res = await fetch(endPointApi, {
                        method: 'GET',
                        headers
                  })

                  if (res.status === 200) {
                        dataResult = await res.json()
                  } else {
                        const errorPayload = await res.json().catch(() => ({}))
                        dataResult = {
                              error: errorPayload.error || 'No se pudo obtener la información de primeros accesos.',
                              data: []
                        }
                  }
            } catch (err) {
                  console.log('Error http/https on API FirstLogin')
                  dataResult = {
                        error: 'Error de conexión con el API',
                        data: []
                  }
            }

            return dataResult
      }

      async getDaily(token, date) {
            let endPointApi = `${ApiConfigurationInstance.pathApi}/api/admin/users/first-login-daily`
            if (date) {
                  const query = new URLSearchParams({ date }).toString()
                  endPointApi = `${endPointApi}?${query}`
            }

            let dataResult = { data: [] }
            try {
                  const headers = { 'Content-Type': 'application/json' }
                  if (token) headers.token = token
                  const res = await fetch(endPointApi, {
                        method: 'GET',
                        headers
                  })

                  if (res.status === 200) {
                        dataResult = await res.json()
                  } else {
                        const errorPayload = await res.json().catch(() => ({}))
                        dataResult = {
                              error: errorPayload.error || 'No se pudo obtener la verificación diaria de accesos.',
                              data: []
                        }
                  }
            } catch (err) {
                  console.log('Error http/https on API FirstLogin Daily')
                  dataResult = {
                        error: 'Error de conexión con el API',
                        data: []
                  }
            }

            return dataResult
      }
}

const FirstLoginServiceInstance = new FirstLoginService()
Object.freeze(FirstLoginServiceInstance)

module.exports = FirstLoginServiceInstance
