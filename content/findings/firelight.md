---
title: "A mutable period checkpoint can cap a valid payout"
protocol: "Firelight"
protocolType: "DeFi cover vault"
severity: "Medium"
platform: "Immunefi"
contestPeriod: "Aug 2026"
contestSort: 202608
rank: 128
featured: true
contest: "https://immunefi.com/audit-competition/audit-comp-firelight-1/leaderboard/"
report: "https://reports.immunefi.com/firelight-sep.2026-or-audit-competition"
poc: null
summary: "A withdrawal at the exact period boundary can replace the checkpoint used for a committed cover allocation. In the local PoC, that made a valid incident receive zero from the vault."
---

## Summary

Firelight commits cover capacity using the vault's assets at the start of a period. At that exact timestamp, a later withdrawal or redemption can write another checkpoint with the same timestamp and a lower asset value. The allocator keeps the capacity it already committed, but the payout path reads the changed checkpoint.

In the submitted local test, the allocator commits 1,100 units of capacity. A same-boundary withdrawal changes the period-start assets to zero. A later valid incident then receives zero from the vault, while the pending withdrawal remains claimable.

This sequence depends on a narrow condition: the commitment and withdrawal must be ordered in the same block at the exact period-start timestamp.

## Expected invariant

A withdrawal started during a period remains exposed to incidents in that period. It should not be possible to change the historical assets used for that period's payout after cover capacity has already been committed.

## Root cause

`commitAllocation()` reads `totalAssetsAt(currentPeriodStart())` and stores the resulting capacity. At the boundary, that checkpoint is still mutable. A withdrawal logs a new value at the same timestamp, and `Trace256.push()` replaces the prior checkpoint when the key matches.

Settlement uses the stored commitment without checking that the snapshot still matches. Later, `payout()` applies `totalAssetsAt(capturePeriodStart)` as a separate cap:

```solidity
paidAmount = Math.min(
    amount,
    Math.min(assetsAtCapturePeriod, activePayableAmount)
);
```

Including pending withdrawals in `activePayableAmount` does not fix the issue if the historical snapshot is lower; the minimum can still reduce the payout to zero.

## Attack path

1. A cover allocation is committed at the exact start of a new period, using the current higher vault snapshot.
2. Later in the same block, a shareholder calls the public `withdraw()` or `redeem()` function.
3. The withdrawal writes a lower checkpoint at the same timestamp, but does not change the capacity already stored by the allocator.
4. The cover order settles against the old committed capacity.
5. A valid incident occurs in that period. The payout path reads the lower checkpoint and pays zero or less than the approved amount.
6. In the PoC, the incident closes with no vault payout and the shareholder later claims the full pending withdrawal.

The calls are permissionless, but the required same-block ordering is opportunistic. The attached test forces that ordering; it does not show how reliably an attacker can obtain it on a live network.

## Impact

Under the test conditions, a cover buyer receives less than the approved loss because the vault payout is capped by the changed checkpoint. The withdrawing shareholder preserves the pending principal and claims it after the withdrawal period. The incident manager closes the incident, leaving no later on-chain retry in the demonstrated flow.

The PoC uses a local deployment and mocks, not a mainnet fork. It demonstrates the accounting and incident lifecycle once the precise ordering is established; it does not establish that a production attacker can reliably win that ordering.

## Proof of concept

The Hardhat test deploys the vault, allocator, cover NFT, and incident manager, with local token and price-feed mocks. It forces the boundary ordering, then runs the cover and incident through the contracts:

1. Move to the exact period-start timestamp and disable automining.
2. Submit `commitAllocation()` first, then `withdraw()` in the same block.
3. Settle the cover and approve a valid incident.
4. Check the vault payout, incident state, and later withdrawal claim.

**Observed result**

| Check | Result |
| --- | ---: |
| Capacity committed | 1,100 USD |
| Period-start assets after withdrawal | 0 tokens |
| Pending withdrawal | 1,000 tokens |
| Requested vault payout | 1,000 tokens |
| Actual vault payout | 0 tokens |
| Incident state | Closed |
| Later withdrawal claim | 1,000 tokens |

Run the supplied test from the Firelight repository with:

```sh
npm ci
./node_modules/.bin/hardhat test test/poc/BoundaryCheckpointPoc.js
```

This is a deterministic local reproduction with controlled transaction ordering. It uses local mocks and is not a mainnet-fork test.

## Mitigation

Do not let the allocator consume a period-start checkpoint until that checkpoint is final. The report suggests rejecting `commitAllocation()` when `block.timestamp == currentPeriodStart()`.

For defense in depth, store the exact snapshot used for each commitment and compare it before the first settlement. If it changed, require cancellation or a new commitment. An explicit snapshot-finalization step would also make the value immutable before allocation.

## Review outcome

The supplied Immunefi review marked the report **Closed**. It said the local PoC forced the exact timestamp and same-block ordering, and did not establish that an untrusted user could reliably reach those conditions in production. The review also matched the report to an earlier submission, #88585. The pasted record includes a follow-up appeal but no later decision, so this page does not claim that the appeal changed the outcome.

## References

- [Firelight vault source](https://github.com/immunefi-team/audit-comp-firelight/blob/v1_audit_ready/contracts/core/FirelightVault.sol)
- [Deployments and withdrawals](https://docs.firelight.finance/for-stakers/deployments-and-withdrawals.md)
- [Claims liquidation](https://docs.firelight.finance/protocol-architecture/claims-liquidation.md)
