import { authReducer } from './authReducer';
import { transactionsReducer } from './transactionsReducer';
import { accountsReducer } from './accountReducer';
import { combineReducers } from 'redux';

export const Reducer = combineReducers({
    authReducer: authReducer,
    transactionsReducer: transactionsReducer,
    accountsReducer: accountsReducer
})