# WeatherXM

[![CI](https://github.com/WeatherXM/smart-contracts-v2/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/WeatherXM/smart-contracts-v2/actions/workflows/ci.yml)
[![Coverage](https://github.com/WeatherXM/smart-contracts-v2/actions/workflows/coverage.yml/badge.svg?branch=feat%2Fadd-coverage-badges)](https://github.com/WeatherXM/smart-contracts-v2/actions/workflows/coverage.yml)


This repo contains all contracts and tests relevant to WeatherXM network. WeatherXM is a community powered weather network, that rewards weather station owners and provides accurate weather services to Web3 enterprises.

## Branches

- `releases` contain complete, tested and audited contract code, generally on mainnet
- `main` contains complete, tested and audited contract code
- `develop` is for the pre-release code, with new features, not yet audited

## Architecture

As more logic is transferred into smart contracts, a need for grouping of functionality and modularity emerges. That is why multiple Smart Contracts are now created, each with its own logic and design patterns:

- [WeatherXM](./docs/weatherxm)
- [WeatherXMStation](./docs/weatherStationNFT.md)
- [WeatherXMStationRegistry](./docs/weatherstationsregistry.md)
- [WeatherXMLicense](./docs/weatherxmlicense.md)
- [RewardPool](./docs/rewardpool)
- [RewardVault](./docs/rewardvault.md)
- [ServicePool](./docs/servicepool)

Diagrams illustrating the interaction among the smart contracts, storage slots, classes, etc can be found in [diagrams](./docs/diagrams).


### Assumptions

- Different Admins can be assigned to each contract after deployment to the network by assigning roles.
- Admin has a lot of power and is assumed to be the right, fair, and just person/party. It is highly advised to have a multisig as admin, rather than just an EOA.
- The entire supply of tokens is minted upon deployment to the deployer of the token. The deployer is then responsible for transferring the tokens to the correct wallets after the deployment. These wallets will include vestings, rewards, and any other allocation as described in the white paper and tokens emissions section in the docs [Token Emissions](./docs/emissions)

### Rules

- Fund RewardPool every day with the daily emission which follows the ([Token Emissions](./docs/emissions.md))
- The RewardPool distributor is responsible and authorized to pull the daily emission from the RewardVault
- The release schedule which is followed by the RewardVault cannot be changed
- The daily rewards are calculated externally by the rewarding mechanism and then a merkle tree root hash is submitted to the RewardPool
- Submitting the root hash once per day
- Tokens in circulation should never be more than maximum supply (100M)
- The total sum of tokens in the RewardPool must always be enough for everyone to claim their full allocation
- Before making a claim, every user needs to request a specific amount of WXM. Once the request is made, there will be a short predetermined waiting period before claiming becomes enabled 
- Available rewards to be claimed for each user are calculated based on the parameters: `cumulative amount`, `the user's wallet address`, `the cycle`, `the Merkle proof` (for the chosen cycle) and `the amount of rewards already claimed`
- A user cannot claim more than their toal allocated rewards in the RewardPool
- The maximum amount a user can claim is constrained by the chosen cycle and the provided Merkle proof, so it is advised to use the proof for the latest cycle.
- The Merkle tree containing all required information for claiming will be published on IPFS
- In each cycle, each user has only one valid proof
- Anyone can buy services through the ServicePool contract
- The weather-related services can be purchased from ServicePool using WXM or a basetoken such as USDC which will be decided upon deployement
- Proof of purchase (a transaction hash of the transaction from the service purchase through ServicePool) is required for the provision of services
- The remaining tokens from the rewarding fo all weather stations in a daily basis are transferred to the [Bussiness Development pool](./docs/pools.md)

### Merkle Tree and Claiming Rewards

You may find more info about the implementation of Merkle Tree and the procedure which enables claiming of rewards in the [Merkle Tree](./docs/merkle_tree.md).

## Dev Notes

### Testing

Tests are written with Foundry, Hardhat, Ethers & Typescript, using Typechain to generate typings for all contracts.

Please make sure:

1. Install the project's dependencies.

```
npm run setup
```

2. Review **hardhat.config.ts** and **hardhat-fork.config.ts** to better undestand the configuration of testnets and dependencies

3. Review the **env.template** to make sure you provide all necessary information for testing

4. Test the smart contracts by choosing one of the options described in this [tutorial](./docs/testing.md)

### CI

Codebase rules are enforced through some passing GitHub Actions (workflow configs are in .github/workflows). These rules are:

- Linting of both the contracts (through Solhint) and TS files (ESLint)
- Compile the smart contracts successfully
- Passing testing suites (both for Foundry and Hardhat)

### Code Formatting & Documentation

- Solidity imports deconstructed as import { xxx } from "../xxx.sol"
- Designed for Solidity >=0.8.20
- Uses custom errors instead of revert reason strings
- Well-documented via NatSpec comments
- Thoroughly tested with Foundry and Hardhat

Detailed code documentation resulted from NatSpec comments can be found in [Code Documentation](./docs/index.md).

### Security

While we have strict standards for code quality and test coverage, it's important to note that this project may not be entirely risk-free. Although we have taken measures to ensure the security of the contracts, they have not yet been audited by a third-party security researcher.

#### Tools

- [Slither](https://github.com/crytic/slither)
  - Static analysis from Trail of Bits.
- [MythX](https://mythx.io/)
  - Paid service for smart contract security.
- [Mythrill](https://github.com/ConsenSys/mythril)
  - MythX free edition.
- [Consensys Security Tools](https://consensys.net/diligence/tools/)
  - A list of Consensys tools.

More info about using these tools internally into this project can be found in the [docs](./docs/testing.md)

### Contributing

Feel free to dive in! [Open](https://github.com/WeatherXM/smart-contracts/issues/new) an issue or submit a PR in order to make some proposal or submit a question.

## Acknowledgements

- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [Hardhat](https://github.com/NomicFoundation/hardhat)
- [Foundry](https://github.com/foundry-rs/foundry)
- [Chainlink](https://github.com/smartcontractkit/chainlink)
- [Murky](https://github.com/dmfxyz/murky)
- [Solidity-RLP](https://github.com/hamdiallam/Solidity-RLP)

## Deployment

In the file `deploy/mainnet.js` fill in the missing addresses:
- Line 1: The address fo the USDC or in general the stablecoin to be used for service purchasing
- Line 2: The DAO treasury address that will receive the payments
- Line 3: The treasury address that will receive the change from the daily rewards distribution
- LIne 4: The amount of WXM (In the highest (ETH) denomination) to be initially sent to the reward pool

In `hardhat.config.js` fill in the network on which you want to deploy and the private key of the deployer

From the root of the project run:
1. `npm install`
2. `npx hardhat deploy --tags mainnet --network <the name of the network as you set it in hardhat config>`

After the deployment finishes a deployment file will be created in the deployments folder in the path `deployments/<network_name>`. This folder must be committed.
