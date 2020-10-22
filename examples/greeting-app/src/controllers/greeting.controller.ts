// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-greeting-app
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {param, post, Request, requestBody, RestBindings} from '@loopback/rest';
import {expect} from '@loopback/testlab';

/* istanbul ignore file */
export class GreetingController {
  constructor() {}

  @post('/inject-bug/{name}', {
    responses: {
      '204': {},
    },
  })
  async injectBug(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @requestBody() body: unknown,
    @param.path.string('name') name: string,
  ): Promise<void> {
    expect(typeof body).to.eql('object', 'body');
    expect(typeof name).to.eql('string', 'name');
  }

  @post('/inject-ok/{name}', {
    responses: {
      '204': {},
    },
  })
  async injectOk(
    @requestBody() body: unknown,
    @inject(RestBindings.Http.REQUEST) request: Request,
    @param.path.string('name') name: string,
  ): Promise<void> {
    expect(typeof body).to.eql('object', 'body');
    expect(typeof name).to.eql('string', 'name');
  }
}
