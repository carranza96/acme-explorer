import { Entity } from './entity.model';

export class Actor extends Entity {

    name: string;
    surname: string;
    phone: string;
    role: string;
    email: string;
    password: string;
    address: string;
    validated: boolean;
    customToken: string;
    preferredLanguage = 'en';
    idToken: string;
}
