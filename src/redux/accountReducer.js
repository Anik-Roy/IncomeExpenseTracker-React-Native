import * as actionTypes from './actionTypes';

const initialState = {
  accounts: [],
  hasError: false
};

export const accountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.concat(action.payload)
      };
    case actionTypes.UPDATE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.map(item => {
          if(item.id === action.payload.id) {
            console.log("account > ", item.id, action.payload.id);
            return {
              ...item,
              account: action.payload.account
            }
          } else {
            return item;
          }
        })
      }
    case actionTypes.FETCH_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload
      }
    case actionTypes.DELETE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter(item => item.id != action.payload.id),
      }
    default:
      return state;
  }
};