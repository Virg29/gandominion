import { State } from '../types/game-state'
import Hand from './hand'
import PlayerDeck from './player-deck'

export default class Player {
	turnActions: number
	turnBuys: number
	buyPotentia:number

	deck: PlayerDeck
	hand: Hand
	constructor() {
		this.turnActions = 0
		this.turnBuys = 0
		this.deck = new PlayerDeck()
		this.hand = this.deck.hand
	}

	onTurn(state: State) {
		const {PlayerState} = state
		this.turnActions = PlayerState.ActionsCount
		this.turnBuys = PlayerState.BuyCount
		this.buyPotentia = PlayerState.AdditionalMoney
		
		this.hand = PlayerState.Hand.map((card)=>{
			card.
		})
	}
}
