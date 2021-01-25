import { cardSenderFields } from '@components/fields/money-transfer/cardSenderField';
import { cardAmountFields } from '@components/fields/money-transfer/cardAmountField';
import { cardReceiverFields } from '@components/fields/money-transfer/cardResiverField';
import { isCardValid, isExpireDateValid } from '@utils/validationsCard';
import { formToJSON, getNumberWithSpace } from '@utils/index';
import { JoydaComponent } from '@components/JoydaComponent';
import { SmsPendingBlock } from '@components/SmsPendingComponent'
import Inputmask from 'inputmask';
import VanillaValidator from 'vanillajs-validation';
import { joydaApi } from '@services/api/index';

export class MoneyTransfer extends JoydaComponent {
    constructor(options) {
        super({name: 'MoneyTransfer', emitter: options.emitter})
        this.options = options.configs

        // Selectors
        this.selector = 'p2pModule'
        this.formId = `${this.selector}_form`
        this.cardNumEl = 'input-card-num'
        this.cardDateEl = 'input-card-date'
        this.cardSumEl = 'input-thousand'
        this.cardResoverEl = 'card-resiver'
        this.currentTab = document.querySelector('.tab-content.current')

        this.userInputDataObj = {}
    }

    setupEvents() {
        // Set Mask to form inputs
        this.setMasks()

        // Success PrePayment
        this.$on('api:responseSuccess', data => {
            // console.log('responseSuccess', data)
            let { response, postDate } = data
            this.userInputDataObj = {code: '', ...postDate}
            /* TEST
            response = {
                "success":true,
                "data":{
                   "additional":[
                      {
                         "key":"Карта получателя",
                         "value":"860012******8385",
                         "type":"receiver_card"
                      },
                      {
                         "key":"Получатель",
                         "value":"ABDUJABBOROV FARRUH",
                         "type":"receiver_name"
                      },
                      {
                         "key":"Стоимость услуги",
                         "value":"0.50",
                         "type":"commission"
                      }
                   ]
                },
                "error":{
                   
                }
            }
            */
            this.setPrepaymentData(response)
        })

        // Error PrePayment
        this.$on('api:responseError', ({response}) => {
            // console.log('responseError', response)
            const { message } = response.error
            alert(message)
        })

        // Before Pay Success | Wait sms code
        this.$on('api:responseBeforePaySuccess', response => {
            // console.log('responseBeforePaySuccess', response)
            new SmsPendingBlock({el: this.currentTab, emitter: this.emitter, response: response, eventName: 'paySmsConfirmation'})
        })

        // Before Pay Error | Wait sms code
        this.$on('api:responseBeforePayError', ({response}) => {
            // console.log('responseBeforePayError', response)
            const { message } = response.error
            alert(message)
        })

        // Submit after Sms Confirmation
        this.$on('api:paySmsConfirmation', smsNumber => {
            // console.log('paySmsConfirmation', smsNumber)
            const { code } = smsNumber
            this.userInputDataObj.code = code
            new joydaApi(this.options, this.userInputDataObj, 'pay', this.emitter)
        })

        // Success after Pay
        this.$on('api:responsePaySuccess', response => {
            // console.log('responsePaySuccess', response)
            if(response.data.status !== 'pending') {
                this.el.parentElement.innerHTML = `<div class="logo_credit succses-message"><h2>Оплата прошла успешно!</h2></div>`
            }
        })

        // Error after Pay
        this.$on('api:responsePayError', ({response}) => {
            // console.log('responsePayError', response.error)
            const errorMsg = response.error.message
            this.currentTab.innerHTML = `<div class="logo_credit error-message"><h2>Что то не так!</h2></div>`
            alert(errorMsg)
        })

        // Submit form
        this.validateAndSubmit()
    }

    setPrepaymentData(response) {
        const form = document.querySelector(`#${this.formId}`)
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

    validateAndSubmit() {
        const self = this
        const form = document.querySelector('[data-form]');
        const emitter = this.emitter
        const configs = this.options
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
                receiver: {
                    required: true,
                    isCardValid: true
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
                receiver: {
                    required: ' ',
                    isCardValid: ' ',
                }
            },
            submitEventIntercept: function (e, v) {
                v.userInputDataObj = self.userInputDataObj
                e.preventDefault();
            },
            submitHandler: function (form) {
                if('code' in this.userInputDataObj && this.userInputDataObj.code === '') {
                    // Pending Sms
                    new joydaApi(configs, this.userInputDataObj, 'beforePay', emitter)
                } else if('code' in this.userInputDataObj && this.userInputDataObj.code !== '') {
                    // Pay
                    new joydaApi(configs, this.userInputDataObj, 'pay', emitter)
                }
                else {
                    // Pre Payment
                    const postDataObj = formToJSON(form)
                    new joydaApi(configs, postDataObj, 'prepayment', emitter)
                }
            },
            onfocusout: true
        })
    }

    setMasks() {
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

    render() {
        return `
            <div>
                <form id="${this.formId}" data-form>
                    <div class="row">
                        <div class="col">
                            ${cardSenderFields({
                                label: 'Номер вашей карты',
                                name: 'sender',
                                inputCardNumClassName: this.cardNumEl,
                                inputCardDateClassName: this.cardDateEl,
                            })}
                        </div>
                        <div class="col-12 col-lg-3">
                            ${cardAmountFields({
                                label: 'Хочу перевести',
                                name: 'amount',
                                inputCardAmountClassName: this.cardSumEl
                            })}
                        </div>
                        <div class="col">
                            ${cardReceiverFields({
                                label: 'Карта получателя',
                                name: 'receiver',
                                inputCardResiverClassName: this.cardResoverEl
                            })}
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
                    </div>
                </form> 
        `
    }
}