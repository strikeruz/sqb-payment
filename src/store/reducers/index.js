import { combineReducers } from 'redux'
import categoryReducer from './p2p/categoryReducer'
import serviceReducer from './p2p/servicesReducer'
import formReducer from './p2p/formReducer'

export default combineReducers({
  categories: categoryReducer,
  services: serviceReducer,
  formState: formReducer
})