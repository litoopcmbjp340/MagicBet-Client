<h1 align="center">
  <span role="img" aria-label="tophat">
    🎩
  </span>
  MagicBet - Client
</h1>
<h2 align="center">Lossless Ethereum Betting</h2>

<br/>

MagicBet is a no loss betting platform, built on the Ethereum ecosystem. It allows users to bet on real life future events and outcomes without risking their stake.

All stakes accrue interest until the event which is bet on happens. The interest payment is then shared among the winners, and all participants (winners and losers) get their stakes back - thus allowing users to save money in a fun manner.

Users are minted ERC20 tokens equalling the Dai bet, which must be burnt when receiving their stake back (and winnings, if any).

This repo contains the front end client, the smart contracts code can be found under the following link.

[Corresponding Contracts](https://github.com/BetTogether/MagicBet-Contracts)

## Setup

Given that [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) are installed, clone the repo and then run `npm install` inside the root directory to install the dependencies.

Now follow the Setup instructions in the Contracts repo (link above), including copying the application binary interface files in the `abis/` folder, and take a note of the address of the deployed `MBMarketFactory.sol`, and update the relevant variable in `src/utils/addresses.ts` (line 6 for kovan).

## Start local server

Run `npm start`

Your browser will now open the platform site.

## How to use the app

Originally, only a factory contract will be deployed. To deploy a market, click _Create Market_ in the dashboard tab.

You will be given a set of options to complete. They are pre-filled with a sample market (November 2020 US Election).

- Event name: self-explanatory
- Realit.io question: this is the string that is passed to the oracle when the market contract is deployed. It is in a specific format, as outlined in the realit.io documentation
- Arbitrator: who ultimately decides the outcome in the case of continued disputes
- Opening: the timestamp when betting opens
- Locking: the timestamp when betting ends
- Resolution: the timestamp of when the event itself occurs, sent to the oracle
- Timeout: sent to the oracle, determines how many seconds the oracle waits for a dispute before finalizing an answer
- Outcomes: this is an array of strings, with each outcome name. This variable is also used to name the ERC20 token for each outcome.

After a market is created, it will be in the _WAITING_ state. The state must be incremented before it will move to the _OPEN_ state, which can be achieved by selecting _increment state_. Note that this tx will revert if the Opening timestamp is in the future.

The market is Ownable, and only the owner can increment state. The owner is whoever created the market.

Once the market is in the _OPEN_ state, you are free to make bets, by selecting the outcome you wish to bet on and pressing _Enter_.

To conclude the event, first change the state to _LOCKED_, again by selecting _increment state_. This tx will revert if the Locking timestamp is in the future.

At this point, the contract needs to know who won the event. This is achieved by selecting _determine winner_ at which point the contract will ask the Oracle if the event has resolved, and if so, who won. If the event has not yet resolved, the tx will not revert, but it will not change the state, and will have to be called again. If the market has resolved, calling this function will take note of the winner, and move the contract to the _WITHDRAW_ state.

For testing purposes, the oracle can be resolved by visiting [Realit.io](https://realitio.github.io/) (for Kovan), selecting the event, and submitting the correct answer. This is only possible if the resolution timestamp is in the past. After submitting a correct answer, you must wait until _Timeout_ seconds have passed, before it is finalized.

Once the contract is in the _WITHDRAW_ state, a withdraw button will appear. Selecting this will always return your original bet, if you bet on the winning outcome it will also send you your share of the accumulated interest.
