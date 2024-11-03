import { Group } from 'konva/lib/Group'
import { Image } from 'konva/lib/shapes/Image'
import { Vector2d } from 'konva/lib/types'
import { applyMixins } from '../common/utils/apply-mixins'
import { Hoverlightable } from '../mixins/hoverlight'
import { MultipleListener } from '../mixins/multiplelistener'

import BuyButtonImg from '../../assets/img/pb.jpg'
import { CardEnum } from '../dominion-library/entities/card'
import GameManager from './game-manager'
import { PlayArea } from './play-area'
import { PLAY_BUTTON_POS } from './config'
import Konva from 'konva'

export interface PlayButton extends MultipleListener, Hoverlightable {}

export class PlayButton {
	static instance: PlayButton
	disabled: boolean = false

	image: Image

	constructor(drawOn: Group) {
		PlayButton.instance = this

		this.initializeImage(drawOn, PLAY_BUTTON_POS)
	}

	disable() {
		this.disabled = true
		this.image.filters([...this.image.filters(), Konva.Filters.Grayscale])
		this.disableHoverlighting()
	}

	enable() {
		this.disabled = false
		this.image.filters([
			...this.image
				.filters()
				.filter((filter) => filter !== Konva.Filters.Grayscale),
		])
		this.enableHoverlighting()
	}

	private initializeImage(drawOn: Group, position: Vector2d) {
		Image.fromURL(BuyButtonImg, (img) => {
			img.scale({ x: 0.2, y: 0.2 })
			img.position(position)
			drawOn.add(img)
			this.image = img
			this.initMultipleListener(this.image, true)
			this.setFiltersApplyable(this.image, null, true)
			this.applyHoverLightEvent()
			this.enableHoverlighting()
			this.applyClickEvents()
			this.image.cache()
			this.image.filters(this.image.filters() ?? [])
			this.enable()
		})
	}

	private applyClickEvents() {
		const playAction = () => {
			if (PlayButton.instance.disabled) return

			const currentPlayedName = PlayArea.instance.currentPlayed.name
			const sequenceCardNames = PlayArea.instance.playSequenceCards.map(
				(card) => card.name
			)

			const currentPlayedType = this.getCardEnumValue(currentPlayedName)
			const sequenceCardTypes = sequenceCardNames.map((name) =>
				this.getCardEnumValue(name)
			)

			PlayArea.instance.clearAll()
			PlayArea.instance.isActive = false

			GameManager.instance.play(
				currentPlayedType as unknown as number,
				sequenceCardTypes as unknown as number[]
			)
		}

		this.on('click', playAction, this)
		this.on('tap', playAction, this)
	}

	private getCardEnumValue(name: string): string | undefined {
		const enumIndex = Object.values(CardEnum).indexOf(name)
		return Object.keys(CardEnum)[enumIndex]
	}

	destruct() {
		this.image.destroy()
	}
}

applyMixins(PlayButton, [MultipleListener, Hoverlightable])
