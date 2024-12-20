import { MultipleListener } from '../mixins/multiplelistener'
import { Hoverlightable } from '../mixins/hoverlight'
import { applyMixins } from '../common/utils/apply-mixins'
import { Image } from 'konva/lib/shapes/Image'
import { Table } from './table'
import ClarifyPlayButtonImg from '../../assets/img/cp.jpg'
import { Group } from 'konva/lib/Group'
import { Vector2d } from 'konva/lib/types'
import { CardEnum } from '../dominion-library/entities/card'
import { getCardImageUrlByName } from './cards-images'
import { CLARIFIY_BUTTON_POS, PLAY_AREA_POS, PLAY_AREA_SIZE } from './config'
import Konva from 'konva'

export interface ClarificatePlayMenu extends MultipleListener, Hoverlightable {}

export class ClarificatePlayMenu {
	static instance: ClarificatePlayMenu
	disabled: boolean = false

	callback: (data: { Args: number[] }) => void = null
	drawOn: Group
	button: Image
	cards: ClarificateCard[] = []
	selectedCards: ClarificateSelectedCard[] = []

	constructor(drawOn: Group) {
		this.drawOn = drawOn
		ClarificatePlayMenu.instance = this
		this.initializeButton()
	}

	disable() {
		this.disabled = true
		this.button.filters([...this.button.filters(), Konva.Filters.Grayscale])
		this.disableHoverlighting()
	}

	enable() {
		this.disabled = false
		this.button.filters([
			...this.button
				.filters()
				.filter((filter) => filter !== Konva.Filters.Grayscale),
		])
		this.enableHoverlighting()
	}

	clarify(
		data: {
			PlayedCard: number
			PlayedBy: number | null
			Args: { $values: number[] }
		},
		cb: (data: { Args: number[] }) => void
	) {
		this.callback = cb
		Table.showMessage(
			`Played By ${
				data.PlayedBy != null ? CardEnum[data.PlayedBy] : 'nothing'
			}, Card is ${CardEnum[data.PlayedCard]}`
		)

		this.renderCards(data.Args.$values)
	}

	addToSelected(name: string) {
		const position = {
			x: PLAY_AREA_POS.x + this.selectedCards.length * 50,
			y: PLAY_AREA_POS.y + 150,
		}
		this.selectedCards.push(
			new ClarificateSelectedCard(
				this.drawOn,
				name,
				getCardImageUrlByName(name),
				position
			)
		)
	}

	clearFromSelected(name: string) {
		const index = this.selectedCards.findIndex((card) => card.name === name)
		if (index !== -1) {
			this.selectedCards[index].destruct()
			this.selectedCards.splice(index, 1)
		}
	}

	clearAll() {
		this.cards.forEach((card) => card.destruct())
		this.selectedCards.forEach((card) => card.destruct())
		this.cards = []
		this.selectedCards = []
		this.callback = null
	}

	renderCards(cardIds: number[]) {
		cardIds.forEach((id, index) => {
			const position = {
				x:
					(PLAY_AREA_SIZE.x / cardIds.length) * index +
					PLAY_AREA_POS.x +
					10,
				y: PLAY_AREA_POS.y + 20,
			}
			this.cards.push(
				new ClarificateCard(
					this.drawOn,
					CardEnum[id],
					getCardImageUrlByName(CardEnum[id]),
					position
				)
			)
		})
	}

	private initializeButton() {
		this.createImage(
			ClarifyPlayButtonImg,
			CLARIFIY_BUTTON_POS,
			0.21,
			(img) => {
				this.button = img
				this.applyImageEvents(this.button)
				this.disable()
			}
		)
	}

	private createImage(
		url: string,
		position: Vector2d,
		scale: number,
		callback: (img: Image) => void
	) {
		Image.fromURL(url, (img) => {
			img.scale({ x: scale, y: scale })
			img.position(position)
			this.drawOn.add(img)
			img.cache()
			img.filters(img.filters() ?? [])
			callback(img)
		})
	}

	private applyImageEvents(image: Image) {
		this.initMultipleListener(image, true)
		this.setFiltersApplyable(image, null, true)
		this.applyHoverLightEvent()
		this.enableHoverlighting()
		this.applyClickEvent(() => this.handleSelection())
	}

	private applyClickEvent(handler: () => void) {
		this.on('click', handler, this)
		this.on('tap', handler, this)
	}

	private handleSelection() {
		if (ClarificatePlayMenu.instance.disabled) return

		const names = this.selectedCards.map((card) => card.name)
		const args = names.map(
			(name) => CardEnum[name as unknown as number]
		) as unknown as number[]
		console.log(args)
		this.callback({ Args: args })
		this.clearAll()

		ClarificatePlayMenu.instance.disable()
	}
}

interface ClarificateCardBase extends MultipleListener, Hoverlightable {}
class ClarificateCardBase {
	image: Image
	name: string

	constructor(
		name: string,
		drawOn: Group,
		url: string,
		position: Vector2d,
		scale: number,
		clickHandler: () => void
	) {
		this.name = name
		Image.fromURL(url, (img) => {
			img.scale({ x: scale, y: scale })
			img.position(position)
			drawOn.add(img)
			this.image = img
			this.initMultipleListener(this.image, true)
			this.setFiltersApplyable(this.image)
			this.applyHoverLightEvent()
			this.applyClickEvent(clickHandler)
		})
	}

	private applyClickEvent(handler: () => void) {
		this.on('click', handler, this)
		this.on('tap', handler, this)
	}

	destruct() {
		this.image?.destroy()
	}
}

export class ClarificateCard extends ClarificateCardBase {
	constructor(drawOn: Group, name: string, url: string, position: Vector2d) {
		super(name, drawOn, url, position, 0.5, () =>
			ClarificatePlayMenu.instance.addToSelected(name)
		)
	}
}

export class ClarificateSelectedCard extends ClarificateCardBase {
	constructor(drawOn: Group, name: string, url: string, position: Vector2d) {
		super(name, drawOn, url, position, 0.5, () =>
			ClarificatePlayMenu.instance.clearFromSelected(name)
		)
	}
}

applyMixins(ClarificatePlayMenu, [MultipleListener, Hoverlightable])
applyMixins(ClarificateCardBase, [MultipleListener, Hoverlightable])
