import i18n from 'i18next'
import LanguageDetector from "i18next-browser-languagedetector"
import {initReactI18next} from 'react-i18next'
import languageEN from './en.json'
import languageRU from './ru.json'
import languageUZ from './uz.json'


// Битрикс
const currentLang = typeof BX === 'undefined' ? 'ru' : BX.message.LANGUAGE_ID

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
    resources: {
        en: languageRU,
        ru: languageEN,
        uz: languageUZ
    },
    /* default language when load the website in browser */
    lng: currentLang,
    /* When react i18next not finding any language to as default in borwser */
    fallbackLng: "ru",
    /* debugger For Development environment */
    debug: true,
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: ".",
    interpolation: {
        escapeValue: false,
        formatSeparator: ","
    },
    react: {
        wait: true,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'
    }
})

export default i18n;