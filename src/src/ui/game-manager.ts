import DominionIOClient from '../dominion-library/connection-helper/client'
import { Table } from '../dominion-library/entities/table'
import { BuyButton } from './buy-button'
import { ClarificatePlayMenu } from './clarificate-play'
import Hand from './hand'
import { PlayArea } from './play-area'
import { PlayButton } from './play-button'
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
		players: number,
		spectator: boolean
	) {
		this.ioClient.setUpConnection(
			address,
			port,
			name,
			room,
			players,
			spectator,
			(data) => {
				this.onTurn(data)
			},
			(data) => {
				this.updateState(data)
			},
			(data, cb) => {
				console.log(data, cb)
				this.onClarificate(data, cb)
			},
			(data: {
				WinnerName: string
				Players: {
					Name: string
					Plays: number
					VictoryPoints: number
				}[]
			}) => {
				UiTable.showMessage(`winner: ${data.WinnerName}`)
			}
		)
	}

	onClarificate(
		data: {
			PlayedCard: number
			PlayedBy: number | null
			Args: { $values: number[] }
		},
		cb: (data: { Args: number[] }) => void
	) {
		ClarificatePlayMenu.instance.clarify(data, cb)
	}

	updateState(data: Table) {
		UiTable.hand.updateHand(
			data.me.hand.map((card) => ({ name: card.name })),
			data.me.allCards.map((card) => ({
				name: card.name,
			}))
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
	}

	onTurn(data: Table) {
		Hand.instance.enable()
		PlayButton.instance.enable()
		BuyButton.instance.enable()

		UiTable.hand.updateHand(
			data.me.hand.map((card) => ({ name: card.name })),
			data.me.allCards.map((card) => ({
				name: card.name,
			}))
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

		UiTable.instance.updateTurnCounter(data.turn)
		UiTable.showMessage('Ur TURN!', 'info')
	}

	buy(data: number[]) {
		this.ioClient.buyCards({ args: data })
		Hand.instance.clearHand()
		Hand.instance.disable()
		PlayButton.instance.disable()
		BuyButton.instance.disable()
	}

	play(playedCard: number, args: number[]) {
		this.ioClient.playCard({ playedCard, args })
	}
}
