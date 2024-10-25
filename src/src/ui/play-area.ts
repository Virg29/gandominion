import { Group } from 'konva/lib/Group'
import { Rect } from 'konva/lib/shapes/Rect'
import { PLAY_AREA_POS, PLAY_AREA_SIZE, Table } from './table'

import { Image } from 'konva/lib/shapes/Image'
import { Vector2d } from 'konva/lib/types'
import { applyMixins } from '../common/utils/apply-mixins'
import { Hoverlightable } from '../mixins/hoverlight'
import { MultipleListener } from '../mixins/multiplelistener'
import { CardInHand } from './hand'
import { getCardImageUrlByName } from './cards-images'
import { Text } from 'konva/lib/shapes/Text'

const PREACTION_STORAGE_POS = {
	x: 900,
	y: 700,
}

const PREACTION_STORAGE_SHIFT = 50

export class PlayArea {
	static instance: PlayArea
	remaningActionsText: Text
	remaningBuysText: Text
	totalMoneyText: Text

	isActive: boolean = false
	drawOn: Group
	currentPlayed: CardInHand
	playSequenceCards: PreActionCard[] = []

	updateText(actions: number, buys: number, money: number) {
		if (!this.remaningActionsText) {
			this.remaningActionsText = new Text({
				fill: '#ffffff',
				fontSize: 30,
				x: PLAY_AREA_POS.x + 10,
				y: PLAY_AREA_POS.y + 10,
			})
			this.drawOn.add(this.remaningActionsText)
		}
		if (!this.remaningBuysText) {
			this.remaningBuysText = new Text({
				fill: '#ffffff',
				fontSize: 30,
				x: PLAY_AREA_POS.x + 10,
				y: PLAY_AREA_POS.y + 50,
			})
			this.drawOn.add(this.remaningBuysText)
		}
		if (!this.totalMoneyText) {
			this.totalMoneyText = new Text({
				fill: '#ffffff',
				fontSize: 30,
				x: PLAY_AREA_POS.x + 10,
				y: PLAY_AREA_POS.y + 90,
			})
			this.drawOn.add(this.totalMoneyText)
		}

		this.remaningActionsText.text(`Rem.Acts.:${String(actions)}`)
		this.remaningBuysText.text(`Rem.Buys:${String(buys)}`)
		this.totalMoneyText.text(`Money:${String(money)}`)
	}

	addPlaySequenceCard(name: string) {
		this.playSequenceCards.push(
			new PreActionCard(this.drawOn, name, getCardImageUrlByName(name), {
				x:
					PREACTION_STORAGE_POS.x +
					this.playSequenceCards.length * PREACTION_STORAGE_SHIFT,
				y: PREACTION_STORAGE_POS.y,
			})
		)
	}

	clearFromPlaySequence(name: string) {
		const index = this.playSequenceCards.findIndex(
			(card) => card.name == name
		)
		const preActionCard = this.playSequenceCards[index]
		this.playSequenceCards.splice(index, 1)
		preActionCard.destruct()
	}

	clearAll() {
		if (this.playSequenceCards.length)
			this.playSequenceCards.forEach((card) => card.destruct())
		this.playSequenceCards = []
	}

	constructor(drawOn: Group) {
		PlayArea.instance = this

		this.drawOn = drawOn

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
}

export interface PreActionCard extends MultipleListener, Hoverlightable {}
export class PreActionCard {
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
				PlayArea.instance.clearFromPlaySequence(this.name)
			},
			this
		)
		this.on(
			'tap',
			() => {
				PlayArea.instance.clearFromPlaySequence(this.name)
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

applyMixins(PreActionCard, [MultipleListener, Hoverlightable])
