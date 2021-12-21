import axios from 'axios'
import Http from '../api/http'
import GlobalVar from '../global'
import Toast from 'react-native-root-toast'
import AsyncStorage from '@react-native-async-storage/async-storage';

global.cancel = []

export const APICaller = (
  endPoint,
  method,
  body,
  token = null,
  otherApi = false,
  contentType = null,
) => {
  // alert(JSON.stringify(token))
  // console.log('token',token)

  if (!otherApi) {
    if (method == 'GET') {
      let b = serialize(body)
      endPoint = `${Http.APIURL}/${endPoint + b}`
    } else {
      endPoint = `${Http.APIURL}/${endPoint}`
    }
  }
  // console.log('endpoint',endPoint)
  if (contentType == null) {
    contentType = 'application/json'
  }

  let header = {
    'Content-Type': contentType,
  }
  token!=null?header['Authorization']='Token '+token:null;
// console.log("*******",token)
  let errorHandle = {hasValidation: false, hasErr: false, message: ''}
  return axios({
    method: method,
    url: endPoint,
    data: body, //&& JSON.parse(body),
    headers: header,
    timeout: GlobalVar.requestTimeout,
    responseType: 'json',
    cancelToken: new axios.CancelToken(c => {
      global.cancel.push({endPoint, token: c})
    }),
  })
  
    .then(response => {
      // console.log('************',response)
      return response.data
    })
    .catch(error => {
      if (axios.isCancel(error)) {
        return {data: 'cancel'}
      }
      switch (error.response.status) {
        case 401:
          //remove Token
          Toast.show('Authentication Failed', {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            backgroundColor: '#fbad19',
          })
          AsyncStorage.removeItem('authToken')
          AsyncStorage.removeItem('userData')
          this.navigation.navigate('Login')
          errorHandle.message = 'Authentication Error'
          return errorHandle
          break
        case 422:
          errorHandle.hasValidation = true
          let errors = {}
          let count = -1
          for (var i in error.response.data) {
            count++
            if (error.response.data.hasOwnProperty(i)) {
              errors[i] = error.response.data[i][0]
              Toast.show(error.response.data[i][0], {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                backgroundColor: '#fbad19',
                textStyle: {
                  lineHeight: 20,
                },
              })
              errorHandle.hasValidation = true
              return errorHandle
            }
            if (count == 0) {
              errors['message'] = errors[i]
              Toast.show(errors[i], Toast.LONG, Toast.BOTTOM)
              errorHandle.hasValidation = true
              return errorHandle
            }
          }
          //Validation Error
          break
        case 404:
          errorHandle.message = 'Page not found'
          return errorHandle
          break
        case 500:
          Toast.show('Something Went Wrong', {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            backgroundColor: '#fbad19',
          })
          //Server Error
          return false
          break
        default:
          errorHandle = {
            hasValidation: false,
            hasErr: true,
            message: error.response.data,
          }
          return errorHandle
      }
    })

  function serialize (obj) {
    let str =
      '?' +
      Object.keys(obj)
        .reduce(function (a, k) {
          a.push(k + '=' + encodeURIComponent(obj[k]))
          return a
        }, [])
        .join('&')
    return str
  }
}
