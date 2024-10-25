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

import BuyButtonImg from '../../assets/img/bb.jpg'

export interface BuyButton extends MultipleListener, Hoverlightable {}
export class BuyButton {
	image: Image
	name: string
	piles: Piles

	constructor(drawOn: Group, piles: Piles, position: Vector2d) {
		this.piles = piles

		Image.fromURL(BuyButtonImg, (img) => {
			img.scale({ x: 0.3, y: 0.3 })
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
				this.piles.buyAll()
			},
			this
		)
		this.on(
			'tap',
			() => {
				this.piles.buyAll()
			},
			this
		)
	}

	destruct() {
		this.image.destroy()
	}
}

applyMixins(BuyButton, [MultipleListener, Hoverlightable])
