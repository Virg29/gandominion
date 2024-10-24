import Card from './card'
import Hand from './hand'
import PlayerDeck from './player-deck'

export default class TableDeck {
	card: Card
	remainingOnTable: number
	canIBuy: (hand: Hand) => boolean
	buy: (playerDeck: PlayerDeck) => PlayerDeck
	trash: (card: Card) => boolean
}
