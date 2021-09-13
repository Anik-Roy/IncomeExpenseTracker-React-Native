import * as actionTypes from './actionTypes';

const INITIAL_STATE = {
    isAuth: null,
    idToken: null,
    localId: null,
    refreshToken: null,
    email: "",
    isAuthUserLoading: false
}

export const authReducer = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.AUTHENTICATE_USER:
            return {
                ...state,
                isAuth: action.payload.isAuth,
                idToken: action.payload.idToken,
                localId: action.payload.localId,
                refreshToken: action.payload.refreshToken,
                email: action.payload.email,
                isAuthUserLoading: false
            }
        case actionTypes.AUTHENTICATE_USER_LOADING:
            return {
                ...state,
                isAuthUserLoading: true
            }
        case actionTypes.LOGOUT_USER:
            return {
                ...state,
                isAuth: false,
                idToken: null,
                localId: null,
                refreshToken: null
            }
        default:
            return state;
    }
}