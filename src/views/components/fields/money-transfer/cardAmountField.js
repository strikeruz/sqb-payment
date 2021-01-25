export function cardAmountFields({
    label,
    name,
    inputCardAmountClassName
}) {
    return `
        <div class="amount" data-field-holder>
            <label>${label}</label>
            <div class="input-group">
                <input type="text" name="${name}" class="form-control ${inputCardAmountClassName}" placeholder="100 000 000">
                <div class="input-group-append"><span class="input-group-text">UZS</span></div>
            </div>
            <span data-field-error></span>
        </div>
    `
}