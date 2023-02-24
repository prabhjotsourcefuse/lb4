import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  first_name: string;

  @property({
    type: 'string',
    required: true,
  })
  middle_name: string;

  @property({
    type: 'string',
    required: true,
  })
  last_name: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'number',
  })
  phone_number?: number;

  @property({
    type: 'string',
    default: "Subscriber",
  })
  role?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'date',
  })
  created_on?: Date;

  @property({
    type: 'date',
  })
  modified_on?: Date;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
