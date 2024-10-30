import { UniversalWalletProvider } from "./UniversalWalletProvider";
import { standardErrorCodes, standardErrors } from "./core/error";
import * as util from "./sign/util";
import {
  ProviderEventCallback,
  RequestArguments,
} from "./core/provider/interface";
import { AddressString } from "./core/type";

function createProvider() {
  return new UniversalWalletProvider({
    metadata: { appName: "Test App", appLogoUrl: null, appChainIds: [1] },
  });
}

const mockHandshake = jest.fn();
const mockRequest = jest.fn();
const mockCleanup = jest.fn();
const mockStoreSignerType = jest.spyOn(util, "storeSignerType");
const mockLoadSignerType = jest.spyOn(util, "loadSignerType");

let provider: UniversalWalletProvider;
let callback: ProviderEventCallback;

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(util, "createSigner").mockImplementation((params) => {
    callback = params.callback;
    return {
      accounts: [AddressString("0x123")],
      chainId: 1,
      handshake: mockHandshake,
      request: mockRequest,
      cleanup: mockCleanup,
    };
  });

  provider = createProvider();
});

describe("Request Handling", () => {
  it("returns default chain id even without signer set up", async () => {
    await expect(provider.request({ method: "eth_chainId" })).resolves.toBe(
      "0x1",
    );
    await expect(provider.request({ method: "net_version" })).resolves.toBe(1);
  });

  it("throws error when handling invalid request", async () => {
    await expect(
      provider.request({} as RequestArguments),
    ).rejects.toMatchObject({
      code: standardErrorCodes.rpc.invalidParams,
      message: "'args.method' must be a non-empty string.",
    });
  });

  it("throws error for requests with unsupported or deprecated method", async () => {
    const deprecated = ["eth_sign", "eth_signTypedData_v2"];
    const unsupported = ["eth_subscribe", "eth_unsubscribe"];

    for (const method of [...deprecated, ...unsupported]) {
      await expect(provider.request({ method })).rejects.toMatchObject({
        code: standardErrorCodes.provider.unsupportedMethod,
      });
    }
  });
});

describe("Signer configuration", () => {
  it("should complete signerType selection correctly", async () => {

    const args = { method: "eth_requestAccounts" };
    await provider.request(args);
    expect(mockHandshake).toHaveBeenCalledWith(args);
  });

  it("should support enable", async () => {
    jest.spyOn(console, "warn").mockImplementation();

    await provider.enable();
    expect(mockHandshake).toHaveBeenCalledWith({
      method: "eth_requestAccounts",
    });
  });

  it("should throw error if signer selection failed", async () => {
    const error = new Error("Signer selection failed");

    await expect(
      provider.request({ method: "eth_requestAccounts" }),
    ).rejects.toMatchObject({
      code: standardErrorCodes.rpc.internal,
      message: error.message,
    });
    expect(mockHandshake).not.toHaveBeenCalled();
    expect(mockStoreSignerType).not.toHaveBeenCalled();
  });

  it("should not store signer type unless handshake is successful", async () => {
    const error = new Error("Handshake failed");
    mockHandshake.mockRejectedValue(error);

    await expect(
      provider.request({ method: "eth_requestAccounts" }),
    ).rejects.toMatchObject({
      code: standardErrorCodes.rpc.internal,
      message: error.message,
    });
    expect(mockHandshake).toHaveBeenCalled();
    expect(mockStoreSignerType).not.toHaveBeenCalled();
  });

  it("should load signer from storage when available", async () => {
    mockLoadSignerType.mockReturnValue("scw");
    const providerLoadedFromStorage = createProvider();

    await providerLoadedFromStorage.request({ method: "eth_requestAccounts" });
    expect(mockHandshake).not.toHaveBeenCalled();

    const request = {
      method: "personal_sign",
      params: ["0x123", "0xdeadbeef"],
    };
    await providerLoadedFromStorage.request(request);
    expect(mockRequest).toHaveBeenCalledWith(request);

    await providerLoadedFromStorage.disconnect();
    expect(mockCleanup).toHaveBeenCalled();
    expect(provider["signer"]).toBeNull();
  });

  it("should throw error if signer is not initialized", async () => {
    await expect(
      provider.request({ method: "personal_sign" }),
    ).rejects.toMatchObject({
      code: standardErrorCodes.provider.unauthorized,
      message: `Must call 'eth_requestAccounts' before other methods`,
    });
  });

  it("should set signer to null", async () => {
    await provider.request({ method: "eth_requestAccounts" });

    await provider.disconnect();
    expect(mockCleanup).toHaveBeenCalled();
    expect(provider["signer"]).toBeNull();
  });
});
