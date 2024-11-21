import {
  type ICredentialPlugin,
  type IDIDManager,
  type IDataStore,
  type IDataStoreORM,
  type IKeyManager,
  type IResolver,
  createAgent,
} from '@veramo/core';
import { CredentialPlugin } from '@veramo/credential-w3c';
import { DIDStore, KeyStore, PrivateKeyStore } from '@veramo/data-store';
import { DIDManager } from '@veramo/did-manager';
import { WebDIDProvider } from '@veramo/did-provider-web';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { Resolver } from 'did-resolver';
import { getResolver as webDidResolver } from 'web-did-resolver';
import { dbConnection } from './db.js';
import { env } from '@/env.js';

export const alias = env.API_CREDENTIALS_DNS;
export const provider = `did:web:${alias}`;

export const veramoAgent = createAgent<
  IDIDManager &
  IKeyManager &
  IDataStore &
  IDataStoreORM &
  IResolver &
  ICredentialPlugin
>({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(
          new PrivateKeyStore(dbConnection, new SecretBox(env.KMS_SECRET_KEY)),
        ),
      },
    }),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: provider,
      providers: {
        [provider]: new WebDIDProvider({
          defaultKms: 'local',
        }),
      },
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...webDidResolver(),
      }),
    }),
    new CredentialPlugin(),
  ],
});
