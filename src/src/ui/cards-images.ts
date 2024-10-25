import Artisan from '../../assets/img/cards/Artisan.jpg'
import Bandit from '../../assets/img/cards/Bandit.jpg'
import Bureaucrat from '../../assets/img/cards/Bureaucrat.jpg'
import Cellar from '../../assets/img/cards/Cellar.jpg'
import Chapel from '../../assets/img/cards/Chapel.jpg'
import Copper from '../../assets/img/cards/Copper.jpg'
import Council_Room from '../../assets/img/cards/Council_Room.jpg'
import Curse from '../../assets/img/cards/Curse.jpg'
import Duchy from '../../assets/img/cards/Duchy.jpg'
import Estate from '../../assets/img/cards/Estate.jpg'
import Festival from '../../assets/img/cards/Festival.jpg'
import Gardens from '../../assets/img/cards/Gardens.jpg'
import Gold from '../../assets/img/cards/Gold.jpg'
import Harbinger from '../../assets/img/cards/Harbinger.jpg'
import Laboratory from '../../assets/img/cards/Laboratory.jpg'
import Library from '../../assets/img/cards/Library.jpg'
import Market from '../../assets/img/cards/Market.jpg'
import Merchant from '../../assets/img/cards/Merchant.jpg'
import Militia from '../../assets/img/cards/Militia.jpg'
import Mine from '../../assets/img/cards/Mine.jpg'
import Moat from '../../assets/img/cards/Moat.jpg'
import Moneylender from '../../assets/img/cards/Moneylender.jpg'
import Poacher from '../../assets/img/cards/Poacher.jpg'
import Province from '../../assets/img/cards/Province.jpg'
import Remodel from '../../assets/img/cards/Remodel.jpg'
import Sentry from '../../assets/img/cards/Sentry.jpg'
import Silver from '../../assets/img/cards/Silver.jpg'
import Smithy from '../../assets/img/cards/Smithy.jpg'
import Throne_Room from '../../assets/img/cards/Throne_Room.jpg'
import Vassal from '../../assets/img/cards/Vassal.jpg'
import Village from '../../assets/img/cards/Village.jpg'
import Witch from '../../assets/img/cards/Witch.jpg'
import Workshop from '../../assets/img/cards/Workshop.jpg'

const urlByNameMap = new Map<string,string>()

urlByNameMap.set('Artisan', Artisan)
urlByNameMap.set('Bandit', Bandit)
urlByNameMap.set('Bureaucrat', Bureaucrat)
urlByNameMap.set('Cellar', Cellar)
urlByNameMap.set('Chapel', Chapel)
urlByNameMap.set('Copper', Copper)
urlByNameMap.set('Council_Room', Council_Room)
urlByNameMap.set('Curse', Curse)
urlByNameMap.set('Duchy', Duchy)
urlByNameMap.set('Estate', Estate)
urlByNameMap.set('Festival', Festival)
urlByNameMap.set('Gardens', Gardens)
urlByNameMap.set('Gold', Gold)
urlByNameMap.set('Harbinger', Harbinger)
urlByNameMap.set('Laboratory', Laboratory)
urlByNameMap.set('Library', Library)
urlByNameMap.set('Market', Market)
urlByNameMap.set('Merchant', Merchant)
urlByNameMap.set('Militia', Militia)
urlByNameMap.set('Mine', Mine)
urlByNameMap.set('Moat', Moat)
urlByNameMap.set('Moneylender', Moneylender)
urlByNameMap.set('Poacher', Poacher)
urlByNameMap.set('Province', Province)
urlByNameMap.set('Remodel', Remodel)
urlByNameMap.set('Sentry', Sentry)
urlByNameMap.set('Silver', Silver)
urlByNameMap.set('Smithy', Smithy)
urlByNameMap.set('Throne_Room', Throne_Room)
urlByNameMap.set('Vassal', Vassal)
urlByNameMap.set('Village', Village)
urlByNameMap.set('Witch', Witch)
urlByNameMap.set('Workshop', Workshop)

export function getCardImageUrlByName(name:string): string | undefined{
	return urlByNameMap.get(name)
}