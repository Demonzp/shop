import { User } from "@prisma/client";

export const userDataToOwner = (user: User)=>{
    return{
        uid: user.uid,
        email: user.email,
        firsName: user.firstName,
        secondName: user.secondName,
        phone: user.phone,
        verified: user.verified,
    }
}

export const updateToken = {
    
};