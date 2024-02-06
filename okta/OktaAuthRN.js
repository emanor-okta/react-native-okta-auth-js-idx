import '@okta/okta-auth-js/polyfill';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';

import StorageProvider from './StorageProvider';


class OktaAuthRN {
  oktaAuth;
  config;

  constructor(config) {
      this.config = config;
  }

  async initialAuthClient() {
    await StorageProvider.clear();
    await StorageProvider.loadFromStorage();
    
    this.oktaAuth = new OktaAuth({
        ...config,
        storageManager: {
          token: {
            storageProvider: StorageProvider
          },
          cache: {
            storageProvider: StorageProvider
          },
          transaction: {
            storageProvider: StorageProvider
          },
          'shared-transaction': {
            storageProvider: StorageProvider
          },
          'original-uri': {
            storageProvider: StorageProvider
          }
        }
    });
  }

  getOktaAuth() {
    return this.oktaAuth;
  }

  getTokens() {
    return this.oktaAuth.tokenManager.getTokensSync();
  }
}

export default OktaAuthRN

