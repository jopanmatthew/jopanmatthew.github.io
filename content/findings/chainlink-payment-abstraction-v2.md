---
title: "A static balance check blocks CoW Swap partial fills"
protocol: "Chainlink Payment Abstraction V2"
protocolType: "Payment infrastructure"
severity: "Medium"
platform: "Code4rena"
contestPeriod: "Mar 2026"
contestSort: 202603
rank: 11
featured: true
contest: "https://code4rena.com/audits/2026-03-chainlink-payment-abstraction-v2"
report: "https://code4rena.com/audits/2026-03-chainlink-payment-abstraction-v2/submissions/S-1076"
poc: null
summary: "Signature validation compares the remaining token balance with the order's original sell amount. After enough of a partial fill, the same signed order can no longer be used."
---

## Summary

The auction accepts orders marked as partially fillable, but its signature check still expects the contract to hold the order's full original sell amount. The balance goes down as fills execute. Once it falls below that original amount, validating the same order reverts even when tokens remain for another fill.

## Expected invariant

A partially filled order should remain valid for settlement up to its unfilled amount. CoW Protocol tracks cumulative fills in its settlement contract, so the original sell amount and the balance needed for a later fill are not the same quantity.

## Root cause

`GPV2CompatibleAuction.isValidSignature` compares the contract's current balance with the immutable `order.sellAmount`:

```solidity
uint256 assetInBalance = order.sellToken.balanceOf(address(this));
if (order.sellAmount > assetInBalance) {
    revert InsufficientAssetInBalance(
        address(order.sellToken), order.sellAmount, assetInBalance
    );
}
```

The order amount stays fixed after signing. The contract balance changes after each fill. This check treats a partial fill as if the full original amount must still be available.

## Attack / failure path

1. The contract signs a partially fillable order for 100,000 USDC.
2. CoW settles a 10,000 USDC partial fill.
3. The contract now holds 90,000 USDC, while `order.sellAmount` is still 100,000.
4. CoW asks the contract to validate the same order for a later fill.
5. `isValidSignature` reverts, so that signed order cannot continue despite remaining inventory.

The failure occurs when the balance drops below the original sell amount. If the contract started with more than the order amount, an earlier partial fill might not hit the check yet.

## Impact

The remaining amount cannot be executed through the same order. The operator has to create and submit a replacement order. The PoC also checks a time-dependent auction quote before and after a five-minute delay; the later quote is lower, so a delayed replacement can receive worse execution. The test demonstrates the quote change, not a realized loss.

## Proof of concept

The submitted Foundry test is `test/poc/C4PoC.t.sol`, test `testSubmissionValidity`. It validates the order once, reduces the mock auction balance by 10,000 USDC to model a fill, then expects the next signature check to revert:

```solidity
uint256 fillAmount = 10_000e6;
mockUSDC.transferFrom(address(auction), attacker, fillAmount);

assertLt(mockUSDC.balanceOf(address(auction)), order.sellAmount);
vm.expectRevert();
auction.isValidSignature(orderHash, signature);
```

The test models the post-fill balance change directly with a mock relayer transfer; it does not run a full CoW settlement transaction. Run it from the protocol repository with:

```sh
forge test --match-test testSubmissionValidity -vvv
```

## Mitigation

Remove the requirement that the contract hold the full original `sellAmount` during signature validation. CoW settlement already tracks cumulative fills and prevents an order from being filled beyond its signed amount. Any replacement balance check should be based on the amount being settled now, not the original amount.

## Original report

The submitted record is Code4rena submission S-1076. Its public record does not include an independent disposition in the supplied report text.
