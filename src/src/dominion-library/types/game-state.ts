export interface State {
	GameId: string
	Players: Player[]
	Kingdom: Kingdom
	PlayerId: string
	PlayerState: CurrentPlayerState
	turn: number
}

export interface Player {
	Name: string
	PublicState: PublicState
}

export interface PublicState {
	OnPlay: number[]
	AllCards: number[]
	PublicDiscard: number[]
}

export interface Kingdom {
	Piles: Piles
	Trash: number[]
}

export interface Piles {
	[key: number]: Pile
}

export interface Pile {
	Type: number
	Count: number
	Cost: number
}

export interface CurrentPlayerState {
	Deck: number[]
	Hand: number[]
	OnPlay: number[]
	ActionsCount: number
	BuyCount: number
	AdditionalMoney: number
	TotalMoney: number
	AllCards: number[]
	Discard: number[]
}
