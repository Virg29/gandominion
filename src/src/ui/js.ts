import '../../scss/shipmap/scss.scss'
import '../../scss/general/cssFF/Arial.scss'
import { Table } from './table'
import '../../assets/img/favicon.ico'
import View from './view'

var shippane
var view = new View(() => {
	shippane = new Table()
})
