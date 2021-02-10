import axios from 'axios'

export function getBrowserName() {
    if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1 ) {
        return 'Opera';
    }else if (navigator.userAgent.indexOf('Chrome') !== -1 ){
        return 'Chrome';
    }else if (navigator.userAgent.indexOf('Safari') !== -1){
        return 'Safari';
    }else if (navigator.userAgent.indexOf('Firefox') !== -1 ) {
        return 'Firefox';
    } else {
        return 'unknown';
    }
}

export const joydaApiInstance = axios.create({
  baseURL : 'https://mobile.sqb.uz/api/v2/guest/',
  headers: {
    'Content-Type': 'application/json',
    'X-Mobile-AppVersion': 1,
    'X-Mobile-Lang': 'ru',
    'X-Mobile-Model': getBrowserName(),
    'X-Mobile-OSVersion': 'web',
    'X-Mobile-Type': 'web',
    'X-Mobile-UID': 'web',
  }
})