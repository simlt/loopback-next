// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/example-greeting-app
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {GreetingApplication} from '../..';

describe('GreetingApplication', () => {
  let app: GreetingApplication;
  let client: Client;

  before(givenRunningApplicationWithCustomConfiguration);
  after(() => app.stop());

  before(() => {
    client = createRestAppClient(app);
  });

  it('injects params properly - order: inject, requestbody, param', async function () {
    await client.post('/inject-bug/Raymond').send({some: 'body'}).expect(204);
  });

  it('injects params properly - order: requestbody, inject, param', async function () {
    await client.post('/inject-ok/Raymond').send({some: 'body'}).expect(204);
  });

  async function givenRunningApplicationWithCustomConfiguration() {
    app = new GreetingApplication({
      rest: givenHttpServerConfig(),
    });

    // Start Application
    await app.main();
  }
});
