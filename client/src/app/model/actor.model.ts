import { Entity } from './entity.model';

export class Actor extends Entity {

  name: String;
  surname: String;
  email: String;
  password: String;
  preferredLanguage = 'en';
  phone: String;
  address: String;
  role: String
  banned: Boolean
  created: Date;
  finder: string;
  customToken: string;
  idToken: string;

}
