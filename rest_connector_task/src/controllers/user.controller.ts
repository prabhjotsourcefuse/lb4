// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {get} from '@loopback/rest';
import {User} from '../services';

export class UserController {
  constructor(
    @inject('services.UserService')
    protected userService: User,
  ) {}

  @get('/users')
  async getCharacter(): Promise<object> {
    return this.userService.getUsers();
  }
}
