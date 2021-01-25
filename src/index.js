import { Joyda } from '@modules/joyda'
import { MoneyTransfer } from '@components/MoneyTransferComponent';
import { RePaymentLoan } from '@components/RePaymentLoanComponent';
import { MobilePayment } from '@components/MobilePaymentComponent';

// import './scss/index.scss'
new Joyda({
	API_URL: 'https://mobile.sqb.uz/api/v2',
	selector: 'payment',
	avilableMethods: [],
	tabs: [
		{
			methodLabel: 'Денежные переводы <br>с карты на карту',
			tabSubtitle: 'Быстрый перевод другу на карту',
			icon: 'http://sqb.loc/local/templates/sqb/img/transfers-colored.png',
			components: [MoneyTransfer]
		},
		{
			methodLabel: 'Погашение <br>кредита',
			tabSubtitle: 'Быстрое погашение кредита',
			icon: 'http://sqb.loc/local/templates/sqb/img/money.png',
			components: [RePaymentLoan]
		},
		{
			methodLabel: 'Мобильная <br>связь',
			tabSubtitle: 'Мобильная связь',
			icon: 'http://sqb.loc/local/templates/sqb/img/smartphone.png',
			components: [MobilePayment]
		}
	],
	lang: 'ru'
})