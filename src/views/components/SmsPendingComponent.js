import VanillaValidator from 'vanillajs-validation';
import Inputmask from 'inputmask';
import { isValidSmsNum } from '@utils/validationsCard';
import { countdownTimer, formToJSON } from '@utils/index';

export class SmsPendingBlock {
    constructor(configs) {
        this.el = configs.el
        this.emitter = configs.emitter
        this.response = configs.response
        this.eventName = configs.eventName
        this.init()
    }   

    init() {
        this.el.innerHTML = this.render()
        this.setupEvents()
    }

    setupEvents() {
        this.setMasks()
        countdownTimer('counter-timer', 1, 0, () => {
            // alert('Время истекло')
            this.el.querySelector('[type="submit"]').innerText = 'Отправить еще раз'
        })
        this.submitHandler()
    }

    setMasks() {
        Inputmask({mask: '999 999', showMaskOnHover: false}).mask(this.el.querySelector('.kod-podverjdeniya--btn'));
    }

    submitHandler() {
        const self = this
        const form = document.querySelector('[data-form-sms]');
        new VanillaValidator(form, {
            customRules: {
                isValidSmsNum: function (value, ruleValue) {
                    if(ruleValue) {
                        return isValidSmsNum(value)
                    }
                    return false
                }
            },
            rules: {
                code: {
                    required: true,
                    isValidSmsNum: true
                }
            },
            messages: {
                code: {
                    isValidSmsNum: ' ',
                    required: ' '
                }
            },
            submitEventIntercept: function (e, v) {
                e.preventDefault();
            },
            submitHandler: function (form) {
                const smsNumber = formToJSON(form)
                self.emitter.emit(`api:${self.eventName}`, smsNumber)
            },
            onfocusout: true
        })
    }


    render() {
        return `
            <div class="logo_credit kod-podverjdeniya">
                <h2>${this.response.data.message}</h2>
                <form data-form-sms>
                    <div class="card-number" data-field-holder>
                        <div class="input-group">
                            <input type="text" name="code" class="form-control kod-podverjdeniya--btn">
                            <span class="input-group-divider"></span>
                        </div>
                        <span data-field-error></span>
                    </div>
                    <div class="reminder">Ещё раз можно отправить код подтверждения через <span id="counter-timer">00:58</span> с</div>
                    <button type="submit" class="btn btn-red">Подтвердить</button>
                </form>
            </div>
        `
    }
}