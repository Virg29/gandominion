import DominionIOClient from '../dominion-library/connection-helper/client'
import { Table } from '../dominion-library/entities/table'
import { PlayArea } from './play-area'
import { Table as UiTable } from './table'

export default class GameManager {
	static instance: GameManager

	constructor() {
		this.ioClient = new DominionIOClient((errorMsg) => {
			UiTable.showMessage(errorMsg)
		})
		GameManager.instance = this
	}

	ioClient: DominionIOClient

	init(
		address: string,
		port: string,
		name: string,
		room: string,
		players: number
	) {
		this.ioClient.setUpConnection(
			address,
			port,
			name,
			room,
			players,
			(data) => {
				this.onTurn(data)
			},
			(data) => {
				// this.onTurn(data)
			},
			(data) => {
				console.log(data)
			}
		)
	}

	onTurn(data: Table) {
		UiTable.hand.updateHand(
			data.me.hand.map((card) => ({ name: card.name }))
		)

		UiTable.piles.updatePiles(
			data.piles.map((pile) => ({
				amount: pile.amount,
				name: pile.card.name,
			}))
		)

		PlayArea.instance.updateText(
			data.me.turnActions,
			data.me.turnBuys,
			data.me.buyPotentia
		)

		UiTable.showMessage('Ur TURN!', 'info')
	}

	buy(data: number[]) {
		this.ioClient.buyCards({ args: data })
	}

	play(playedCard: number, args: number[]) {
		this.ioClient.playCard({ playedCard, args })
	}
}
