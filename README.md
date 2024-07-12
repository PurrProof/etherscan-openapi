- [Etherscan.io API Specification in OpenAPI 3.1 Format](#etherscanio-api-specification-in-openapi-31-format)
  - [What is it?](#what-is-it)
  - [What is it for?](#what-is-it-for)
  - [Is the Etherscan API completely described in the specification?](#is-the-etherscan-api-completely-described-in-the-specification)
    - [Accounts](#accounts)
    - [Contracts](#contracts)
    - [Transactions](#transactions)
    - [Blocks](#blocks)
    - [Logs](#logs)
    - [Geth/Parity Proxy](#gethparity-proxy)
    - [Tokens](#tokens)
    - [Gas Tracker](#gas-tracker)
    - [Stats](#stats)
  - [Drawbacks](#drawbacks)
    - [Paths contain query elements](#paths-contain-query-elements)
    - [There are no 4xx responses described](#there-are-no-4xx-responses-described)
    - [The tag-description linter rule is disabled.](#the-tag-description-linter-rule-is-disabled)
  - [For developers](#for-developers)

# Etherscan.io API Specification in OpenAPI 3.1 Format

## What is it?

**[The specification](etherscan-openapi31-bundled.yml)** is a YAML file in OpenAPI 3.1 format, based on the [Etherscan APIs documentation](https://docs.etherscan.io/).

## What is it for?

There are a number of Etherscan API HTTP-clients available in different languages, each varying in completeness and update frequency. With the API specification, you can generate an API HTTP-client in a supported language using various generators. Here are a few examples of such generators:  

* typescript:
  * [Openapi-Typescript](https://github.com/openapi-ts/openapi-typescript), see [example](tests/openapi-ts/integration/account.balance.test.ts)
  * [Orval](https://github.com/anymaniax/orval)
* multiple languages: [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator), [Swagger-Codegen](https://github.com/swagger-api/swagger-codegen), [Kiota](https://github.com/microsoft/kiota)

## Is the Etherscan API completely described in the specification?

Almost. All requests are fully described, including **PRO** endpoints. However, some responses are only partially described:

### Accounts
| Module.Action | Is response described? |
|---|---|
| account.balance  | + |
| account.balancemulti  | + |
| account.txlist  | partially |
| account.txlistinternal | partially |
| account.tokentx | partially |
| account.tokennfttx | partially |
| account.token1155tx | partially |
| account.getminedblocks | partially |
| account.txsBeaconWithdrawal | partially |
| account.balancehistory | + |
### Contracts
| Module.Action | Response described |
|---|---|
| contract.getabi | + |
| contract.getsourcecode | partially |
| contract.getcontractcreation | + |
| contract.verifysourcecode | + |
| contract.checkverifystatus | + |
### Transactions
| Module.Action | Response described |
|---|---|
| transaction.getstatus | partially |
| transaction.gettxreceiptstatus | partially |
### Blocks
| Module.Action | Response described |
|---|---|
| block.getblockreward     | partially |
| block.getblockcountdown  | + |
| block.getblocknobytime   | + |
| stats.dailyavgblocksize  | + |
| stats.dailyblkcount      | + |
| stats.dailyblockrewards  | + |
| stats.dailyavgblocktime  | + |
| stats.dailyuncleblkcount | + |
### Logs
| Module.Action | Response described |
|---|---|
| logs.getLogs | partially |
### Geth/Parity Proxy
| Module.Action | Response described |
|---|---|
| proxy.eth_blockNumber | + |
| proxy.eth_getBlockByNumber | partially |
| proxy.eth_getUncleByBlockNumberAndIndex | partially |
| proxy.eth_getBlockTransactionCountByNumber | + |
| proxy.eth_getTransactionByHash | partially |
| proxy.eth_getTransactionByBlockNumberAndIndex | partially |
| proxy.eth_getTransactionCount | + |
| proxy.eth_sendRawTransaction | + |
| proxy.eth_getTransactionReceipt | + |
| proxy.eth_call | + |
| proxy.eth_getCode | + |
| proxy.eth_getStorageAt | + |
| proxy.eth_estimateGas | + |
### Tokens
| Module.Action | Response described |
|---|---|
| stats.tokensupply                | + |
| account.tokenbalance             | + |
| stats.tokensupplyhistory         | + |
| account.tokenbalancehistory      | + |
| token.tokenholderlist            | + |
| token.tokeninfo                  | + |
| account.addresstokenbalance      | + |
| account.addresstokennftbalance   | + |
| account.addresstokennftinventory | + |

### Gas Tracker
| Module.Action | Response described |
|---|---|
| gastracker.gasestimate | + |
| gastracker.gasoracle   | + |
| stats.dailyavggaslimit | + |
| stats.dailygasused     | + |
| stats.dailyavggasprice | + |
### Stats
| Module.Action | Response described |
|---|---|
| stats.ethsupply             | + |
| stats.ethsupply2            | + |
| stats.ethprice              | + |
| stats.chainsize             | + |
| stats.nodecount             | + |
| stats.dailytxnfee           | + |
| stats.dailynewaddress       | + |
| stats.dailynetutilization   | + |
| stats.dailyavghashrate      | + |
| stats.dailytx               | + |
| stats.dailyavgnetdifficulty | + |
| stats.ethdailymarketcap     | + |
| stats.ethdailyprice         | + |

## Drawbacks

### Paths contain query elements

All Etherscan API endpoint URLs follow the pattern `...etherscan.io/api?module=ModuleName&action=ActionName&...`.

However, in terms of OpenAPI 3.1, endpoint paths must be unique. To meet this requirement while still distinguishing path items, I have described paths in the specification like this:

```
paths:
  /?account.balance:
    get:
    ...
  /?account.balancemulti:
    get:
    ...
```

To make the linter ignore it, I have to disable [path-not-include-query](https://redocly.com/docs/cli/rules/path-not-include-query) rule.

### There are no 4xx responses described

This is because Etherscan API does not return such responses. All responses have a 200-OK code. To make the linter ignore this, I have to disable [operation-4xx-response](https://redocly.com/docs/cli/rules/operation-4xx-response) rule.

### The [tag-description](https://redocly.com/docs/cli/rules/tag-description) linter rule is disabled.

According to the OA3.1 specification, [tags](https://spec.openapis.org/oas/latest.html#tag-object) are allowed to have no description. However, the Redoc linter activates this rule by default, so I need to disable it.

## For developers

```
pnpm install
pnpm client
pnpm test
```

Issues and pull requests are welcome.

Use this at your own risk and responsibility. Please respect the [Terms of Service](https://etherscan.io/terms) of Etherscan.io.