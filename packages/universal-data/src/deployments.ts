export const universalDeployments = {
  // Test
  Erc20Mintable: '0x4C8Be898BdE148aE6f9B0AF86e7D2b5a0558A7d0',
  // Universal Identity
  // TODO: Redeploy with Safe Singleton
  Resolver: '0x305f57c997A35E79F6a59CF09A9d07d2408b5935',
  // Delegation Framework Core
  EntryPoint: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
  DelegationManager: '0x259333aBf1b66309bc1b7B7e76f84681e6852651',
  UniversalWalletFactory: '0x59ea58813F44aE8BF9246Fe5BA7Ee77966fF22cd',
  // Delegation Framework Enforcers
  AllowedCalldataEnforcer: '0x16F74238A5A0593816ece1d6F5c7063910529866',
  AllowedMethodsEnforcer: '0xd5d342f4e0d0C3B4A60aD19a2AaCF2cC7513b491',
  AllowedTargetsEnforcer: '0xCf664Dee9013D988f08CE3C284E6d212C1BBfdFD',
  ArgsEqualityCheckEnforcer: '0x0C7fcF1140441eE967849b26833EDac1673a6987',
  BlockNumberEnforcer: '0x41AC4f87f1c41A9f65e2a7184a09EF35FB97e1a7',
  DeployedEnforcer: '0x8197383Fc911097189174e34437Ad53A185333CD',
  ERC20BalanceGteEnforcer: '0x970B0d6912A1FbE1A8Ca078931BDBe9b4b47C574',
  ERC20TransferAmountEnforcer: '0xCe09401479B70f31607884321B268Ac550E413AB',
  ERC721BalanceGteEnforcer: '0xeFeC78484dc2869D742C48bDa0c8947748f966A5',
  ERC721TransferEnforcer: '0xe9Cb0A16F406Dc9f6bF6313392350c26dDe060f1',
  ERC1155BalanceGteEnforcer: '0x5532F46847721a6b29E7f54277385110B1E5AC7F',
  IdEnforcer: '0x74bB1338bf639520AF4F3B0F5211880bd28709ff',
  LimitedCallsEnforcer: '0xe8128C0444E47e5D9c2dA3E913d41203BA0E268D',
  NativeBalanceGteEnforcer: '0xf2B0063a7Df6A6e038f95d36A7B9DcA79D400846',
  NativeTokenPaymentEnforcer: '0x6af62642f3A7D705CAAbB8F314F72e49f19E51a8',
  NativeTokenTransferAmountEnforcer:
    '0x8EE92De416326625A49cc2B3dFEE5491821C0862',
  NonceEnforcer: '0x4Ad3479784Aa92fAa4c6D2A5A37681a2383D3992',
  OwnershipTransferEnforcer: '0xa6cAF93F28554eE7846ceD74e521328aadc5790a',
  RedeemerEnforcer: '0xFd3ded3600A84DB92accC270A1f592FBe5EcDCfF',
  TimestampEnforcer: '0x3CE07E63d72590ba9988FFAbb1F1F788A9dAe228',
  ValueLteEnforcer: '0xDa788aF3E906E9ECef331D1E2D12CC81730892c4',
} as const;
