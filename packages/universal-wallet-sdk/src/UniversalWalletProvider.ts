import { Signer } from "./sign/interface.js";
import { createSigner, loadSignerType, storeSignerType } from "./sign/util.js";
import { Communicator } from ":core/communicator/Communicator.js";
import { standardErrorCodes } from ":core/error/constants.js";
import { standardErrors } from ":core/error/errors.js";
import { serializeError } from ":core/error/serialize.js";
import { SignerType } from ":core/message/ConfigMessage.js";
import {
  AppMetadata,
  ConstructorOptions,
  ProviderEventEmitter,
  ProviderInterface,
  RequestArguments,
} from ":core/provider/interface.js";
import { ScopedLocalStorage } from ":core/storage/ScopedLocalStorage.js";
import { hexStringFromNumber } from ":core/type/util.js";
import { checkErrorForInvalidRequestArgs } from ":util/provider.js";

export class UniversalWalletProvider
  extends ProviderEventEmitter
  implements ProviderInterface {
  private readonly metadata: AppMetadata;
  private readonly communicator: Communicator;

  private signer: Signer | null = null;

  constructor({
    metadata,
  }: Readonly<ConstructorOptions>) {
    super();
    this.metadata = metadata;
    this.communicator = new Communicator({
      metadata
    });

    const signerType = loadSignerType();
    if (signerType) {
      this.signer = this.initSigner(signerType);
    }
  }

  public async request(args: RequestArguments): Promise<unknown> {
    try {
      checkErrorForInvalidRequestArgs(args);
      if (!this.signer) {
        switch (args.method) {
          case "eth_requestAccounts": {
            const signer = this.initSigner("scw");
            await signer.handshake(args);
            this.signer = signer;
            storeSignerType("scw");
            break;
          }
          case "net_version":
            return 1; // default value
          case "eth_chainId":
            return hexStringFromNumber(1); // default value
          default: {
            throw standardErrors.provider.unauthorized(
              "Must call 'eth_requestAccounts' before other methods",
            );
          }
        }
      }
      return this.signer.request(args);
    } catch (error) {
      const { code } = error as { code?: number };
      if (code === standardErrorCodes.provider.unauthorized) this.disconnect();
      return Promise.reject(serializeError(error));
    }
  }

  /** @deprecated Use `.request({ method: 'eth_requestAccounts' })` instead. */
  public async enable() {
    console.warn(
      `.enable() has been deprecated. Please use .request({ method: "eth_requestAccounts" }) instead.`,
    );
    return await this.request({
      method: "eth_requestAccounts",
    });
  }

  async disconnect() {
    await this.signer?.cleanup();
    this.signer = null;
    ScopedLocalStorage.clearAll();
    this.emit(
      "disconnect",
      standardErrors.provider.disconnected("User initiated disconnection"),
    );
  }

  readonly isUniversalWallet = true;

  private initSigner(signerType: SignerType): Signer {
    return createSigner({
      signerType,
      metadata: this.metadata,
      communicator: this.communicator,
      callback: this.emit.bind(this),
    });
  }
}
