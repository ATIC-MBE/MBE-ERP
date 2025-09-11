import { ALERT_DANGER } from "@/client/helpers/constants"
import { tAlert } from "@/client/types/globalTypes"

const AlertContainer = ( { typeAlert, children } : {typeAlert:tAlert, children: any} ) => {
    return (
        <div
            style={{
                background: '#f8d7da',
                color: '#b94a48',
                border: '2px solid #b94a48',
                borderRadius: '1rem',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.1rem',
                fontWeight: 500,
            }}
            role="alert"
        >
            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            <span className="sr-only">Info</span>
            <div>
                { children }
            </div>
        </div>
    )
}

export default AlertContainer