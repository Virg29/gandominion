import { Group } from 'konva/lib/Group'
import { Image } from 'konva/lib/shapes/Image'
import { Vector2d } from 'konva/lib/types'
import { getCardImageUrlByName } from './cards-images'
import { Hoverlightable } from '../mixins/hoverlight'
import { applyMixins } from '../common/utils/apply-mixins'
import { MultipleListener } from '../mixins/multiplelistener'
import { Table } from './table'
import { PlayArea } from './play-area'

const CARD_WIDTH_SIZE = 110

export default class Hand {
	drawOn: Group
	regionSize: Vector2d
	startPos: Vector2d
	cards: CardInHand[] = []

	playOnMatPos: Vector2d
	playOnMatSize: Vector2d

	constructor(drawOn: Group, startPos: Vector2d, size: Vector2d) {
		Table.hand = this
		this.drawOn = drawOn
		;(this.startPos = startPos), (this.regionSize = size)
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

	clear() {}

	async updateHand(cards: { name: string }[]) {
		if (this.cards.length) {
			this.cards.forEach((card) => {
				card.destruct()
				console.log('lol')
			})
			this.cards = []
		}

		const maxAmount = this.regionSize.x / CARD_WIDTH_SIZE
		console.log(this.regionSize.x)
		let i = 0
		const loadingPromises: Promise<CardInHand>[] = []
		for (const card of cards) {
			loadingPromises.push(
				new CardInHand(
					this,
					card.name,
					getCardImageUrlByName(card.name),
					{
						x:
							this.startPos.x +
							(cards.length < maxAmount
								? CARD_WIDTH_SIZE
								: this.regionSize.x / (cards.length + 1)) *
								i,
						y: this.startPos.y,
					}
				).loadImage()
			)
			i++
		}
		const loadedCards = await Promise.all(loadingPromises)
		loadedCards.forEach((card) => {
			this.drawOn.add(card.image)
		})
		this.cards.push(...loadedCards)
	}
}

export interface CardInHand extends MultipleListener, Hoverlightable {}

export class CardInHand {
	image: Image
	url: string
	position: Vector2d
	hand: Hand
	name: string

	constructor(hand: Hand, name: string, url: string, position: Vector2d) {
		this.url = url
		this.position = position
		this.hand = hand
		this.name = name
	}

	loadImage(): Promise<CardInHand> {
		return new Promise((res, rej) => {
			Image.fromURL(this.url, (img) => {
				img.draggable(true)
				img.scale({ x: 0.5, y: 0.5 })
				img.position(this.position)
				this.image = img
				this.initMultipleListener(this.image, true)
				this.setFiltersApplyable(this.image)
				this.applyHoverLightEvent()
				this.applyEvents()
				res(this)
			})
		})
	}

	applyEvents() {
		this.on(
			'click',
			(e) => {
				if (!PlayArea.instance.isActive) return
				PlayArea.instance.addPlaySequenceCard(this.name)
			},
			this
		)
		this.on(
			'tap',
			(e) => {
				if (!PlayArea.instance.isActive) return
				PlayArea.instance.addPlaySequenceCard(this.name)
			},
			this
		)
		this.on(
			'dragend',
			(e) => {
				const endPos = e.target.position()
				if (
					this.hand.wasPlayed(endPos) &&
					!PlayArea.instance.isActive
				) {
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
			},
			this
		)
	}

	destruct() {
		this.image.destroy()
	}
}

applyMixins(CardInHand, [MultipleListener, Hoverlightable])
