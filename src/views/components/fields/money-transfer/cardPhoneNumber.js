export function cardPhoneNumber({
    label,
    name,
    inputPhoneNumClassName
}) {
    return `
        <div class="receiver-card-number" data-field-holder>
            <label>${label}</label>
            <div class="input-group">
                <input type="text" name="${name}" class="${inputPhoneNumClassName} form-control" placeholder="+998 90 -- --- -- --">
            </div>
            <span data-field-error></span>
            <p></p>
        </div>
    `
}