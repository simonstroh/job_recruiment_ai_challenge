import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

// Initial state

const initialState = {
  rows: []
}

// Reducer

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setRows':
      return { ...state, rows: action.value }
    default:
      return state
  }
}

// Store

const store = createStore(reducer, applyMiddleware(thunkMiddleware))

// Action creators

const setRows = (section) => {
  return {
    type: 'setRows',
    value: section
  }
}

export {
  store,
  setRows
}
