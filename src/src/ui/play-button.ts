import { Group } from 'konva/lib/Group'
import { Image } from 'konva/lib/shapes/Image'
import { Vector2d } from 'konva/lib/types'
import { getCardImageUrlByName } from './cards-images'
import { Text } from 'konva/lib/shapes/Text'
import { MultipleListener } from '../mixins/multiplelistener'
import { Hoverlightable } from '../mixins/hoverlight'
import { applyMixins } from '../common/utils/apply-mixins'
import { Table } from './table'
import Piles from './piles'

import BuyButtonImg from '../../assets/img/pb.jpg'
import GameManager from './game-manager'
import { PlayArea } from './play-area'
import { CardEnum } from '../dominion-library/entities/card'

export interface PlayButton extends MultipleListener, Hoverlightable {}
export class PlayButton {
	image: Image
	name: string

	constructor(drawOn: Group, position: Vector2d) {
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

	applyClickEvents() {
		this.on(
			'click',
			() => {
				const nameCurrentPlayed = PlayArea.instance.currentPlayed.name
				const names = PlayArea.instance.playSequenceCards.map(
					(card) => card.name
				)

				const currentPlayedType =
					Object.keys(CardEnum)[
						Object.values(CardEnum).indexOf(nameCurrentPlayed)
					]

				const types = names.map(
					(name) =>
						Object.keys(CardEnum)[
							Object.values(CardEnum).indexOf(name)
						]
				)
				PlayArea.instance.clearAll()
				PlayArea.instance.isActive = false

				GameManager.instance.play(
					currentPlayedType as unknown as number,
					types as unknown as number[]
				)
			},
			this
		)
		this.on(
			'tap',
			() => {
				const nameCurrentPlayed = PlayArea.instance.currentPlayed.name
				const names = PlayArea.instance.playSequenceCards.map(
					(card) => card.name
				)

				const currentPlayedType =
					Object.keys(CardEnum)[
						Object.values(CardEnum).indexOf(nameCurrentPlayed)
					]

				const types = names.map(
					(name) =>
						Object.keys(CardEnum)[
							Object.values(CardEnum).indexOf(name)
						]
				)
				PlayArea.instance.clearAll()
				PlayArea.instance.isActive = false

				GameManager.instance.play(
					currentPlayedType as unknown as number,
					types as unknown as number[]
				)
			},
			this
		)
	}

	destruct() {
		this.image.destroy()
	}
}

applyMixins(PlayButton, [MultipleListener, Hoverlightable])
