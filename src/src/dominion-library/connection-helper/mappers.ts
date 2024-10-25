import Card, { CardEnum } from '../entities/card'
import { Player, PlayerEnemy } from '../entities/player'
import { Pile as OurPile } from '../entities/pile'

import {
	CurrentPlayerState,
	Pile,
	Piles,
	PublicState,
} from '../types/game-state'

export function mapNumbersToCards(cards: number[]): Card[] {
	return cards.map(
		(card): Card => ({
			card: card,
			name: CardEnum[card],
		})
	)
}

export function mapCurrentStateToPlayer(state: CurrentPlayerState): Player {
	const hand = mapNumbersToCards(state.Hand)
	const discard = mapNumbersToCards(state.Discard)
	const deck = mapNumbersToCards(state.Deck)
	const all = mapNumbersToCards(state.AllCards)

	const player: Player = {
		allCards: all,
		buyPotentia: state.TotalMoney,
		deck,
		hand,
		discard,
		turnActions: state.ActionsCount,
		turnBuys: state.BuyCount,
	}

	return player
}

export function mapEnemyStateToPlayer(state: PublicState): PlayerEnemy {
	const publicDiscard = mapNumbersToCards(state.PublicDiscard)
	const all = mapNumbersToCards(state.AllCards)

	const player: PlayerEnemy = {
		allCards: all,
		publicDiscard,
	}

	return player
}

export function mapPilesStateToPiles(state: Piles): OurPile[] {
	const values = Object.values(state)
	const piles: OurPile[] = values.map((value: Pile) => ({
		amount: value.Count,
		card: {
			card: value.Type,
			name: CardEnum[value.Type],
		},
		cost: value.Cost,
	}))

	return piles
}
