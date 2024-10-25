import { Group } from "konva/lib/Group";
import { Image } from "konva/lib/shapes/Image";
import { Vector2d } from "konva/lib/types";
import { getCardImageUrlByName } from "./cards-images";
import { Text } from "konva/lib/shapes/Text";
import { MultipleListener } from "../mixins/multiplelistener";
import { Hoverlightable } from "../mixins/hoverlight";
import { applyMixins } from "../common/utils/apply-mixins";

const CARDS_IN_LINE = 8
const TOTAL_LINES = 3

export default class Piles{
	drawOn: Group
	regionSize: Vector2d
	startPos:Vector2d
	piles:Pile[] = []

	constructor(drawOn:Group,startPos: Vector2d, size: Vector2d){
		this.drawOn = drawOn
		this.startPos = startPos,
		this.regionSize = size

		this.updatePiles([
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
			{ name: 'Copper', amount: 10 },
		])
	}
	
	clear(){

	}

	updatePiles(cards:{name:string,amount:number}[]){
		if(this.piles.length)this.piles.forEach(pile=>pile.destruct())

		const incrementX = this.regionSize.x/CARDS_IN_LINE
		const incrementY = this.regionSize.y/TOTAL_LINES
		let i = 0
		for(const card of cards){
			this.piles.push(new Pile(
				this.drawOn,
				getCardImageUrlByName(card.name),
				{
					x:this.startPos.x+(i%CARDS_IN_LINE)*incrementX,
					y:this.startPos.y+(Math.floor(i/CARDS_IN_LINE)*incrementY)
				},
				card.amount
			))
			i++
		}

	}
}

export interface Pile extends MultipleListener, Hoverlightable {}

export class Pile{
	image:Image
	text: Text
	constructor(drawOn:Group, url:string, position:Vector2d,leftoverAmount:number){
		this.text = new Text({
			text: String(leftoverAmount),
			fill: '#ffffff',
			fontSize:30,
			...position,
		})
		
		Image.fromURL(url, (img) => {
			img.scale({x:0.5,y:0.5})
			img.position(position)
			drawOn.add(img)
			drawOn.add(this.text)
			this.image = img
			this.initMultipleListener(this.image, true)
			this.setFiltersApplyable(this.image)
			this.applyHoverLightEvent()
		})
		
	}


	destruct(){
		this.text.remove()
		this.image.remove()
	}


}

applyMixins(Pile, [MultipleListener, Hoverlightable])