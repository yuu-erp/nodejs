import { UserPayload } from "../type"

export const isAdmined = (payload : UserPayload):boolean =>{
    
        return payload.role === "ADMIN"
    
}
