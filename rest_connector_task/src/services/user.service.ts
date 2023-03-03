import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {DsDataSource} from '../datasources';

export interface User {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getUsers():Promise<Object>
}

export class UserProvider implements Provider<User> {
  constructor(
    // restds must match the name property in the datasource json file
    @inject('datasources.restds')
    protected dataSource: DsDataSource = new DsDataSource(),
  ) {}

  value(): Promise<User> {
    return getService(this.dataSource);
  }
}
