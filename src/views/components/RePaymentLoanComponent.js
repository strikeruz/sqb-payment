import { JoydaComponent } from '@components/JoydaComponent';
import { LoanRepaymentForm } from '@components/LoanRepaymentFormComponent';
import { joydaApi } from '@services/api/index';

export class RePaymentLoan extends JoydaComponent {
    constructor(options) {
        super({name: 'RePaymentLoan', emitter: options.emitter})
        this.selector = 'p2pServices'
        this.options = options.configs

        this.services = []
        this.currentService = []
        this.fetchData()
    }

    setupEvents () {
        this.$on('api:responseSupplierLists', response => {
            // console.log('responseSupplierLists', response)
            const { data } = response
            this.services = data
            this.renderList()
            this.initServiceEvent()
        })

        this.$on('api:clickService', service => {
            // console.log('clickService', service)
            this.currentService = service
            const currentTab = document.querySelector('.tab-content.current .v3-transfer-to-friend')
            new LoanRepaymentForm({
                el: currentTab,
                configs: this.options,
                emitter: this.emitter,
                service: this.currentService
            })
        })
    }

    initServiceEvent() {
        const dataServiceEl = document.querySelectorAll('[data-service]')
        Array.from(dataServiceEl).forEach(el => el.addEventListener('click', (e) => {
            e.preventDefault()
            this.currentService = this.services.filter(e => e.title === el.title)[0]
            this.$emit('api:clickService', this.currentService)
        }))
    }

    renderList() {
        const el = document.querySelector(`.${this.selector}`)
        el.insertAdjacentHTML('afterbegin', this.credtiLists());
    }
    
    fetchData() {
        const supplierCategory = {
            category_id: 11, 
            is_new: true
        }
        new joydaApi(this.options, supplierCategory, 'supplier/services', this.emitter)
    }

    credtiLists() {
        return this.services.map(e => {
            return `
                <div class="logo_credit-img--item">
                    <a href="#" data-service title="${e.title}"><img src="${e.logo}" alt="${e.title}"></a>
                </div>
            `
        }).join('')
    }

    setPrepaymentDate(response) {
        const form = document.querySelector('[data-form-service]')
        const comissionEl = form.querySelector('[data-comission]')
        const comissionTotalSumEl = form.querySelector('[data-comission-sum]')
        const resiverNameEl = form.querySelector('[data-receiver-name]')
        const amount = +form.querySelector('[name="amount"]').value.replace(' ', '')
        const actionBtn = form.querySelector('[data-action]')
        actionBtn.innerHTML = actionBtn.innerHTML.replace(actionBtn.innerText, 'Перевести ')
        response.data.additional.forEach(element => {
            if (element.type === 'receiver_name') {
                resiverNameEl.innerHTML = element.value
            } else if (element.type === 'commission') {
                // Comission percent
                comissionEl.innerHTML = Number(element.value).toFixed(1) + ' %'
                // Summ with Comission
                const comissionSum = +element.value / 100 * amount
                comissionTotalSumEl.innerHTML = getNumberWithSpace(amount + comissionSum) + ' UZS'
            }
        });
    }

    render() {
        return `<div class="logo_credit-img--list ${this.selector}"></div>`
    }
}