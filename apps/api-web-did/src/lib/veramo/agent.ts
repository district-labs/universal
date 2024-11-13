import {
  createAgent,
  type IDIDManager,
  type IResolver,
  type IDataStore,
  type IDataStoreORM,
  type IKeyManager,
  type ICredentialPlugin,
} from '@veramo/core';
import { DIDManager } from '@veramo/did-manager';
import { WebDIDProvider } from '@veramo/did-provider-web';
import { KeyManager } from '@veramo/key-manager';
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local';
import { CredentialPlugin } from '@veramo/credential-w3c';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getResolver as webDidResolver } from 'web-did-resolver';
import { dbConnection } from './db.js';
import { KeyStore, DIDStore, PrivateKeyStore } from '@veramo/data-store';
import 'dotenv/config';

if (!process.env.KMS_SECRET_KEY) {
  throw new Error('KMS_SECRET_KEY env var is required');
}

export const alias = 'web-did-api.up.railway.app';
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
          new PrivateKeyStore(
            dbConnection,
            new SecretBox(process.env.KMS_SECRET_KEY),
          ),
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
