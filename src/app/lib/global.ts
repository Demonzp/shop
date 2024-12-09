import { TObjAny } from "@/types/global";

const formDataToObj = (formData: FormData) => {
    const object: { [key: string]: any; } = {};
    formData.forEach((value, key) => {
        // Reflect.has in favor of: object.hasOwnProperty(key)
        if (!Reflect.has(object, key)) {
            object[key] = value;
            return;
        }
        if (!Array.isArray(object[key])) {
            object[key] = [object[key]];
        }
        object[key].push(value);
    });

    return object;
};

const objToJson = (obj: TObjAny) => {
    return JSON.stringify(obj);
};

const objKeyFromKebabCaseToCamelCase = (obj: TObjAny): TObjAny => {
    const newObj: TObjAny = {};
    for (const key in obj) {
        newObj[key.replace(/-./g, x => x[1].toUpperCase())] = obj[key];
    }
    return newObj;
}

const createId = () => {
    // Generate a random 8-digit hexadecimal number
    const randomHex = Math.floor(Math.random() * 0xFFFFFFFFFFFFF).toString(16).toUpperCase().padStart(12, '0');

    // Get the current timestamp
    const timestamp = Date.now().toString(16).toUpperCase().padStart(12, '0');

    // Combine the random hex and timestamp to create a unique ID
    const uniqueId = `${randomHex}-${timestamp}`;

    return uniqueId;
}

export {
    formDataToObj,
    objToJson,
    objKeyFromKebabCaseToCamelCase,
    createId
}