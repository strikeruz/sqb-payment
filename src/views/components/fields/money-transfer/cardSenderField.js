import { getNumYear } from '@utils/index'

export function cardSenderFields({
    label,
    name,
    inputCardNumClassName,
    inputCardDateClassName
}) {
    return `
        <label>${label}</label>
        <div class="card_expire_col">
            <div class="input-group" data-field-holder>
                <input type="text" name="${name}" class="${inputCardNumClassName} form-control input-left" placeholder="8600 0000 0000 0000">
                <span data-field-error></span>
            </div>
            <div class="input-group" data-field-holder>
                <input type="text" name="sender_expire" class="form-control input-right ${inputCardDateClassName}" placeholder="01/${getNumYear()}">
                <span data-field-error></span>
            </div>
        </div>
    `
}