import { cardSenderFields } from '@components/fields/money-transfer/cardSenderField';
import { cardAmountFields } from '@components/fields/money-transfer/cardAmountField';
import { isCardValid, isExpireDateValid } from '@utils/validationsCard';
import { formToJSON, getNumberWithSpace } from '@utils/index';
import { JoydaComponent } from '@components/JoydaComponent';
import { SmsPendingBlock } from '@components/SmsPendingComponent'
import Inputmask from 'inputmask';
import VanillaValidator from 'vanillajs-validation';
import { joydaApi } from '@services/api/index';
import { cardPhoneNumber } from './fields/money-transfer/cardPhoneNumber';

export class MobilePayment extends JoydaComponent {
    constructor(options) {
        super({name: 'MobilePayment', emitter: options.emitter})
        this.selector = 'mobileServices'
        this.options = options.configs
        this.mobileServices= []
        this.userInputDataObj = {}

        // Selectors
        this.currentTab = document.querySelector('#tab-2')
        this.selector = 'mobileServicesModule'
        this.formId = `${this.selector}_form`
        this.phoneNumEl = 'input-card-phone'
        this.cardNumEl = 'input-card-num'
        this.cardDateEl = 'input-card-date'
        this.cardSumEl = 'input-thousand'
        this.cardResoverEl = 'card-resiver'
    }

    setupEvents () {
        this.fetchMobileServices()
        // Set Mask to form inputs
        this.setMasks()
        this.validateAndSubmit()

        // Events
        this.$on('api:mobilePrepaymentSuccess', res => {
            // console.log('mobilePrepaymentSuccess', res)
            const {response, postDate} = res
            this.userInputDataObj = postDate
            this.userInputDataObj.code = ''
            this.setPrepaymentData(response.data)
        })

        this.$on('api:mobilePrepaymentError', response => {
            // console.log('mobilePrepaymentError', response)
            const { message } = response.error
            alert(message)
        })

        // SMS
        this.$on('api:mobileBeforePaymentSuccess', data => {
            // console.log('mobileBeforePaymentSuccess', data)
            new SmsPendingBlock({el: this.currentTab, emitter: this.emitter, response: data.response, eventName: 'mobilePaySmsConfirmation'})
        })

        this.$on('api:mobileBeforePaymentError', response => {
            // console.log('mobileBeforePaymentError', response)
            const { message } = response.error
            alert(message)
        })

        // Confirmation
        this.$on('api:mobilePaySmsConfirmation', smsNumber => {
            // console.log('mobilePaySmsConfirmation', smsNumber)
            const { code } = smsNumber
            this.userInputDataObj.code = code
            new joydaApi(this.options, this.userInputDataObj, 'mobilePay', this.emitter)
        })

        // Success
        this.$on('api:mobilePaySuccess', smsNumber => {
            // console.log('mobilePaySuccess', smsNumber)
            if(response.data.status !== 'pending') {
                this.el.parentElement.innerHTML = `<div class="logo_credit succses-message"><h2>Оплата прошла успешно!</h2></div>`
            }
        })

        // Error
        this.$on('api:mobilePayError', smsNumber => {
            // console.log('mobilePayError', smsNumber)
            const errorMsg = response.error.message
            // this.currentTab.innerHTML = `<div class="logo_credit error-message"><h2>Что то не так!</h2></div>`
            alert(errorMsg)
        })
    }

    filterPhoneCode(topics, find) {
        return topics.reduce(function (acc, topic) {
            const list = topic.list.reduce(function (acc, cat) {
                const cats = cat.fields.filter( ind => ind.data[0])
                const fields = cats.filter(m => m.data.some(e => e.key == find))
    
                return !fields.length ? acc
                    : acc.concat(Object.assign({}, cat, { fields }));
            }, []);
            return !list.length ? acc
                : acc.concat(Object.assign({}, topic, { list })); 
        }, []);
    }

    fetchMobileServices() {
        if(this.mobileServices.length == false) {
            new joydaApi(this.options, {
                category_id: 1, // Mobile Category
                is_new: true
            }, 'mobileServices', this.emitter)
        }

        this.$on('api:mobileServices', res => {
            // console.log('mobileServices', res)
            this.mobileServices = res.response.data
        })

        this.$on('api:mobileServicesError', response => {
            console.log('mobileServicesError', response)
            const { message } = response.error
            alert(message)
        })
    }

    getPhoneRequest(form) {
        const postDataObj = formToJSON(form)
        postDataObj.phone = postDataObj.phone.replace('+998', '')
        const prefix = postDataObj.phone.split('').splice(0,2).join('')
        const account = postDataObj.phone.split('').splice(2,7).join('')
        const filteredCompany = this.filterPhoneCode(this.mobileServices, prefix).map(e => e.id)[0]
        if(filteredCompany) {
            const filteredMobileByCodeObj = this.mobileServices.filter(e => e.id === filteredCompany)[0]
            const fields = filteredMobileByCodeObj.list.map(e => e.fields)[0].map(e => ({ id: e.id, val: '' }))
            fields[0].val = prefix
            fields[1].val = account
            postDataObj.fields = fields
            postDataObj.supplier_id = filteredMobileByCodeObj.id
            postDataObj.supplier_menu_id = filteredMobileByCodeObj.id
        }
        delete postDataObj.phone
        return postDataObj
    }

    validateAndSubmit() {
        const self = this
        const form = document.querySelector('[data-form-mobile]');
        const emitter = self.emitter
        const configs = self.options
        new VanillaValidator(form, {
            customRules: {
                isCardValid: function (value, ruleValue) {
                    if(ruleValue) {
                        return isCardValid(value)
                    }
                    return false
                },
                isValidPhone: function (value, ruleValue) {
                    if(ruleValue) {
                        return /\d{2}8\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/g.test(value)
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
                phone: {
                    required: true,
                    isValidPhone: true
                },
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
                }
            },
            messages: {
                phone: {
                    required: ' ',
                    isValidPhone: ' '
                },
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
                }
            },
            submitEventIntercept: function (e, v) {
                v.userInputDataObj = self.userInputDataObj
                e.preventDefault();
            },
            submitHandler: function (form) {
                if(this.userInputDataObj.hasOwnProperty('code')) {
                    new joydaApi(configs, self.userInputDataObj, 'mobileSendSms', emitter) // Confirm
                } else {
                    const reqDataObj = self.getPhoneRequest(form)
                    new joydaApi(configs, reqDataObj, 'mobilePrepayment', emitter)
                }
            },
            onfocusout: true
        })
    }

    setMasks() {
        Inputmask({mask: '9999 9999 9999 9999', showMaskOnHover: false}).mask(`.${this.cardNumEl}`)
        Inputmask({mask: '99/99'}).mask(`.${this.cardDateEl}`)
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
        Inputmask({mask: '+\\9\\98 99 999 99 99', showMaskOnHover: false, prefix:"+999 "}).mask(`.${this.phoneNumEl}`)
    }

    setPrepaymentData(response) {
        const form = document.querySelector('[data-form-mobile]')
        const comissionEl = form.querySelector('[data-comission]')
        const comissionTotalSumEl = form.querySelector('[data-comission-sum]')
        const resiverNameEl = form.querySelector('[data-receiver-name]')
        const actionBtn = form.querySelector('[data-action]')
        actionBtn.innerHTML = actionBtn.innerHTML.replace(actionBtn.innerText, 'Перевести ')
        
        const comission = response.additional["Комиссия"]
        const totalSum = response.additional["Итого"]
        const resiverName = response.additional["Имя плательщика"]

        resiverNameEl.innerHTML = resiverName
        comissionEl.innerHTML = comission
        comissionTotalSumEl.innerHTML = totalSum
    }

    render() {
        return `
            <div>
                <form id="${this.formId}" data-form-mobile>
                    <div class="row">
                        <div class="col-12 col-lg-4">
                            ${cardPhoneNumber({
                                label: 'Номер телефона',
                                name: 'phone',
                                inputPhoneNumClassName: this.phoneNumEl
                            })}  
                        </div>
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
                    </div>
                </form> 
        `
    }
}