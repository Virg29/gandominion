import { Group } from 'konva/lib/Group'
import { Image } from 'konva/lib/shapes/Image'
import { Vector2d } from 'konva/lib/types'
import { getCardImageUrlByName } from './cards-images'
import { Hoverlightable } from '../mixins/hoverlight'
import { applyMixins } from '../common/utils/apply-mixins'
import { MultipleListener } from '../mixins/multiplelistener'
import { Table } from './table'
import { PlayArea } from './play-area'
import {
	DECK_SHIFT_Y,
	DECK_SHIFT_X,
	CARD_WIDTH_SIZE,
	DECK_START_POS,
	HAND_AREA_POS,
	HAND_AREA_SIZE,
	DECK_COLUMN_MAX,
} from './config'

export default class Hand {
	static instance: Hand
	disabled: boolean = false

	drawOn: Group
	regionSize: Vector2d
	startPos: Vector2d
	cards: CardInHand[] = []
	deck: DeckCard[] = []
	playOnMatPos: Vector2d
	playOnMatSize: Vector2d

	constructor(drawOn: Group) {
		Hand.instance = this
		Table.hand = this

		this.drawOn = drawOn
		this.startPos = HAND_AREA_POS
		this.regionSize = HAND_AREA_SIZE
	}

	disable() {
		this.disabled = true
		this.cards.forEach((cardInHand) => cardInHand.image.draggable(false))
	}

	enable() {
		this.disabled = false
		this.cards.forEach((cardInHand) => cardInHand.image.draggable(true))
	}

	setPlayOnMatRegion(startPos: Vector2d, size: Vector2d) {
		this.playOnMatPos = startPos
		this.playOnMatSize = size
	}

	wasPlayed(pos: Vector2d) {
		const xRelative = pos.x - this.playOnMatPos.x
		const yRelative = pos.y - this.playOnMatPos.y
		return (
			xRelative >= 0 &&
			xRelative <= this.playOnMatSize.x &&
			yRelative >= 0 &&
			yRelative <= this.playOnMatSize.y
		)
	}

	async updateHand(cards: { name: string }[], myDeck: { name: string }[]) {
		this.clearHandAndDeck()

		const cardPositions = this.calculateCardPositions(cards.length)
		const cardPromises = cards.map((card, index) =>
			new CardInHand(
				this,
				card.name,
				getCardImageUrlByName(card.name),
				cardPositions[index]
			).loadImage()
		)

		const discardPositions = myDeck.map((_, index) => ({
			x:
				DECK_START_POS.x +
				Math.floor(index / DECK_COLUMN_MAX) * DECK_SHIFT_X,
			y: DECK_START_POS.y + (index % DECK_COLUMN_MAX) * DECK_SHIFT_Y,
		}))

		const myDeckPromises = myDeck.map((card, index) =>
			new DeckCard(
				getCardImageUrlByName(card.name),
				discardPositions[index]
			).loadImage()
		)

		const [loadedCards, loadedMyDeck] = await Promise.all([
			Promise.all(cardPromises),
			Promise.all(myDeckPromises),
		])
		this.addCardsToGroup(loadedCards)
		this.cards.push(...loadedCards)
		this.addCardsToGroup(loadedMyDeck)
		this.deck.push(...loadedMyDeck)
	}

	private calculateCardPositions(cardCount: number): Vector2d[] {
		const maxAmount = this.regionSize.x / CARD_WIDTH_SIZE
		const positionIncrement =
			cardCount < maxAmount
				? CARD_WIDTH_SIZE
				: this.regionSize.x / (cardCount + 1)
		return Array.from({ length: cardCount }, (_, i) => ({
			x: this.startPos.x + positionIncrement * i,
			y: this.startPos.y,
		}))
	}

	private addCardsToGroup(cards: (CardInHand | DeckCard)[]) {
		cards.forEach((card) => this.drawOn.add(card.image))
	}

	clearHand() {
		this.cards.forEach((card) => card.destruct())
		this.cards = []
	}

	private clearHandAndDeck() {
		this.cards.forEach((card) => card.destruct())
		this.deck.forEach((card) => card.destruct())
		this.cards = []
		this.deck = []
	}
}

export class DeckCard {
	image: Image
	constructor(private url: string, private position: Vector2d) {}

	loadImage(): Promise<DeckCard> {
		return this.loadImageWithSettings(false, 0.5)
	}

	destruct() {
		this.image.destroy()
	}

	private loadImageWithSettings(
		draggable: boolean,
		scale: number
	): Promise<DeckCard> {
		return new Promise((res) => {
			Image.fromURL(this.url, (img) => {
				img.draggable(draggable)
				img.scale({ x: scale, y: scale })
				img.position(this.position)
				this.image = img
				res(this)
			})
		})
	}
}

export interface CardInHand extends MultipleListener, Hoverlightable {}

export class CardInHand {
	image: Image
	constructor(
		private hand: Hand,
		public name: string,
		private url: string,
		private position: Vector2d
	) {}

	loadImage(): Promise<CardInHand> {
		return this.loadImageWithSettings(
			true,
			0.5,
			this.attachEvents.bind(this)
		)
	}

	private attachEvents() {
		const playHandler = () => {
			if (!PlayArea.instance.isActive) return
			PlayArea.instance.addPlaySequenceCard(this.name)
		}
		//for desktop and touchscreen devices
		this.on('click', playHandler, this)
		this.on('tap', playHandler, this)

		this.on('dragend', this.handleDragEnd.bind(this), this)
	}

	private handleDragEnd(e: Event & { target: Image }) {
		let endPos: Vector2d = e.target.position()
		endPos.x += e.target.width() / (2 / e.target.scaleX())
		endPos.y += e.target.height() / (2 / e.target.scaleY())

		if (this.hand.wasPlayed(endPos) && !PlayArea.instance.isActive) {
			PlayArea.instance.currentPlayed = this
			PlayArea.instance.clearAll()
			PlayArea.instance.isActive = true
		} else {
			if (PlayArea.instance.currentPlayed === this) {
				PlayArea.instance.clearAll()
				PlayArea.instance.isActive = false
			}
			this.image.position(this.position)
		}
	}

	destruct() {
		this.image.destroy()
	}

	private loadImageWithSettings(
		draggable: boolean,
		scale: number,
		eventSetup: () => void
	): Promise<CardInHand> {
		return new Promise((res) => {
			Image.fromURL(this.url, (img) => {
				img.draggable(draggable && !Hand.instance.disabled)
				img.scale({ x: scale, y: scale })
				img.position(this.position)
				this.image = img
				this.initMultipleListener(this.image, true)
				this.setFiltersApplyable(this.image)
				this.applyHoverLightEvent()
				eventSetup()
				res(this)
			})
		})
	}
}

applyMixins(CardInHand, [MultipleListener, Hoverlightable])
