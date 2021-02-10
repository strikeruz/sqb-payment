import { combineReducers } from 'redux'
import categoryReducer from './p2p/categoryReducer'
import serviceReducer from './p2p/servicesReducer'

export default combineReducers({
  categories: categoryReducer,
  services: serviceReducer
})