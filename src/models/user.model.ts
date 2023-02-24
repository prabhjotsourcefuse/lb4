import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Customer} from './customer.model';
import {Role} from './role.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  middleName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  phoneNumber?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdOn?: string;

  @property({
    type: 'date',
  })
  modifiedOn?: string;

  @belongsTo(() => Customer, {keyTo: 'id'})
  customerId?: number;

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['user', 'admin'],
    },
    required: true,
  })
  roleId: string;

  @hasOne(() => Role, {keyTo: 'key', keyFrom: 'roleId'})
  role?: Role;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
