import { toggleElClass } from '@utils/index'
import { Emitter } from '@helpers/Emitter';

export class Tabs {
	constructor(options) {
		// Options
		this.options = options
		this.selector = document.getElementById(this.options.selector).querySelector('.wrap') || ''
		this.tabs = this.options.tabs || []
		this.components = this.options.tabs.map(e => e.components) || []
		this.API_URL = this.options.API_URL
		this.init()
	}

	// Init
	init() {
		// Html
		this.render()
		// Components
		this.renderComponents()
		// Events
		this.setupEvents()
	}

	renderComponents() {
		const componentOptions = {
			configs: this.options,
			emitter: new Emitter()
		}
		this.components = this.components.map((components, i) => {
			return components.map(Component => {
				if(Component) {
					const component = new Component(componentOptions)
					const tabBodySelector = document.querySelectorAll('.v3-transfer-to-friend')[i]
					tabBodySelector.insertAdjacentHTML('beforeend', component.render());
					return component
				}
			})
		})
	}

	setupEvents() {
		this.setActiveTab()
		this.components.forEach((components) => {
			components.forEach(Component => {
				if(Component) {
					Component.setupEvents()
				}
			})
		})
	}

	setActiveTab() {
		// Set active class to element onClick
		const tabEl = this.selector.querySelectorAll('[data-tab]')
		Array.from(tabEl).forEach((el) => {
			el.addEventListener('click', () => {
				const { index } = el.dataset
				toggleElClass(index, ['[data-tab]', '.tab-content'], 'current')
			})
		})
	}

	tabHeader() {
		return this.tabs.map((e, i) => {
			return `
				<div class="col-12 col-md-4">
					<div class="card ${i === 0 ? 'current' : ''}" data-index="${i}" data-tab="tab-${i}">
						<div class="row p-0">
							<div class="col-12 col-lg-9 d-flex align-items-center">
								<p class="card-text">${e.methodLabel}</p>
							</div>
							<img class="transfers" src="${e.icon}" alt="transfers">
						</div>
					</div>
				</div>
			`
		}).join('')
	}
	

	tabBody() { 
		return this.tabs.map((e, i) => {
			return `
				<div class="tab-content ${i === 0 ? 'current' : ''}" id="tab-${i}">
					<div class="v3-transfer-to-friend">
						<div class="transfer-to-friend-title">
							<p>${e.tabSubtitle}</p>
						</div>
					</div>
				</div>
			`
		}).join('')
	}

	tabData() {
		return `<div class="v3-fast-pay">
					<div class="fast-pay-title">
						<h2>Моментальные платежи</h2>
					</div>
					<div class="row p-0">
						${this.tabHeader()}
					</div>
				</div><br>
				<a href="#" class="v3-all-payments"><p>Все платежи</p></a>
				<div class="tab_body">${this.tabBody()}</div>`
	}

	render() {
		this.selector.insertAdjacentHTML('afterbegin', this.tabData());
	}
}