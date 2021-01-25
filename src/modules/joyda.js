// import {Wrapper} from '@/views/wrapper'
import { Tabs } from '../views/components/TabComponent'

export class Joyda {
	constructor(config) {
		this.config = config
		this.selector = document.getElementById(this.config.selector)
		this.selector.innerHTML = this.render()
		this.init()
	}

	init() {
		this.generateTabs()
	}

	generateTabs() {
		new Tabs(this.config)
	}

	// HTML
	render() {
		return `
			<div class="v3-body" style="position: relative;">
				<div class="container">
					<div class="wrap">
						<div data-exchange></div>
					</div>
				</div>
			</div>
		`
	}
}