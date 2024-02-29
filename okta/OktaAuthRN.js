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
        ...config.oktaAuth,
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
          },
          // 'idx-response': {
          //   storageProvider: StorageProvider
          // },
        }
    });
  }

  getOktaAuth() {
    return this.oktaAuth;
  }

  getTokens() {
    return this.oktaAuth.tokenManager.getTokensSync();
  }

  // refreshTokens() {
  //   console.log('ref1')
  //   return this.oktaAuth.tokenManager.renew('idToken');
  // }

  refreshTokens(success, failure) {
    if (success && failure) {
      console.log('ref2')
      const tokens = this.getTokens();
      console.log(tokens);
      this.refreshTokens()
      .then( (tokens) => {
          console.log(tokens);
          success();
      })
      .catch( (err) => {
          console.log('Handle Refresh with Refresh Token Error: ' + err);
          // if refresh token is expired fall back to session - WONT Work
          // Handle Refresh with Session Error: ReferenceError: Property 'document' doesn't exist
          // props.oktaAuthRN.oktaAuth.token.getWithoutPrompt()
          // .then( res => {
          //     props.oktaAuthRN.oktaAuth.tokenManager.setTokens(res.tokens);
          //     populateFields();
          // })
          // Instead try with IDX
          this.oktaAuth.idx.start()
          .then( res => {
              if (res.status === 'SUCCESS') {
                  if (res.tokens) {
                      this.oktaAuth.tokenManager.setTokens(res.tokens);
                      success();
                  } else {
                      const step = res.availableSteps.find((element) => element.name === 'issue');
                      if (step) {
                          step.action()
                          .then( res => {
                              if (res.status === 'SUCCESS' && res.tokens) {
                                  this.oktaAuth.tokenManager.setTokens(res.tokens);
                                  success();
                              }
                          })
                          .catch(err => {
                              console.log('Unexpected Error trying to exchange InteractionCode: ' + err);
                              failure();
                          });
                      }
                  }
              } else {
                  failure();
              }
          })
          .catch( err => {
              console.log('Handle Refresh with Session Error: ' + err);
              this.oktaAuth.idx.cancel()
              .then( () => {
                  failure();
              })
              .catch( e => {
                  failure();
              });
          });
      });
    } else {
      console.log('ref1')
      return this.oktaAuth.tokenManager.renew('idToken');
    }
  }

  revokeTokens(success, failure) {
    if (success && failure) {
      this.revokeTokens()
      .then( r => {
          console.log('Result: ' + r);
          this.removeTokens();
          success();
      })
      .catch( err => {
          console.log('Revoke Error: ' + err);
          failure();
      });
    } else {
      return this.oktaAuth.revokeAccessToken()
        .then( () => {
          return this.oktaAuth.revokeRefreshToken()
        });
    }
  }

  closeSession() {
    return this.oktaAuth.closeSession();
  }

  removeTokens() {
    this.oktaAuth.tokenManager.clear();
  }

  signOut(success, failure) {
    if (success && failure) {
      this.revokeTokens()
      .then( res => {
          console.log('Result: ' + res);
          this.removeTokens();
          return this.closeSession();
      })
      .then( () => {
        success();
      })
      .catch( err => {
        console.log('signOut Error: ' + err);
        failure();
      });
    } else {
      return this.revokeTokens()
      .then( res => {
          console.log('Result: ' + res);
          this.removeTokens();
          return this.closeSession();
      });
    }
  }
}

export default OktaAuthRN

