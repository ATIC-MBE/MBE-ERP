class Validations {

      constructor() { }

      /**
       * 
       * @param value 
       * @returns 
       */
      checkEmail(value: string): boolean {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
      }

      /**
       * 
       * @param value 
       * @returns 
       */
      checkUrl(value: string): boolean {
            // return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value)
            return /^(?:(?:(?:(http|https)?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
      }

      /**
       * Verifica el formato de fecha, para insertar a SQL
       * @param value Formato de fecha [YYYY-MM-DD HH-MM-SS]
       * @returns 
       */
      checkFormatDateTimeSQL(value: string): boolean {
            return /\d{2,4}-\d{1,2}-\d{1,2} (0[1-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value)
      }

      /**
       * Verifica el formato de fecha, para insertar a SQL
       * @param value Formato de fecha [YYYY-MM-DD HH-MM-SS]
       * @returns 
       */
      checkFormatDateSQL(value: string): boolean {
            return /\d{2,4}-\d{1,2}-\d{1,2}$/.test(value)
      }

      /**
       * 
       * @param value 
       * @returns 
       */
      isEmpty(value: string): boolean {
            return value.toString().trim() === ''
      }

      /**
       * 
       * @param value 
       * @returns 
       */
      checkTelefono(value: string): boolean {
            return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value)
      }
}

const ValidationsInstance = new Validations()
Object.freeze(ValidationsInstance)

export default ValidationsInstance