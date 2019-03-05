import { Entity } from './entity.model';

export class Actor extends Entity {

  name: string;
  surname: string;
  email: string;
  password: string;
  preferredLanguage = 'en';
  phone: string;
  address: string;
  role: string
  banned: boolean
  created: Date;
  finder: string;
  customToken: string;
  idToken: string;

}
