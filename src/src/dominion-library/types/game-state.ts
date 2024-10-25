export interface State {
	GameId: string
	Players: Player[]
	Kingdom: Kingdom
	PlayerId: string
	PlayerState: PlayerState
}

export interface Player {
	Name: string
	PublicState: PublicState
}

export interface PublicState {
	Hand: any[]
	OnPlay: any[]
	PublicDiscard: any[]
	ActionsCount: number
	BuyCount: number
	AdditionalMoney: number
	AllCards: AllCard[]
}

export interface AllCard {
	$type: string
	Name: string
	Cost: number
	Money?: number
	Text: string
	CardTypeId: number
	Types: number[]
	VictoryPoints?: number
}

export interface Kingdom {
	Piles: Piles
	Trash: any[]
}

export interface Piles {
	[key: string]: Card
}

export interface Card {
	Type: number
	Count: number
	Cost: number
}

export interface PlayerState {
	Deck: Deck[]
	Hand: Hand[]
	OnPlay: any[]
	PublicDiscard: any[]
	ActionsCount: number
	BuyCount: number
	AdditionalMoney: number
	TotalMoney: number
	AllCards: AllCard2[]
	Discard: any[]
}

export interface Deck {
	$type: string
	Name: string
	Cost: number
	Money?: number
	Text: string
	CardTypeId: number
	Types: number[]
	VictoryPoints?: number
}

export interface Hand {
	$type: string
	Name: string
	Cost: number
	Money?: number
	Text: string
	CardTypeId: number
	Types: number[]
	VictoryPoints?: number
}

export interface AllCard2 {
	$type: string
	Name: string
	Cost: number
	Money?: number
	Text: string
	CardTypeId: number
	Types: number[]
	VictoryPoints?: number
}
