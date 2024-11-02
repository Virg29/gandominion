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
import {
	PILES_DRAW_CONFIG,
	PREBUY_STORAGE_POS,
	PREBUY_STORAGE_SHIFT,
} from './config'

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
		this.startPos = startPos
		this.regionSize = size
		this.buyButton = new BuyButton(drawOn, this, { x: 1180, y: 550 })
	}

	buyAll() {
		const types = this.preBuyCards.map(
			(card) =>
				Object.keys(CardEnum)[
					Object.values(CardEnum).indexOf(card.name)
				]
		)
		GameManager.instance.buy(types as unknown as number[])
		this.clearPreBuyCards()
	}

	addToPreBuy(name: string) {
		const position = {
			x:
				PREBUY_STORAGE_POS.x +
				this.preBuyCards.length * PREBUY_STORAGE_SHIFT,
			y: PREBUY_STORAGE_POS.y,
		}
		const newCard = new PreBuyCard(
			this.drawOn,
			this,
			name,
			getCardImageUrlByName(name),
			position
		)
		this.preBuyCards.push(newCard)
	}

	clearFromPreBuy(name: string) {
		const index = this.preBuyCards.findIndex((card) => card.name === name)
		if (index !== -1) {
			this.preBuyCards[index].destruct()
			this.preBuyCards.splice(index, 1)
		}
	}

	updatePiles(cards: { name: string; amount: number }[]) {
		this.clearPreBuyCards()
		this.clearPiles()
		this.piles = cards.map((card, i) => {
			let leftovers = i + 1
			let rowNumber = 0
			for (const rowLength of PILES_DRAW_CONFIG.ROWS) {
				if (rowLength >= leftovers) {
					break
				}
				leftovers -= rowLength
				rowNumber += 1
			}

			const position = {
				x:
					this.startPos.x +
					leftovers *
						(this.regionSize.x /
							PILES_DRAW_CONFIG.MAX_DRAW_AT_LINE),
				y:
					this.startPos.y +
					rowNumber * PILES_DRAW_CONFIG.VERTICAL_SHIFT,
			}

			return new Pile(
				this.drawOn,
				this,
				card.name,
				getCardImageUrlByName(card.name),
				position,
				card.amount
			)
		})
	}

	private clearPreBuyCards() {
		this.preBuyCards.forEach((card) => card.destruct())
		this.preBuyCards = []
	}

	private clearPiles() {
		this.piles.forEach((pile) => pile.destruct())
		this.piles = []
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
		this.loadImage(drawOn, url, position)
	}

	private loadImage(drawOn: Group, url: string, position: Vector2d) {
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

	private applyClickEvents() {
		const clearCard = () => this.piles.clearFromPreBuy(this.name)
		this.on('click', clearCard, this)
		this.on('tap', clearCard, this)
	}

	destruct() {
		this.image?.destroy()
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
		this.loadImage(drawOn, url, position)
	}

	private loadImage(drawOn: Group, url: string, position: Vector2d) {
		Image.fromURL(url, (img) => {
			img.scale({ x: 0.5, y: 0.5 })
			img.position(position)
			drawOn.add(img)
			drawOn.add(this.text)
			this.image = img
			this.initMultipleListener(this.image, true)
			this.setFiltersApplyable(this.image)
			this.applyHoverLightEvent()
			this.applyClickEvents()
		})
	}

	private applyClickEvents() {
		const handleClick = () => {
			if (PlayArea.instance.isActive) {
				PlayArea.instance.addPlaySequenceCard(this.name)
			} else {
				this.piles.addToPreBuy(this.name)
			}
		}
		this.on('click', handleClick, this)
		this.on('tap', handleClick, this)
	}

	destruct() {
		this.text?.destroy()
		this.image?.destroy()
	}
}

applyMixins(Pile, [MultipleListener, Hoverlightable])
