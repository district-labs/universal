import type { Address } from 'viem';
import { baseSepolia } from 'viem/chains';

export const universalDeployments: {
  [chainId: number]: {
    [name: string]: Address;
  };
} = {
  [baseSepolia.id as number]: {
    // Test
    erc20Mintable: '0x4C8Be898BdE148aE6f9B0AF86e7D2b5a0558A7d0',
    // Universal Identity
    resolver: '0x305f57c997A35E79F6a59CF09A9d07d2408b5935',
    // Delegation Framework Core
    EntryPoint: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
    DelegationManager: '0x42f53d86aF500b0Cc98B3B1275a36fd438060a32',
    UniversalWalletFactory: '0x6456c9F0B987b71e1c47c34F1A95aB6eED8DA2f0',
    // Delegation Framework Enforcers
    AllowedCalldataEnforcer: '0xFc3EB7631CDb35c33aA37B9525621D1eaAb9a769',
    AllowedMethodsEnforcer: '0x415AeC704272b3Ee51670b694eaffb580C4d9388',
    AllowedTargetsEnforcer: '0x2ABc28723ee570C2fCB30A64470956e776872388',
    ArgsEqualityCheckEnforcer: '0xB4C876eC47Da402D0214F041358Efe13cD244EdF',
    BlockNumberEnforcer: '0xbeCB77bf771f3E569a0f517120890A9fA1b05428',
    DeployedEnforcer: '0xAE75c246C0eC90c9a29136bB216301c64D7591EE',
    ERC20BalanceGteEnforcer: '0xA701FD16679908F2C6B47e173101698d9A93Db63',
    ERC20TransferAmountEnforcer: '0xF2887a650f688a12758f660AE9b0cb4306BF536D',
    ERC721BalanceGteEnforcer: '0x5c9FB4Bdf7b76bD5734931769738D52FceCe182A',
    ERC721TransferEnforcer: '0x8883efab27b5c9cCc934C74e2E6152010D3Ba78a',
    ERC1155BalanceGteEnforcer: '0xF51d0d346409BBeFccF2Bb16cA3f576D0A7A5ECE',
    IdEnforcer: '0x73b0a5bD5CAb215ddC985d0b3C81c484Cb032e29',
    LimitedCallsEnforcer: '0x13B5B5381F736c49cefe151B03195Fe8A8cfbEBe',
    NativeBalanceGteEnforcer: '0x2DBA62f63b2b225e328c722253702488387C4c16',
    NativeTokenPaymentEnforcer: '0xfe153d10b52814c05707cbD8140C1c1C7ac71167',
    NativeTokenTransferAmountEnforcer:
      '0x7f37B0e6d6e6e9D3f65db645a5b16a93AeD3A735',
    NonceEnforcer: '0x253528ecAb6AB4125581c0d2737f0C2d5bC9c6cF',
    OwnershipTransferEnforcer: '0x1E0a044893eF5d294C3Bf40bbd1e1B0c78F61dAa',
    RedeemerEnforcer: '0x29D425443F4428897Dbb56d00c1Ee32484D7b268',
    TimestampEnforcer: '0xf2510525240E25e2FbA8ba90c0529D4844a63C4E',
    ValueLteEnforcer: '0x9f5FDc0f59C0b681a7995c100CA2566451d83384',
  },
} as const;
