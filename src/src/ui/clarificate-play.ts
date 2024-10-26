import { MultipleListener } from '../mixins/multiplelistener'
import { Hoverlightable } from '../mixins/hoverlight'
import { applyMixins } from '../common/utils/apply-mixins'
import { Image } from 'konva/lib/shapes/Image'
import { PLAY_AREA_POS, PLAY_AREA_SIZE, Table } from './table'
import ClarifyPlayButtonImg from '../../assets/img/cp.jpg'
import { Group } from 'konva/lib/Group'
import { Vector2d } from 'konva/lib/types'
import { CardEnum } from '../dominion-library/entities/card'
import { getCardImageUrlByName } from './cards-images'
import GameManager from './game-manager'

export interface ClarificatePlayMenu extends MultipleListener, Hoverlightable {}

export class ClarificatePlayMenu {
	static instance: ClarificatePlayMenu

	callback: (data: { Args: number[] }) => void = null

	drawOn: Group
	button: Image

	cards: ClarificateCard[] = []
	selectedCards: ClarificateSelectedCard[] = []

	constructor(drawOn: Group) {
		this.drawOn = drawOn
		ClarificatePlayMenu.instance = this
		this.drawButton()
	}

	clarify(
		data: { PlayedCard: number; PlayedBy: number | null; Args: number[] },
		cb: (data: { Args: number[] }) => void
	) {
		this.callback = cb
		Table.showMessage(
			`Played By ${
				data.PlayedBy != null ? CardEnum[data.PlayedBy] : 'nothing'
			} Card is ${CardEnum[data.PlayedCard]}`
		)
		this.drawCards(data.Args)
	}

	addToSelected(name: string) {
		this.selectedCards.push(
			new ClarificateSelectedCard(
				this.drawOn,
				name,
				getCardImageUrlByName(name),
				{
					x: PLAY_AREA_POS.x + this.selectedCards.length * 50,
					y: PLAY_AREA_POS.y + 150,
				}
			)
		)
	}

	clearFromSelected(name: string) {
		const index = this.selectedCards.findIndex((card) => card.name == name)
		const selectedCard = this.selectedCards[index]
		this.selectedCards.splice(index, 1)
		selectedCard.destruct()
	}

	clearAll() {
		if (this.cards.length) {
			this.cards.map((card) => card.destruct())
			this.cards = []
		}

		if (this.selectedCards.length) {
			this.selectedCards.map((card) => card.destruct())
			this.selectedCards = []
		}

		this.callback = null
	}

	drawCards(cards: number[]) {
		cards.map((card, index) => {
			this.cards.push(
				new ClarificateCard(
					this.drawOn,
					CardEnum[card],
					getCardImageUrlByName(CardEnum[card]),
					{
						x:
							(PLAY_AREA_SIZE.x / cards.length) * index +
							PLAY_AREA_POS.x +
							10,
						y: PLAY_AREA_POS.y + 20,
					}
				)
			)
		})
	}

	drawButton() {
		Image.fromURL(ClarifyPlayButtonImg, (img) => {
			img.scale({ x: 0.2, y: 0.2 })
			img.position({ x: 1600, y: 550 })
			this.drawOn.add(img)
			this.button = img
			this.initMultipleListener(this.button, true)
			this.setFiltersApplyable(this.button)
			this.applyHoverLightEvent()
			this.applyClickEvents()
		})
	}

	applyClickEvents() {
		this.on(
			'click',
			() => {
				const names = ClarificatePlayMenu.instance.selectedCards.map(
					(card) => card.name
				)
				const types = names.map(
					(name) =>
						Object.keys(CardEnum)[
							Object.values(CardEnum).indexOf(name)
						]
				)
				ClarificatePlayMenu.instance.callback({
					Args: types as unknown as number[],
				})
				ClarificatePlayMenu.instance.clearAll()
			},
			this
		)
		this.on(
			'tap',
			() => {
				const names = ClarificatePlayMenu.instance.selectedCards.map(
					(card) => card.name
				)
				const types = names.map(
					(name) =>
						Object.keys(CardEnum)[
							Object.values(CardEnum).indexOf(name)
						]
				)

				ClarificatePlayMenu.instance.callback({
					Args: types as unknown as number[],
				})
				ClarificatePlayMenu.instance.clearAll()
			},
			this
		)
	}
}

export interface ClarificateCard extends MultipleListener, Hoverlightable {}
export class ClarificateCard {
	image: Image
	name: string

	constructor(drawOn: Group, name: string, url: string, position: Vector2d) {
		this.name = name

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
				ClarificatePlayMenu.instance.addToSelected(this.name)
			},
			this
		)
		this.on(
			'tap',
			() => {
				ClarificatePlayMenu.instance.addToSelected(this.name)
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

applyMixins(ClarificateCard, [MultipleListener, Hoverlightable])

applyMixins(ClarificatePlayMenu, [MultipleListener, Hoverlightable])

export interface ClarificateSelectedCard
	extends MultipleListener,
		Hoverlightable {}
export class ClarificateSelectedCard {
	image: Image
	name: string

	constructor(drawOn: Group, name: string, url: string, position: Vector2d) {
		this.name = name

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
				ClarificatePlayMenu.instance.clearFromSelected(this.name)
			},
			this
		)
		this.on(
			'tap',
			() => {
				ClarificatePlayMenu.instance.clearFromSelected(this.name)
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

applyMixins(ClarificateSelectedCard, [MultipleListener, Hoverlightable])
