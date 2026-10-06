---
title: "Exact-output rounding can reduce input to zero"
protocol: "Revert Finance — Stableswap Hooks"
protocolType: "StableSwap AMM"
severity: "Medium"
platform: "Cantina"
contestPeriod: "Apr 2026"
contestSort: 202604
rank: 60
rankTotal: 269
featured: true
contest: "https://cantina.xyz/code/e55ee7b9-6c99-42f8-8338-39f3dd134ef3"
report: "https://cantina.xyz/code/e55ee7b9-6c99-42f8-8338-39f3dd134ef3/findings/268"
poc: null
summary: "On mixed-decimal pools, rounding the exact-output input down can turn a small positive input into zero. The fee calculation then also returns zero."
---

## Summary

An exact-output swap can ask for a small amount of an 18-decimal token from a pool paired with a lower-decimal token. `StableSwapMath.descale` rounds the required input down when it converts from scaled units. If the result is less than one native unit of the input token, it becomes zero.

The fee is calculated from that raw input. A rounding-up fee calculation still returns zero when its input is zero, so the swap can transfer output without collecting input or a fee.

## Expected invariant

An exact-output swap that transfers a positive amount from the pool should collect a positive amount of input, or reject the swap. Rounding must not turn a positive scaled input into a free withdrawal.

## Root cause

The conversion divides with integer truncation:

```solidity
function descale(uint256 amount, uint256 rate) internal pure returns (uint256) {
    return amount * RATE_PRECISION / rate;
}
```

The exact-output path uses this value as `rawAmountIn`. The fee uses that same raw input, so when it is zero the fee is also zero. Rounding the fee up cannot recover an amount that was already truncated to zero.

## Attack path

1. An attacker uses an exact-output swap in a pool with tokens that have different decimal precision.
2. The requested output maps to a positive scaled input that is smaller than one native unit of the lower-decimal token.
3. `descale` truncates the input to zero.
4. The fee calculation receives zero and returns zero.
5. The pool sends the requested output without collecting input or fees.

The report discusses repeated swaps and batching through Uniswap v4 flash accounting as a way to amplify the drain. The supplied proof of concept demonstrates one swap; it does not demonstrate the larger batch estimate.

## Impact

The demonstrated swap transfers DAI from a 6-decimal USDC / 18-decimal DAI pool while spending zero USDC. Repeating the operation could reduce pool reserves. The report's estimate for wider decimal gaps and thousands of batched swaps depends on the listed assets, router behavior, and gas cost; those conditions are not covered by the attached single-swap test.

## Proof of concept

The submitted Foundry test, `test/RoundingDrain.t.sol`, deploys the real hook and router flow with mock 6-decimal USDC and 18-decimal DAI. It requests `999_999_999_000` DAI wei and then checks the actual token balances:

```solidity
uint256 targetOutput = 999_999_999_000;
// Execute one exact-output swap through the Universal Router.

assertEq(usdcSpent, 0, "Swapper should have paid ZERO USDC");
assertEq(daiReceived, targetOutput, "Swapper should have received DAI for free");
```

This is a local test against the protocol contracts and mock tokens, not a live-pool or batched-drain reproduction.

## Mitigation

Round the exact-output input up when converting back to native token units, and reject a zero input before settling the swap. For example:

```solidity
return Math.mulDiv(amount, RATE_PRECISION, rate, Math.Rounding.Ceil);
```

Use this round-up conversion on the exact-output input path. A separate `rawAmountIn > 0` check provides a clear guard against free output.

## Report outcome

The Cantina record marks this submission as a duplicate of finding #8, which is shown as confirmed. This submission itself is marked **Duplicate**.
