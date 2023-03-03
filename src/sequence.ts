import {inject} from '@loopback/core';
import {
  FindRoute,
  ParseParams,
  InvokeMethod,
  Reject,
  RequestContext,
  Send,
  SequenceActions,
  SequenceHandler,
} from '@loopback/rest';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {LogFn, LogLevel, LOG_BINDINGS} from './components/logger';

dotenv.config();

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(LOG_BINDINGS.LOG_ACTION) public logger: LogFn,
  ) {}

  async handle(context: RequestContext) {
    const {request, response} = context;

    const userId: string = request?.headers?.cookies['userId'] || "";
    const token = jwt.sign({userId}, 'hello_world_secret', {
      algorithm: 'RS256',
    });
    request.headers.token = token;

    try {
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

      this.logStart(context);

      const result = await this.invoke(route, args);
      this.send(response, result);
      this.logEnd();
    } catch (err) {
      this.logError();
      this.reject(context, err);
    }
  }
  private log(str: string, level?: number) {
    this.logger(str, level ?? LogLevel.INFO);
  }
  private logStart(context: RequestContext) {
    this.log('Start time - ' + new Date().toLocaleTimeString());
    this.log('Referer - ' + context.request.headers.referer);
    this.log('Request IP - ' + context.request.connection.remoteAddress);
  }

  private logEnd() {
    this.log('End time - ' + new Date().toLocaleTimeString());
  }

  private logError() {
    this.log('Error time - ' + new Date().toLocaleTimeString(), LogLevel.ERROR);
  }
}
