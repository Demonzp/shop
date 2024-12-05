import { TObjAny } from "@/types/global";

const formDataToObj = (formData:FormData)=>{
    const object:{[key: string]: any;} = {};
    formData.forEach((value, key) => {
        // Reflect.has in favor of: object.hasOwnProperty(key)
        if(!Reflect.has(object, key)){
            object[key] = value;
            return;
        }
        if(!Array.isArray(object[key])){
            object[key] = [object[key]];    
        }
        object[key].push(value);
    });
    
    return object; 
};

const objToJson = (obj:TObjAny)=>{
    return JSON.stringify(obj); 
};

const objKeyFromKebabCaseToCamelCase = (obj:TObjAny):TObjAny=>{
    const newObj:TObjAny = {};
    for (const key in obj) {
        newObj[key.replace(/-./g, x=>x[1].toUpperCase())] = obj[key];
    }
    return newObj;
}

export {
    formDataToObj,
    objToJson,
    objKeyFromKebabCaseToCamelCase
}