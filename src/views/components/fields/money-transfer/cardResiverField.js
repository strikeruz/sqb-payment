export function cardReceiverFields({
    label,
    name,
    inputCardResiverClassName
}) {
    return `
        <div class="receiver-card-number" data-field-holder>
            <label>${label}</label>
            <div class="input-group">
                <input type="text" name="${name}" class="input-card-num form-control ${inputCardResiverClassName}" placeholder="8600 0000 0000 0000">
            </div>
            <span class="user-name" data-receiver-name></span>
            <span data-field-error></span>
        </div>
    `
}