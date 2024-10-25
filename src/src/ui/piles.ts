import { Group } from 'konva/lib/Group'
import { Image } from 'konva/lib/shapes/Image'
import { Vector2d } from 'konva/lib/types'
import { getCardImageUrlByName } from './cards-images'
import { Text } from 'konva/lib/shapes/Text'
import { MultipleListener } from '../mixins/multiplelistener'
import { Hoverlightable } from '../mixins/hoverlight'
import { applyMixins } from '../common/utils/apply-mixins'
import { Table } from './table'
import { BuyButton } from './buy-button'
import { CardEnum } from '../dominion-library/entities/card'
import GameManager from './game-manager'
import { PlayArea } from './play-area'

const CARDS_IN_LINE = 8
const TOTAL_LINES = 3

const PREBUY_STORAGE_POS = {
	x: 900,
	y: 400,
}

const PREBUY_STORAGE_SHIFT = 50

export default class Piles {
	drawOn: Group
	regionSize: Vector2d
	startPos: Vector2d
	piles: Pile[] = []
	preBuyCards: PreBuyCard[] = []

	buyButton: BuyButton

	constructor(drawOn: Group, startPos: Vector2d, size: Vector2d) {
		Table.piles = this
		this.drawOn = drawOn
		;(this.startPos = startPos), (this.regionSize = size)

		this.buyButton = new BuyButton(drawOn, this, {
			x: 1180,
			y: 550,
		})
	}

	buyAll() {
		const names = this.preBuyCards.map((card) => card.name)
		const types = names.map(
			(name) =>
				Object.keys(CardEnum)[Object.values(CardEnum).indexOf(name)]
		)
		console.log(types)
		GameManager.instance.buy(types as unknown as number[])

		if (this.preBuyCards.length)
			this.preBuyCards.forEach((card) => card.destruct())
		this.preBuyCards = []
	}

	addToPreBuy(name: string) {
		this.preBuyCards.push(
			new PreBuyCard(
				this.drawOn,
				this,
				name,
				getCardImageUrlByName(name),
				{
					x:
						PREBUY_STORAGE_POS.x +
						this.preBuyCards.length * PREBUY_STORAGE_SHIFT,
					y: PREBUY_STORAGE_POS.y,
				}
			)
		)
	}

	clearFromPreBuy(name: string) {
		const index = this.preBuyCards.findIndex((card) => card.name == name)
		const preBuyCard = this.preBuyCards[index]
		this.preBuyCards.splice(index, 1)
		preBuyCard.destruct()
	}

	updatePiles(cards: { name: string; amount: number }[]) {
		if (this.preBuyCards.length)
			this.preBuyCards.forEach((card) => card.destruct())
		if (this.piles.length) this.piles.forEach((pile) => pile.destruct())

		this.preBuyCards = []
		this.piles = []

		const incrementX = this.regionSize.x / CARDS_IN_LINE
		const incrementY = this.regionSize.y / TOTAL_LINES
		let i = 0
		for (const card of cards) {
			this.piles.push(
				new Pile(
					this.drawOn,
					this,
					card.name,
					getCardImageUrlByName(card.name),
					{
						x: this.startPos.x + (i % CARDS_IN_LINE) * incrementX,
						y:
							this.startPos.y +
							Math.floor(i / CARDS_IN_LINE) * incrementY,
					},
					card.amount
				)
			)
			i++
		}
	}
}

export interface PreBuyCard extends MultipleListener, Hoverlightable {}
export class PreBuyCard {
	image: Image
	name: string
	piles: Piles

	constructor(
		drawOn: Group,
		piles: Piles,
		name: string,
		url: string,
		position: Vector2d
	) {
		this.name = name
		this.piles = piles

		Image.fromURL(url, (img) => {
			img.scale({ x: 0.5, y: 0.5 })
			img.position(position)
			drawOn.add(img)
			this.image = img
			this.initMultipleListener(this.image, true)
			this.setFiltersApplyable(this.image)
			this.applyHoverLightEvent()
			this.applyClickEvents()
		})
	}

	applyClickEvents() {
		this.on(
			'click',
			() => {
				this.piles.clearFromPreBuy(this.name)
			},
			this
		)
		this.on(
			'tap',
			() => {
				this.piles.clearFromPreBuy(this.name)
			},
			this
		)
	}

	destruct() {
		try {
			this.image.destroy()
		} catch (e) {}
	}
}

applyMixins(PreBuyCard, [MultipleListener, Hoverlightable])

export interface Pile extends MultipleListener, Hoverlightable {}
export class Pile {
	image: Image
	text: Text

	name: string
	piles: Piles

	constructor(
		drawOn: Group,
		piles: Piles,
		name: string,
		url: string,
		position: Vector2d,
		leftoverAmount: number
	) {
		this.piles = piles
		this.name = name
		this.text = new Text({
			text: String(leftoverAmount),
			fill: '#ffffff',
			fontSize: 30,
			...position,
		})

		Image.fromURL(url, (img) => {
			img.scale({ x: 0.5, y: 0.5 })
			img.position(position)
			drawOn.add(img)
			drawOn.add(this.text)
			this.image = img
			this.initMultipleListener(this.image, true)
			this.setFiltersApplyable(this.image)
			this.applyHoverLightEvent()
			this.applyClickEvent()
		})
	}

	applyClickEvent() {
		this.on(
			'click',
			(e) => {
				if (PlayArea.instance.isActive) {
					PlayArea.instance.addPlaySequenceCard(this.name)
					return
				}

				this.piles.addToPreBuy(this.name)
			},
			this
		)
		this.on(
			'tap',
			(e) => {
				if (PlayArea.instance.isActive) {
					PlayArea.instance.addPlaySequenceCard(this.name)
					return
				}

				this.piles.addToPreBuy(this.name)
			},
			this
		)
	}

	destruct() {
		try {
			this.text.destroy()
			this.image.destroy()
		} catch (e) {}
	}
}

applyMixins(Pile, [MultipleListener, Hoverlightable])
