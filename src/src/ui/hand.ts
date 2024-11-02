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
	CARD_WIDTH_SIZE,
	DISCARD_SHIFT,
	DISCARD_START_POS,
	HAND_AREA_POS,
	HAND_AREA_SIZE,
} from './config'
import { Circle } from 'konva/lib/shapes/Circle'

export default class Hand {
	static instance: Hand
	drawOn: Group
	regionSize: Vector2d
	startPos: Vector2d
	cards: CardInHand[] = []
	discard: DiscardedCard[] = []
	playOnMatPos: Vector2d
	playOnMatSize: Vector2d

	constructor(drawOn: Group) {
		Hand.instance = this
		Table.hand = this
		this.drawOn = drawOn
		this.startPos = HAND_AREA_POS
		this.regionSize = HAND_AREA_SIZE
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

	async updateHand(cards: { name: string }[], discard: { name: string }[]) {
		this.clearHandAndDiscard()

		const cardPositions = this.calculateCardPositions(cards.length)
		const cardPromises = cards.map((card, index) =>
			new CardInHand(
				this,
				card.name,
				getCardImageUrlByName(card.name),
				cardPositions[index]
			).loadImage()
		)

		const discardPositions = discard.map((_, index) => ({
			x: DISCARD_START_POS.x,
			y: DISCARD_START_POS.y + index * DISCARD_SHIFT,
		}))

		const discardPromises = discard.map((card, index) =>
			new DiscardedCard(
				getCardImageUrlByName(card.name),
				discardPositions[index]
			).loadImage()
		)

		const [loadedCards, loadedDiscards] = await Promise.all([
			Promise.all(cardPromises),
			Promise.all(discardPromises),
		])
		this.addCardsToGroup(loadedCards)
		this.cards.push(...loadedCards)
		this.addCardsToGroup(loadedDiscards)
		this.discard.push(...loadedDiscards)
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

	private addCardsToGroup(cards: (CardInHand | DiscardedCard)[]) {
		cards.forEach((card) => this.drawOn.add(card.image))
	}

	private clearHandAndDiscard() {
		this.cards.forEach((card) => card.destruct())
		this.discard.forEach((card) => card.destruct())
		this.cards = []
		this.discard = []
	}
}

export class DiscardedCard {
	image: Image
	constructor(private url: string, private position: Vector2d) {}

	loadImage(): Promise<DiscardedCard> {
		return this.loadImageWithSettings(false, 0.5)
	}

	destruct() {
		this.image.destroy()
	}

	private loadImageWithSettings(
		draggable: boolean,
		scale: number
	): Promise<DiscardedCard> {
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
				img.draggable(draggable)
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
