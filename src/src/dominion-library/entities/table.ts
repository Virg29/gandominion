import Card from './card'
import { Pile } from './pile'
import { Player, PlayerEnemy } from './player'

export interface Table {
	piles: Pile[]
	trash: Card[]
	players: PlayerEnemy[]
	me: Player
}
