const formDataToJson = (formData:FormData)=>{
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
    
    return JSON.stringify(object); 
};

export {
    formDataToJson
}