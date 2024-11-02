import { Group } from 'konva/lib/Group'
import { Rect } from 'konva/lib/shapes/Rect'
import { Image } from 'konva/lib/shapes/Image'
import { Vector2d } from 'konva/lib/types'
import { Text } from 'konva/lib/shapes/Text'
import { applyMixins } from '../common/utils/apply-mixins'
import { Hoverlightable } from '../mixins/hoverlight'
import { MultipleListener } from '../mixins/multiplelistener'
import { CardInHand } from './hand'
import { getCardImageUrlByName } from './cards-images'
import {
	PLAY_AREA_POS,
	PLAY_AREA_SIZE,
	PREACTION_STORAGE_POS,
	PREACTION_STORAGE_SHIFT,
} from './config'

export class PlayArea {
	static instance: PlayArea
	isActive = false
	drawOn: Group
	currentPlayed: CardInHand
	playSequenceCards: PreActionCard[] = []

	private remaningActionsText: Text
	private remaningBuysText: Text
	private totalMoneyText: Text

	constructor(drawOn: Group) {
		PlayArea.instance = this
		this.drawOn = drawOn
		this.initializePlayArea()
		this.initializeTextDisplays()
	}

	private initializePlayArea() {
		this.drawOn.add(
			new Rect({
				...PLAY_AREA_POS,
				width: PLAY_AREA_SIZE.x,
				height: PLAY_AREA_SIZE.y,
				fill: '#66aa66',
				stroke: '#339933',
				strokeWidth: 1,
			})
		)
	}

	private initializeTextDisplays() {
		this.remaningActionsText = this.createTextDisplay(10)
		this.remaningBuysText = this.createTextDisplay(50)
		this.totalMoneyText = this.createTextDisplay(90)
	}

	private createTextDisplay(offsetY: number): Text {
		const text = new Text({
			fill: '#ffffff',
			fontSize: 30,
			x: PLAY_AREA_POS.x + 10,
			y: PLAY_AREA_POS.y + offsetY,
		})
		this.drawOn.add(text)
		return text
	}

	updateText(actions: number, buys: number, money: number) {
		this.remaningActionsText.text(`Rem.Acts.:${actions}`)
		this.remaningBuysText.text(`Rem.Buys:${buys}`)
		this.totalMoneyText.text(`Money:${money}`)
	}

	addPlaySequenceCard(name: string) {
		const position = {
			x:
				PREACTION_STORAGE_POS.x +
				this.playSequenceCards.length * PREACTION_STORAGE_SHIFT,
			y: PREACTION_STORAGE_POS.y,
		}
		const newCard = new PreActionCard(
			this.drawOn,
			name,
			getCardImageUrlByName(name),
			position
		)
		this.playSequenceCards.push(newCard)
	}

	clearFromPlaySequence(name: string) {
		const index = this.playSequenceCards.findIndex(
			(card) => card.name === name
		)
		if (index !== -1) {
			this.playSequenceCards[index].destruct()
			this.playSequenceCards.splice(index, 1)
		}
	}

	clearAll() {
		this.playSequenceCards.forEach((card) => card.destruct())
		this.playSequenceCards = []
	}
}

export interface PreActionCard extends MultipleListener, Hoverlightable {}
export class PreActionCard {
	image: Image
	name: string

	constructor(drawOn: Group, name: string, url: string, position: Vector2d) {
		this.name = name
		this.initializeImage(drawOn, url, position)
	}

	private initializeImage(drawOn: Group, url: string, position: Vector2d) {
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
		const clearCard = () =>
			PlayArea.instance.clearFromPlaySequence(this.name)
		this.on('click', clearCard, this)
		this.on('tap', clearCard, this)
	}

	destruct() {
		this.image?.destroy()
	}
}

applyMixins(PreActionCard, [MultipleListener, Hoverlightable])
