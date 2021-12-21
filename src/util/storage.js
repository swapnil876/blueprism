import AsyncStorage from '@react-native-async-storage/async-storage'
// import SyncStorage from 'sync-storage';

export const Storage = {
  async _storeData (key, item) {
    try {
      //we want to wait for the Promise returned by AsyncStorage.setItem()
      //to be resolved to the actual value before returning the value
      var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item))
      return jsonOfItem
    } catch (error) {
      console.log(error.message)
    }
  },
  async _retrieveData (key) {
    const retrievedItem = await AsyncStorage.getItem(key)
    const item = JSON.parse(retrievedItem)
    console.log(retrievedItem)
    return retrievedItem
  },
}
