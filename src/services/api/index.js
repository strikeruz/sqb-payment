import {
  getBrowserName
} from '@utils/index'

export class joydaApi {
  constructor(config, postDate, method, emitter) {
    this.config = config
    this.API_URL = this.config.API_URL
    this.postData = postDate
    this.method = method
    this.emitter = emitter

    this.lang = this.config.lang || 'ru'
    this.headers = {
      'Content-Type': 'application/json',
      'X-Mobile-AppVersion': 1,
      'X-Mobile-Lang': this.lang,
      'X-Mobile-Model': getBrowserName(),
      'X-Mobile-OSVersion': 'web',
      'X-Mobile-Type': 'web',
      'X-Mobile-UID': 'web',
    }
    
    this.runAction(this.method)
  }

  async postRequest(url, headers, data) {
    this.initLoader()
    const rawData = await fetch(url, {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      credentials: 'same-origin', // include, *same-origin, omit
      headers: headers,
      body: JSON.stringify(data)
    })
    const res = await rawData.json();
    this.removeLoader()
    return res
  }

  initLoader() {
    if(this.method !== 'mobileServices' && this.method !== 'supplier/services') {
      document.querySelector('body').insertAdjacentHTML('afterend', '<div class="loadingloader">Loading&#8230;</div>');
    }
  }

  removeLoader() {
    if(this.method !== 'mobileServices' && this.method !== 'supplier/services') {
      document.querySelector('.loadingloader').remove()
    }
  }

  postPrepayment() {
    // Get Api Data
    this.postRequest(this.API_URL + `/guest/p2p/${this.method}`, this.headers, this.postData)
      .then(response => {
        if (response.success) {
          this.emitter.emit('api:responseSuccess', {
            response: response,
            postDate: this.postData
          })
        } else {
          this.emitter.emit('api:responseError', {
            response: response,
            postDate: this.postData
          })
        }
      });
  }

  beforePay() {
    // Get Api Data
    this.postRequest(this.API_URL + `/guest/p2p/pay`, this.headers, this.postData)
      .then(response => {
        if (response.success) {
          this.emitter.emit('api:responseBeforePaySuccess', response)
        } else {
          this.emitter.emit('api:responseBeforePayError', {
            response: response,
            postDate: this.postData
          })
        }
      });
  }

  pay() {
    this.postRequest(this.API_URL + `/guest/p2p/${this.method}`, this.headers, this.postData)
      .then(response => {
        if (response.success) {
          this.emitter.emit('api:responsePaySuccess', response)
        } else {
          this.emitter.emit('api:responsePayError', {
            response: response,
            postDate: this.postData
          })
        }
      });
  }

  supplierServiceLists() {
    this.postRequest(this.API_URL + `/guest/${this.method}`, this.headers, this.postData)
      .then(response => {
        if (response.success) {
          response.data = [{
            id: 0,
            list: [{
              fields: [{
                title: "ID кредита",
                element: "credit_id",
                id: 0
              }]
            }],
            logo: `https://mobile.sqb.uz/images/sqb.png`,
            title: `SanoatQurilishBank`
          }, ...response.data]
          this.emitter.emit('api:responseSupplierLists', response)
        } else {
          this.emitter.emit('api:responseSupplierLists', response)
        }
      });
  }

  supplierPrepayment() {
    this.postRequest(this.API_URL + `/guest/${this.method}`, this.headers, this.postData)
      .then(response => {
        if (response.success) {
          this.emitter.emit('api:responseSupplierPrepaymentSuccess', {
            response,
            postDate: this.postData
          })
        } else {
          /* TEST 
          response = {
            "success": true,
            "data": {
              "additional": {
                "Карта плательщика": "860003******7651",
                "Имя плательщика": "SAIDOV RUSTAM SAIDOVICH",
                "Поставщик": "Kapitalbank",
                "ID кредита": "123123",
                "Итого": "1000 сум"
              },
              "sysinfo_sid": "",
              "category_id": 11
            },
            "error": {

            }
          }
          this.emitter.emit('api:responseSupplierPrepaymentSuccess', {
            response,
            postDate: this.postData
          })*/
          this.emitter.emit('api:responseSupplierPrepaymentError', response)
        }
      });
  }

  supplierPrepaymentSqb() {
    this.postRequest(this.API_URL + `/guest/${this.method}`, this.headers, this.postData)
      .then(response => {
        if (response.success) {
          if (this.postData.code === "" && this.postData.prepare === true) {
            this.emitter.emit('api:responseSupplierPrepaymentSqbSuccess', {
              response,
              postDate: this.postData
            })
          } else if(this.postData.prepare === false && response.data.status === 'pending') {
            this.emitter.emit('api:supplierBeforePaymentSuccess', response)
          } else if(response.data.status === 'ok') {
            this.emitter.emit('api:supplierPaymentSuccess', response)
          }
        } else {
          if (this.postData.code === "") {
            this.emitter.emit('api:responseSupplierPrepaymentSqbError', response)
          } else {
            this.emitter.emit('api:supplierPaymentError', response)
          }
        }
      });
  }

  supplierPayment() {
    this.postRequest(this.API_URL + `/guest/${this.method}`, this.headers, this.postData)
      .then(response => {
        if (response.success) {
          if (this.postData.code === "") {
            this.emitter.emit('api:supplierBeforePaymentSuccess', response)
          } else {
            this.emitter.emit('api:supplierPaymentSuccess', response)
          }
        } else {
          if (this.postData.code === "") {
            this.emitter.emit('api:supplierBeforePaymentError', response)
            /*
            TEST
            this.emitter.emit('api:supplierBeforePaymentSuccess', {
              "success": true,
              "data": {
                "status": "pending",
                "message": "Код отправлен на 99897*****26"
              },
              "error": {

              }
            })*/
          } else {
            this.emitter.emit('api:supplierPaymentError', response)
          }
        }
      });
  }

  mobileServiceLists() {
      this.postRequest(this.API_URL + `/guest/supplier/services`, this.headers, this.postData)
      .then(response => {
        if (response.success) {
          this.emitter.emit('api:mobileServices', {response, data: this.postData})
        } else {
          this.emitter.emit('api:mobileServicesError', response)
        }
      })
  }

  mobilePrepayment() {
      this.postRequest(this.API_URL + `/guest/supplier/prepayment`, this.headers, this.postData)
          .then(response => {
          if (response.success) {
              this.emitter.emit('api:mobilePrepaymentSuccess', {
              response,
              postDate: this.postData
              })
          } else {
              this.emitter.emit('api:mobilePrepaymentError', response)
          }
      });
  }

  mobileSendSms() {
    this.postRequest(this.API_URL + `/guest/supplier/payment`, this.headers, this.postData)
      .then(response => {
        if (response.success) {
          this.emitter.emit('api:mobileBeforePaymentSuccess', {
            response,
            postDate: this.postData
          })
        } else {
          this.emitter.emit('api:mobileBeforePaymentError', response)
        }
      });
  }


  mobilePay() {
    this.postRequest(this.API_URL + `/guest/supplier/payment`, this.headers, this.postData)
      .then(response => {
        if (response.success) {
          this.emitter.emit('api:mobilePaySuccess', response)
        } else {
          this.emitter.emit('api:mobilePayError', response)
        }
      });
  }
  

  runAction(method) {
    switch (method) {
      case 'prepayment':
        this.postPrepayment()
        break;
      case 'beforePay':
        this.beforePay()
        break;
      case 'pay':
        this.pay()
        break;
      case 'supplier/services':
        this.supplierServiceLists()
        break;
      case 'supplier/prepayment':
        this.supplierPrepayment()
        break;
      case 'loan/repayment-loan-no-user':
        this.supplierPrepaymentSqb()
        break;
      case 'supplier/payment':
        this.supplierPayment()
        break;
      case 'mobileServices':
        this.mobileServiceLists()
        break;  
      case 'mobilePrepayment':
        this.mobilePrepayment()
        break; 
      case 'mobileSendSms':
        this.mobileSendSms()
        break;
      case 'mobilePay':
        this.mobilePay()
        break;        
      default:
        'prepayment'
        break;
    }
  }
}