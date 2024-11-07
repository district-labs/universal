import { Signer } from './interface';
import { SCWSigner } from './scw/SCWSigner';
import { Communicator } from ':core/communicator/Communicator';
import { SignerType } from ':core/message';
import { AppMetadata, ProviderEventCallback } from ':core/provider/interface';
import { ScopedLocalStorage } from ':core/storage/ScopedLocalStorage';

const SIGNER_TYPE_KEY = 'SignerType';
const storage = new ScopedLocalStorage('UNWSDK', 'SignerConfigurator');

export function loadSignerType(): SignerType | null {
  return storage.getItem(SIGNER_TYPE_KEY) as SignerType;
}

export function storeSignerType(signerType: SignerType) {
  storage.setItem(SIGNER_TYPE_KEY, signerType);
}

export function createSigner(params: {
  signerType: SignerType;
  metadata: AppMetadata;
  communicator: Communicator;
  callback: ProviderEventCallback;
}): Signer {
  const { signerType, metadata, communicator, callback } = params;
  switch (signerType) {
    case 'scw': {
      return new SCWSigner({
        metadata,
        callback,
        communicator,
      });
    }
  }
}
