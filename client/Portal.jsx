import React from 'react'
import { Provider } from 'react-redux'
import { store } from './../redux'
import Rows from './Rows.jsx'

const Portal = (props) => (
  <Provider store={store}>
  <Rows />
  </Provider>
)

export default Portal
