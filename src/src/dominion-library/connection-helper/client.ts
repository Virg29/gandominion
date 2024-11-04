import { State } from '../types/game-state'
import {
	mapCurrentStateToPlayer,
	mapEnemyStateToPlayer,
	mapNumbersToCards,
	mapPilesStateToPiles,
} from './mappers'
import { Pile } from '../entities/pile'
import Card from '../entities/card'
import { Table } from '../entities/table'
import { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

export default class DominionIOClient {
	socket: Socket
	onTurn: (data: Table) => void
	updateState: (data: Table) => void
	clarificatePlay: (cards: number[], cb: (data: number[]) => void) => void
	endGame: (...args: any) => void

	static processState(data: State): Table {
		const actualState = data
		const playerState = actualState.PlayerState
		const enemiesState = actualState.Players
		const { Piles: pilesState, Trash: trashState } = actualState.Kingdom

		const me = mapCurrentStateToPlayer(playerState)
		const entities = enemiesState.map((player) =>
			mapEnemyStateToPlayer(player.PublicState)
		)
		const piles: Pile[] = mapPilesStateToPiles(pilesState)
		const trash: Card[] = mapNumbersToCards(trashState)

		const table: Table = {
			me,
			trash,
			players: entities,
			piles: piles,
			turn: actualState.Turn,
		}
		return table
	}

	errorEmitter: (err: any) => void
	constructor(errorEmitter: (err: string) => void) {
		this.errorEmitter = errorEmitter
	}

	setUpConnection(
		address: string,
		port: string,
		playerName: string,
		roomName: string,
		playersAmount: number,
		spectator: boolean,
		onTurn: (data: Table) => void,
		updateState: (data: Table) => void,
		clarificatePlay: (...args: any) => void,
		endGame: (...args: any) => void
	) {
		this.onTurn = onTurn
		this.updateState = updateState
		this.clarificatePlay = clarificatePlay
		this.endGame = endGame

		this.socket = io(`ws://${address}:${port}`)

		this.socket.on('playTurn', (state: State) => {
			this.onTurn(DominionIOClient.processState(state))
		})

		this.socket.on('updateState', (state: State) => {
			this.updateState(DominionIOClient.processState(state))
		})

		this.socket.on(
			'clarificatePlay',
			(
				data: {
					PlayedCard: number
					PlayedBy: number | null
					Args: number[]
				},
				cb
			) => {
				clarificatePlay(data, cb)
			}
		)

		this.socket.on(
			'endGame',
			(data: {
				WinnerName: string
				Players: {
					Name: string
					Place: number
					VictoryPoints: number
				}[]
			}) => {
				endGame(data)
			}
		)

		this.socket.on('exception', (data: any) => {
			this.errorEmitter(data)
		})

		this.socket.emit('joinRoom', {
			PlayerName: playerName,
			RoomName: roomName,
			RoomSize: playersAmount,
			IsSpectator: spectator,
		})
	}

	playCard(data: { playedCard: number; args: number[] }) {
		this.socket.emit('playCard', data, (state: State) => {
			console.log(state)
			this.onTurn(DominionIOClient.processState(state))
		})
	}

	buyCards(data: { args: number[] }) {
		this.socket.emit('buyCards', data)
	}
}
