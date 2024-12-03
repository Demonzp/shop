import { scryptSync, randomBytes } from 'node:crypto';

const passwordToHash = (password: string) => {
    const salt = randomBytes(8).toString('hex');
    const buf = scryptSync(password, salt, 64);

    return `${buf.toString('hex')}.${salt}`;
};

const comparePassword = (storedPassword: string, suppliedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = scryptSync(suppliedPassword, salt, 64);

    return buf.toString('hex') === hashedPassword;
};

export {
    passwordToHash,
    comparePassword
}