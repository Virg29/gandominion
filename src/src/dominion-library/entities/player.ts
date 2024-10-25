import Card from './card'

export interface Player {
	turnActions: number
	turnBuys: number
	buyPotentia: number

	allCards: Card[]

	deck: Card[]

	discard: Card[]
	hand: Card[]
}

export interface PlayerEnemy {
	publicDiscard: Card[]
	allCards: Card[]
}
