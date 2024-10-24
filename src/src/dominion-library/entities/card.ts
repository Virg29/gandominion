export default abstract class Card {
	card: CardEnum
	cardType: CardType
	buyCost: number
	playCost: number
	canPlay: () => boolean
	play: () => void
}

export enum CardEnum {
	Copper = 0,
	Silver = 1,
	Gold = 2,
	Estate = 3,
	Duchy = 4,
	Province = 5,
	Curse = 6,
	Artisan = 7,
	Bandit = 8,
	Bureaucrat = 9,
	Cellar = 10,
	Chapel = 11,
	CounsilRoom = 12,
	Festival = 13,
	Gardens = 14,
	Harbringer = 15,
	Laboratory = 16,
	Library = 17,
	Market = 18,
	Merchant = 19,
	Militia = 20,
	Mine = 21,
	Moat = 22,
	Moneylender = 23,
	Poacher = 24,
	Remodel = 25,
	Sentry = 26,
	Smithy = 27,
	ThroneRoom = 28,
	Vassal = 29,
	Village = 30,
	Witch = 31,
	Workshop = 32,
}

export enum CardType {
	Action = 0,
	Duration = 1,
	Treasury = 2,
	Victory = 3,
}
