export const isCardValid = (cardNumber) => {
    return isCorrectNumLength(cardNumber) && isCorrectNumLength(cardNumber) && isCardBankTypeNumValid(cardNumber)
}

export const isCorrectNumLength = (number) => {
    const cardNums = number.split(' ').join('')
    return cardNums.length === 16 && cardNums.split('').every(e => /\d/g.test(e))
}

export const isFirstNumValid = (number) => number.split(' ')[0] === '8600'

export const isCardBankTypeNumValid = (number) => {
    const bankTypes = [
        {key: '02', value: 'nbu'},
        {key: '03', value: 'psb'},
        {key: '04', value: 'agrobank'},
        {key: '05', value: 'mkbank'},
        {key: '06', value: 'xalqbanki'},
        {key: '08', value: 'savdogarbank'},
        {key: '09', value: 'qqb'},
        {key: '11', value: 'turonbank'},
        {key: '12', value: 'hamkorbank'},
        {key: '13', value: 'asakabank'},
        {key: '14', value: 'iybank'},
        {key: '30', value: 'trastbank'},
        {key: '31', value: 'aloqabank'},
        {key: '33', value: 'ipotekabank'},
        {key: '34', value: 'kdbbank'},
        {key: '48', value: 'universalbank'},
        {key: '49', value: 'kapitalbank'},
        {key: '51', value: 'davrbank'},
        {key: '53', value: 'infinbank'},
        {key: '20', value: 'ziraatbank'},
        {key: '38', value: 'turkistonbank'},
        {key: '50', value: 'ravnaqbank'},
        {key: '55', value: 'aabank'},
        {key: '56', value: 'htbank'},
        {key: '57', value: 'ofbank'}
    ]

    const beginCardNum = number.split(' ')[1].slice(0, 2)
    return bankTypes.some(e => e.key === beginCardNum)
}

export const isEqualCardNum = (elClassName, index) => {
    const valToArr = [...document.querySelectorAll(`.${elClassName}`)].map(e => e.value)
    return valToArr.every((e) => e === valToArr[index - 1])
}

export const isValidSmsNum = (val) => {
    return /(\d{3}\s\d{3}$)/.test(val)
}

export const isExpireDateValid = (val) => {
    return /(\d{2}\/\d{2}$)/g.test(val) && val.split('/')[1] >= +new Date().getFullYear().toString().slice(2) && val.split('/')[0] >= new Date().getMonth() + 1 && val.split('/')[0] !== '00' && val.split('/')[0] <= 12
}