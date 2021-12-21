import {Platform} from 'react-native'

const GlobalVar = {
  toastTimeout: 2000,
  key: '',
  requestTimeout: 35000,
  responseInvalidCode: 422,
  responseUnauthorizedCode: 401,
  responseNotFound: 404,
  responseToManyRequest: 429,
  responseSuccess: 200,
  responseInternalServerCode: 500,
  failedMsg: 'Poor network connection or server not responding!',
  requestFailedMsg: 'Request Failed',
  imageCompressionRatio: 0.7,
  isCoach: 0,

  
  validateEmail (email) {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(email)
  },
  keyboardBehavior () {
    return Platform.OS === 'ios' ? 'padding' : null
  },
  dateToYMD (date) {
    var d = date.getDate()
    var m = date.getMonth() + 1 //Month from 0 to 11
    var y = date.getFullYear()
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d)
  },
  numDifferentiation (value) {
    var val = Math.abs(value)
    if (val >= 10000000) {
      val = (val / 10000000).toFixed(2) + ' Cr'
    } else if (val >= 100000) {
      val = (val / 100000).toFixed(2) + ' L'
    }
    return val
  },
  validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }
 
}

export default GlobalVar
