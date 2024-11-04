import { type Address } from 'viem';
import { baseSepolia } from 'viem/chains';

export const delegationFrameworkDeployments: {
  [chainId: number]: {
    [key: string]: Address;
  };
} = {
  // [anvil.id as number]: {
  //   delegationManager: zeroAddress,
  // },
  [baseSepolia.id as number]: {
    erc20Mintable: '0x4C8Be898BdE148aE6f9B0AF86e7D2b5a0558A7d0',
    delegationManager: '0x56D56e07e3d6Ee5a24e30203A37a0a460f42D7A3',
    enforcerAllowedCalldata: '0xff71d60f3208469cBCE0859717B5198042DCB3F3',
    enforcerAllowedMethods: '0xe32C2561792e8446Abe73B9f557B881C13906186',
    enforcerAllowedTargets: '0x06aaE4c67EEA95277c46Bf79b1583d4a01772D22',
    enforcerBlockNumber: '0x8E470D2Ae278457b42d2405E0B8Cd4BE21Ed9045',
    enforcerDeployed: '0xf9088f013dBD9ebb7Cebd66fEB48253c6Ac5a820',
    enforcerERC20BalanceGte: '0xB7B6f32ec6343261D814e55Ed8C5925d91Cab861',
    enforcerERC20TransferAmount: '0x9A069b18032B31429A363AeCFb1B6A0564b44471',
    enforcerId: '0x91015c3b9D9523966eD2399885e5Df7A567f916c',
    enforcerLimitedCalls: '0xe694bFfffEA3E85923b1210b37e6a0175e910863',
    enforcerNonce: '0xE83BCFD8bBE672A96747e831050a91cf44F4F87A',
    enforcerTimestamp: '0x550FdD13eEBC1f22ea2a2480024BacBF0Ad7e5CE',
    enforcerValueLte: '0xBE32a6DB7471F63BB168C088c57Db01AfAe87967',
    enforcerNativeTokenTransferAmount:
      '0x5eD3833d7B957A8DB8A461c3AF2d668Ec25382E0',
    enforcerNativeBalanceGte: '0x376a98860E210DdEda3689fb39565592c563cB0A',
    enforcerArgsEqualityCheck: '0x7378dE585998d3E18Ce147867C335C25B3dB8Ee5',
    enforcerNativeTokenPayment: '0x87Fe18EbF99e42fcE8A03a25F1d20E119407f8e7',
    enforcerRedeemer: '0x926672b130D1EF60A9d6b11D2048d121b30f40C1',
  },
} as const;
