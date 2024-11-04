import * as $ from 'jquery'
import Konva from 'konva'
import { Stage } from 'konva/lib/Stage'
import { Vector2d } from 'konva/lib/types'
import * as webix from 'webix'
import img from '../../assets/img/bg.jpg'
import { applyMixins } from '../common/utils/apply-mixins'
import { MultipleListener } from '../mixins/multiplelistener'
import { ClarificatePlayMenu } from './clarificate-play'
import {
	PLAY_AREA_POS,
	PLAY_AREA_SIZE,
	STAGE_SIZE,
	TURN_BUTTON_POS,
} from './config'
import GameManager from './game-manager'
import Hand from './hand'
import LayerManager from './layermanager'
import Piles from './piles'
import { PlayArea } from './play-area'
import { PlayButton } from './play-button'
import { Rect } from 'konva/lib/shapes/Rect'
import { isTouchScreenDevice } from '../common/utils/is-touchcreen'

Konva.pixelRatio = 1

export interface Table extends MultipleListener {}

export class Table {
	static instance: Table | null = null
	static hand: Hand | null = null
	static piles: Piles | null = null

	width: number
	height: number
	stage: Stage
	layerManager: LayerManager
	activeKeys: string[]
	key: string
	stagePos: Vector2d

	gameManager: GameManager

	static showMessage(text: string, type = 'error') {
		webix.message({
			text: text,
			type: type, //'error' а других нам и не надо
			expire: 10000,
		})
	}

	constructor() {
		Table.instance = this
		this.width = $('#container').innerWidth()
		this.height = $('#container').innerHeight()

		this.stage = new Konva.Stage({
			container: 'container',
			width: this.width,
			height: this.height,
			draggable: !isTouchScreenDevice(),
		})
		$(window).resize(() => {
			this.stage.size({
				width: $('#container').innerWidth(),
				height: $('#container').innerHeight(),
			})
		})
		this.layerManager = new LayerManager(this.stage)
		this.createLayers()

		this.activeKeys = []
		this.key = 'Space'
		this.stagePos = this.stage.position()
		this.gameManager = new GameManager()

		this.init()
	}
	createLayers() {
		this.layerManager.createLayer({ listening: false }, 'backplate')
		this.layerManager.createLayer({ listening: false }, 'areas')
		this.layerManager.createLayer({}, 'table-decks')
		this.layerManager.createLayer({}, 'hand')
		// this.layerManager.createLayer({}, 'buttons')
	}

	getSize() {
		return { width: this.stage.width(), height: this.stage.height() }
	}

	init() {
		this.applyDefaultScale()
		this.drawBackground()
		this.initMultipleListener(this.stage)
		if (!isTouchScreenDevice()) this.applyDefaultOnWheel()
		if (isTouchScreenDevice()) this.applyDefaultOnPinch()
		this.initPiles()
		this.drawPlayArea()
		this.drawPlayButton()
		this.initHand()
		this.startListenButton()
		this.initClarificateModal()
		this.updateTurnCounter(0)
	}

	startListenButton() {
		console.log($('#megabutton'))
		$('#megabutton').on('click', () => {
			const address = $('#address').val().toString().split(':')
			const name = $('#name').val().toString()
			const room = $('#room').val().toString()
			const players = Number($('#players').val().toString())
			const spectator = $('#spectator').is(':checked')
			console.log(address, name, room, players)
			this.gameManager.init(
				address[0],
				address[1],
				name,
				room,
				players,
				spectator
			)
			$('#overlayForm').hide()
		})
	}

	initClarificateModal() {
		const handGroupLayer = this.layerManager.getLayer('hand')
		if ('add' in handGroupLayer) new ClarificatePlayMenu(handGroupLayer)
	}

	initHand() {
		const handGroupLayer = this.layerManager.getLayer('hand')
		if ('add' in handGroupLayer) {
			const hand = new Hand(handGroupLayer)
			hand.setPlayOnMatRegion(PLAY_AREA_POS, PLAY_AREA_SIZE)
		}
	}

	updateTurnCounter(turn: number) {
		PlayArea.instance.updateTurn(turn)
	}

	initPiles() {
		const tableDecksLayer = this.layerManager.getLayer('table-decks')
		if ('add' in tableDecksLayer) new Piles(tableDecksLayer)
	}

	drawBackground() {
		const grpLayer = this.layerManager.getLayer('backplate')
		if ('add' in grpLayer) {
			Konva.Image.fromURL(img, (image) => {
				// image is Konva.Image instance
				image.width(STAGE_SIZE.x)
				image.height(STAGE_SIZE.y)
				grpLayer.add(image)
			})
		}
	}

	drawPlayArea() {
		const tableDecksLayer = this.layerManager.getLayer('table-decks')
		if ('add' in tableDecksLayer) new PlayArea(tableDecksLayer)
	}

	drawPlayButton() {
		const grpLayer = this.layerManager.getLayer('table-decks')
		if ('add' in grpLayer) new PlayButton(grpLayer)
	}

	applyDefaultScale() {
		const windowWidth = $(window).width()
		const size = windowWidth / STAGE_SIZE.x
		this.stage.scale({ x: size, y: size })
	}

	changeScale(changeOn: number) {
		var newScale = this.stage.scaleX() + changeOn
		this.stage.scale({ x: newScale, y: newScale })
	}

	rotation(rot: number = null, rad: boolean = false) {
		if (rot == null)
			return rad
				? (this.stage.rotation() * Math.PI) / 180
				: this.stage.rotation()
		this.stage.rotation(rot)
	}

	changeView(
		x: number = null,
		y: number = null,
		rot: number = null,
		scale: number = null
	) {
		if (scale != null) {
			this.stage.scale({ x: scale, y: scale })
		}
		if (x != null && y != null) {
			this.stage.position({ x: x, y: y })
			this.stagePos = this.stage.position()
		}
		if (rot != null) {
			this.rotation(rot)
		}
	}

	applyDefaultOnPinch() {
		function getDistance(p1: Vector2d, p2: Vector2d) {
			return Math.sqrt(
				Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
			)
		}

		function getCenter(p1: Vector2d, p2: Vector2d) {
			return {
				x: (p1.x + p2.x) / 2,
				y: (p1.y + p2.y) / 2,
			}
		}

		this.on(
			'touchmove',
			function (e) {
				e.evt.preventDefault()
				var touch1 = e.evt.touches[0]
				var touch2 = e.evt.touches[1]

				// we need to restore dragging, if it was cancelled by multi-touch
				if (
					touch1 &&
					!touch2 &&
					!this.stage.isDragging() &&
					this.dragStopped
				) {
					this.stage.startDrag()
					this.dragStopped = false
				}

				if (touch1 && touch2) {
					// if the stage was under Konva's drag&drop
					// we need to stop it, and implement our own pan logic with two pointers
					if (this.stage.isDragging()) {
						this.dragStopped = true
						this.stage.stopDrag()
					}

					var p1 = {
						x: touch1.clientX,
						y: touch1.clientY,
					}
					var p2 = {
						x: touch2.clientX,
						y: touch2.clientY,
					}

					if (!this.lastCenter) {
						this.lastCenter = getCenter(p1, p2)
						return
					}
					var newCenter = getCenter(p1, p2)

					var dist = getDistance(p1, p2)

					if (!this.lastDist) {
						this.lastDist = dist
					}

					// local coordinates of center point
					var pointTo = {
						x: (newCenter.x - this.stage.x()) / this.stage.scaleX(),
						y: (newCenter.y - this.stage.y()) / this.stage.scaleX(),
					}

					var scale = this.stage.scaleX() * (dist / this.lastDist)

					this.stage.scaleX(scale)
					this.stage.scaleY(scale)

					// calculate new position of the stage
					var dx = newCenter.x - this.lastCenter.x
					var dy = newCenter.y - this.lastCenter.y

					var newPos = {
						x: newCenter.x - pointTo.x * scale + dx,
						y: newCenter.y - pointTo.y * scale + dy,
					}

					this.stage.position(newPos)

					this.lastDist = dist
					this.lastCenter = newCenter
				}
			},
			this
		)

		this.on(
			'touchend',
			function (e) {
				this.lastDist = 0
				this.lastCenter = null
			},
			this
		)
	}

	applyDefaultOnWheel() {
		this.on(
			'wheel',
			function (e: any) {
				// stop default scrolling
				// console.log(this.stage.position(), this.stage.scale())
				e.evt.preventDefault()
				//с зажатым пробелом
				// if (this.activeKeys.indexOf(this.key) == -1) return
				var scaleBy = 1.05

				var oldScale = this.stage.scaleX()
				var pointer = this.stage.getPointerPosition()

				var mousePointTo = {
					x: (pointer.x - this.stage.x()) / oldScale,
					y: (pointer.y - this.stage.y()) / oldScale,
				}

				// how to scale? Zoom in? Or zoom out?
				let direction = e.evt.deltaY > 0 ? -1 : 1

				// when we zoom on trackpad, e.evt.ctrlKey is true
				// in that case lets revert direction
				if (e.evt.ctrlKey) {
					direction = -direction
				}

				var newScale =
					direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

				this.stage.scale({ x: newScale, y: newScale })

				var newPos = {
					x: pointer.x - mousePointTo.x * newScale,
					y: pointer.y - mousePointTo.y * newScale,
				}
				this.stage.absolutePosition(newPos)

				this.stagePos = this.stage.position()
			},
			this
		)
	}
}

applyMixins(Table, [MultipleListener])
