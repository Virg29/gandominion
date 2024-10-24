import Card from './card'
import Hand from './hand'

export default class PlayerDeck {
	deck: Card[]
	hand: Hand
	discarded: Card[]
}
