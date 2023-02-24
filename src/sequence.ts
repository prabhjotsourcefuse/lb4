import {MiddlewareSequence, RequestContext} from '@loopback/rest';

export class MySequence extends MiddlewareSequence {
  async handle(context: RequestContext) {
    console.log('Start %s', new Date().toLocaleTimeString());
    const referer = context.request.headers.referer
    await super.handle(context);
    console.log('Referer %s', referer)
    console.log('User agent %s', context.request.headers['user-agent'])
    console.log('Request IP %s', context.request.ip)
    // for checking the not allowed referer
    if (!referer?.includes('http://localhost:5173')) {
      throw new Error('This refferer not allowed, to make request.')
    }
    console.log('Completion %s', new Date().toLocaleTimeString());
  }
}
