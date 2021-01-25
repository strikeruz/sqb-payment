import { cardSenderFields } from '@components/fields/money-transfer/cardSenderField';
import { cardAmountFields } from '@components/fields/money-transfer/cardAmountField';
import { isCardValid, isExpireDateValid } from '@utils/validationsCard';
import { formToJSON, getNumberWithSpace } from '@utils/index';
import VanillaValidator from 'vanillajs-validation';
import { JoydaComponent } from '@components/JoydaComponent';
import { SmsPendingBlock } from '@components/SmsPendingComponent'
import { joydaApi } from '@services/api/index';

export class LoanRepaymentForm extends JoydaComponent {
    constructor(options) {
        super({name: 'LoanRepaymentForm', emitter: options.emitter})
        this.el = options.el
        this.emitter = options.emitter
        this.service = options.service
        this.configs = options.configs
        this.currentServiceFields = []
        this.userInputDataObj = {}
        
        this.selector = 'p2pServicesForm'
        this.cardNumEl = 'input-card-num'
        this.cardDateEl = 'input-card-date'
        this.cardSumEl = 'input-thousand'

        this.render()
        this.init()
    }

    init() {
        this.setMasks()

        this.$on('api:responseSupplierPrepaymentSuccess', data => {
            // console.log('responseSupplierPrepaymentSuccess', data)
            const {response, postDate} = data
            this.userInputDataObj = postDate
            this.setPrepaymentData(response.data)
        })
        
        this.$on('api:responseSupplierPrepaymentError', response => {
            // console.log('responseSupplierPrepaymentError', response)
            const { message } = response.error
            alert(message)
        })

        // SQB ONLY
        this.$on('api:responseSupplierPrepaymentSqbSuccess', data => {
            // console.log('responseSupplierPrepaymentSqbSuccess', data)
            const {response, postDate} = data
            this.userInputDataObj = postDate
            this.userInputDataObj.prepare = false
            this.setPrepaymentData(response.data)
        })
        
        this.$on('api:responseSupplierPrepaymentSqbError', response => {
            // console.log('responseSupplierPrepaymentSqbError', response)
            const { message } = response.error
            alert(message)
        })
        // END SQB ONLY
        
        this.$on('api:supplierBeforePaymentSuccess', response => {
            // console.log('api:supplierBeforePaymentSuccess', response) 
            new SmsPendingBlock({el: this.el, emitter: this.emitter, response: response, eventName: 'supplierPaySmsConfirmation'})
        })

        this.$on('api:supplierBeforePaymentError', response => {
            // console.log('api:supplierBeforePaymentError', response)
            const { message } = response.error
            alert(message)
        })

        // Confirmation SMS
        this.$on('api:supplierPaySmsConfirmation', smsNumber => {
            // console.log('supplierPaySmsConfirmation', smsNumber)
            const { code } = smsNumber
            this.userInputDataObj.code = code

            const url = 'supplier_id' in this.userInputDataObj ? 'supplier/payment' : 'loan/repayment-loan-no-user'
            new joydaApi(this.configs, this.userInputDataObj, url, this.emitter)
        })

        this.$on('api:supplierPaymentSuccess', response => {
            // console.log('api:supplierPaymentSuccess', response)
            if(response.data.status !== 'pending') {
                this.el.parentElement.innerHTML = `<div class="logo_credit succses-message"><h2>Оплата прошла успешно!</h2></div>`
            }
        })

        this.$on('api:supplierPaymentError', response => {
            // console.log('api:supplierPaymentError', response)
            const { message } = response.error
            // this.el.parentElement.innerHTML = `<div class="logo_credit error-message"><h2>Что то не так!</h2></div>`
            alert(message)
        })
        
        this.validateAndSubmit()
    }
    
    setPrepaymentData(response) {
        const form = this.el
        const comissionEl = form.querySelector('[data-comission]')
        const comissionTotalSumEl = form.querySelector('[data-comission-sum]')
        const resiverNameEl = form.querySelector('[data-receiver-name]')
        const amount = +form.querySelector('[name="amount"]').value.replace(' ', '')
        const actionBtn = form.querySelector('[data-action]')
        
        actionBtn.innerHTML = actionBtn.innerHTML.replace(actionBtn.innerText, 'Перевести ')
        // If SQB BANK
        if('credit' in response) {
            resiverNameEl.innerHTML = response.credit.name
            comissionEl.innerHTML = '0 %'
            comissionTotalSumEl.innerHTML = getNumberWithSpace(amount) + ' UZS'
        } else {
            const comissionPercent = 1
            resiverNameEl.innerHTML = response.additional['Имя плательщика']
             // Comission percent
            comissionEl.innerHTML = comissionPercent + ' %'
            // Summ with Comission
            const comissionSum = comissionPercent / 100 * amount
            comissionTotalSumEl.innerHTML = getNumberWithSpace(amount + comissionSum) + ' UZS'
        }
    }

    validateAndSubmit() {
        const self = this
        const form = document.querySelector('[data-form-service]');
        const emitter = this.emitter
        const configs = this.configs
        new VanillaValidator(form, {
            customRules: {
                isCardValid: function (value, ruleValue) {
                    if(ruleValue) {
                        return isCardValid(value)
                    }
                    return false
                },
                isExpireDateValid: function (value, ruleValue) {
                    if(ruleValue) {
                        return isExpireDateValid(value)
                    }
                    return false
                },
                isValidCreditId: function(val, rule) {
                    if(rule) {
                        return /\d{7}/g.test(val)
                    }
                    return false
                }
            },
            rules: {
                sender: {
                    required: true,
                    isCardValid: true
                },
                sender_expire: {
                    required: true,
                    isExpireDateValid: true
                },
                amount: {
                    required: true,
                    minlength: 1
                },
                credit_id: {
                    required: true
                }
            },
            messages: {
                sender: {
                    isCardValid: ' ',
                    required: ' '
                },
                sender_expire: {
                    required: ' ',
                    isExpireDateValid: ' '
                },
                amount: {
                    required: ' ',
                    minlength: ' '
                },
                credit_id: {
                    required: ' ',
                    isValidCreditId: ' ',
                }
            },
            submitEventIntercept: function (e, v) {
                e.preventDefault();
            },
            submitHandler: function (form) {
                if('code' in self.userInputDataObj && self.userInputDataObj.code === '') {
                    if(self.service.id !== 0) {
                        new joydaApi(configs, self.userInputDataObj, 'supplier/payment', emitter)
                    } else {
                        self.userInputDataObj.prepare = false
                        new joydaApi(configs, self.userInputDataObj, 'loan/repayment-loan-no-user', emitter)
                    }
                } else {
                    // Pre Payment
                    const postDataObj = formToJSON(form)
                    if(self.service.id !== 0) {
                        postDataObj.code = ""
                        postDataObj.supplier_id = self.service.id
                        postDataObj.supplier_menu_id = self.service.list[0].id
                        const fieldsForm = self.currentServiceFields.map(fields => {
                            const { element, id } = fields
                            const val = form.querySelector('[name='+element+']').value
                            return {id, val}
                        })
                        postDataObj.fields = fieldsForm
                        new joydaApi(configs, postDataObj, 'supplier/prepayment', emitter)
                    }   else { // IF CREDIT FROM SQB
                        const sqbLoanData = {
                            amount: postDataObj.amount,
                            card_id: "0",
                            code: "",
                            loan_id: postDataObj.credit_id,
                            prepare: true,
                            sender: postDataObj.sender,
                            sender_expire: postDataObj.sender_expire
                        }
                        new joydaApi(configs, sqbLoanData, 'loan/repayment-loan-no-user', emitter)
                    }
                }
            },
            onfocusout: true
        })
    }

    setMasks() {
        Inputmask({regex: "[0-9]*"}).mask('[name="credit_id"]');
        Inputmask({mask: '9999 9999 9999 9999', showMaskOnHover: false}).mask(`.${this.cardNumEl}`);
        Inputmask({mask: '99/99'}).mask(`.${this.cardDateEl}`);
        Inputmask({
            alias: 'currency',
            prefix: '',
            groupSeparator: ' ',
            rightAlign: false,
            digits: 0,
            keepStatic: false,
            showMaskOnHover: false,
            showMaskOnFocus: false,
            greedy: false,
            placeholder: '',
            min: 1000,
            max: 10000000000
        }).mask(`.${this.cardSumEl}`)
    }

    showFormFields(fields) {
        const repeaterFields = fields.map(e => {
            return `<div class="col-12 col-lg-4">
                        <div class="receiver-card-number">
                            <label>${e.title}</label>
                            <div class="input-group" data-field-holder>
                                <input type="text" name="${e.element}" class="form-control input-left" placeholder="0000000">
                                <span data-field-error></span>
                            </div>
                        </div>
                    </div> `
        }).join('')
        
        return `
            <div class="${this.selector}">
                <form data-form-service>
                    <div class="row">
                        ${repeaterFields}
                        <div class="col">
                            <div class="card-number">
                                ${cardSenderFields({
                                    label: 'Номер вашей карты',
                                    name: 'sender',
                                    inputCardNumClassName: this.cardNumEl,
                                    inputCardDateClassName: this.cardDateEl,
                                })}
                            </div>
                        </div>
                        <div class="col-12 col-lg-3">
                            ${cardAmountFields({
                                label: 'Сумма платежа',
                                name: 'amount',
                                inputCardAmountClassName: this.cardSumEl
                            })}
                            <span class="user-name" data-receiver-name></span>
                        </div>
                    </div>

                    <div class="transfers-sum">
                        <div class="row mt-3">
                            <div class="col">
                                <div class="commission">
                                    <label>Комисиия</label>
                                    <p data-comission>0%</p>
                                </div>
                            </div>
                            <div class="col">
                                <div class="to-pay">
                                    <label>К оплате</label>
                                    <p data-comission-sum>0</p>
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="pay">
                                    <button type="submit" class="btn" data-action>Продолжить <img src="/local/templates/sqb/img/Vector.png" alt="Оплатить"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>    
        `
    }

    render() {
        const fields = this.service.list.map((e, i) => e.fields[i])
        this.currentServiceFields = fields
        const servicesEl = this.el.querySelector('.logo_credit-img--list')
        servicesEl.remove()
        this.el.insertAdjacentHTML('beforeend', this.showFormFields(fields))
    }

    reRender() {
        // this.$emit('api:clickService', this.service)
    }
}