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

export interface PlayButton extends MultipleListener, Hoverlightable {}

export class PlayButton {
	image: Image

	constructor(drawOn: Group) {
		this.initializeImage(drawOn, PLAY_BUTTON_POS)
	}

	private initializeImage(drawOn: Group, position: Vector2d) {
		Image.fromURL(BuyButtonImg, (img) => {
			img.scale({ x: 0.2, y: 0.2 })
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
		const playAction = () => {
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
