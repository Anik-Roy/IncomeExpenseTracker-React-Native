import * as actionTypes from './actionTypes';

const initialState = {
  transactions: [],
  hasError: false
};

export const transactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.concat(action.payload)
      };
    case actionTypes.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(item => {
          if(item.id === action.payload.id) {
            console.log(item.id, action.payload.id);
            return {
              ...item,
              title: action.payload.title,
              price: action.payload.price
            }
          } else {
            return item;
          }
        })
      }
    case actionTypes.FETCH_TRANSACTION:
      return {
        ...state,
        transactions: action.payload
      }
    case actionTypes.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(item => item.id != action.payload.id),
      }
    default:
      return state;
  }
};