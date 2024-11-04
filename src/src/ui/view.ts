import '../../scss/general/scss.css'
import * as $ from 'jquery'

export default class View {
	res: () => any
	constructor(res: () => any) {
		this.res = res
		this.init()
	}

	async init() {
		this.mainView()
		this.res()
	}
	async mainView() {
		$('#container').parent().css('margin', '0px')
		$('#container').parent().css('padding', '0px')
	}
}
