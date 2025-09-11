import { createContext } from 'react'
import { JSONObject } from '../types/globalTypes'

const UserContext = createContext<JSONObject>({})

export default UserContext

