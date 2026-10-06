---
title: "A future snapshot can raise the veto threshold"
protocol: "Reserve Governor"
protocolType: "Governance and staking"
severity: "Medium"
platform: "Cantina"
contestPeriod: "May 2026"
contestSort: 202605
rank: 7
rankTotal: 129
featured: true
contest: "https://cantina.xyz/code/980a5976-9a7d-4014-b2e1-c248b4c6fa44"
report: "https://cantina.xyz/code/980a5976-9a7d-4014-b2e1-c248b4c6fa44/findings/766"
poc: null
summary: "Because the veto threshold uses supply from a future snapshot, stake added after a proposal is submitted can raise the number of votes needed to stop it."
---

## Summary

The optimistic governor calculates its veto threshold from the token supply at `voteStart`. But `voteStart` is set in the future. That leaves a window after a proposal is submitted when someone can add stake and increase the supply used in the calculation.

If the new stake makes the threshold larger than the community's combined voting weight, even unanimous opposition cannot veto the proposal.

## Expected invariant

Once a proposal is submitted, its veto threshold should not become harder to reach because someone adds stake before the voting snapshot. The threshold needs to use a supply snapshot that is fixed when the proposal is created.

## Root cause

`ProposalLib` sets the snapshot to `block.timestamp + voteDelay`. The governor later reads total supply at that future timestamp and multiplies it by the veto percentage:

```solidity
uint256 snapshot = proposalCore.voteStart;
uint256 pastSupply = token().getPastTotalSupply(snapshot);
uint256 vetoThresholdTok = (_vetoThreshold * pastSupply) / 1e18;
```

Staking deposits update voting power and supply checkpoints. A deposit made before `voteStart` is therefore included in the denominator, even though the proposal already exists.

## Attack path

1. The governor receives an optimistic proposal with a future `voteStart`.
2. A large staker sees the proposal and deposits before that snapshot.
3. The snapshot records the larger supply, so the required veto weight rises.
4. Community members vote against the proposal, but their combined weight is below the new threshold.
5. The proposal passes the optimistic path despite that opposition.

In the report's example, 1 million community tokens and a 20% threshold require 200,000 veto votes. Adding 10 million tokens before the snapshot raises supply to 11 million and the threshold to 2.2 million.

## Impact

If the proposal uses the optimistic path, a supply increase can make the veto condition unreachable for the existing community. The report describes malicious upgrades, parameter changes, and treasury actions as possible consequences; its proof of concept demonstrates the voting math and proposal state transition, not a particular harmful proposal being executed against a live deployment.

## Proof of concept

The submitted Foundry test is in `test/ReserveOptimisticGovernor.t.sol`. It creates an optimistic proposal, mints 10 million test tokens to a whale account, stakes and delegates them before the snapshot, then lets the community vote against the proposal.

The test checks that the calculated threshold exceeds the community's total votes and that the proposal reaches `Succeeded`. The mint and time warp are test controls; this is a local reproduction of the threshold calculation, not evidence of a live attack.

```solidity
uint256 whaleDeposit = 10_000_000e18;
underlying.mint(whale, whaleDeposit);
stakingVault.depositAndDelegate(whaleDeposit);

vm.warp(snapshotTime + 1);
uint256 requiredVetoVotes = (supplyAtSnapshot * 20) / 100;

assertTrue(requiredVetoVotes > communityTotalVotes);
assertEq(uint256(governor.state(proposalId)), uint256(IGovernor.ProposalState.Succeeded));
```

## Mitigation

Take the supply snapshot at proposal creation and store that fixed value or timestamp with the proposal. Later state checks should use the stored snapshot, rather than the future `voteStart` supply.

The report suggests using supply immediately before proposal creation. If the governor evaluates the threshold later, the creation-time reference must be stored; using the current `block.timestamp - 1` during a later state check would move the snapshot again.

## Report outcome

The Cantina record marks this submission as a duplicate of finding #9, which is shown as confirmed. This submission itself is marked **Duplicate**.
