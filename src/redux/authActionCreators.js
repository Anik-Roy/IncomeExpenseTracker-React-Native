import * as actionTypes from './actionTypes';
import { navigationRef, navigate } from '../NavigationRoot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const authUser = (idToken, localId, refreshToken, email) => {
    // console.log("authUser > called!");
    return {
        type: actionTypes.AUTHENTICATE_USER,
        payload: {
            isAuth: idToken !== null ? true : false,
            idToken: idToken,
            localId: localId,
            refreshToken: refreshToken,
            email: email
        }
    }
}

export const authenticateUserLoading = () => {
    console.log("authenticateUserLoading > called from tryAuthFromPersistantStorage");

    return {
        type: actionTypes.AUTHENTICATE_USER_LOADING
    }
}

export const tryAuthFromPersistantStorage = () => dispatch => {
    // console.log("tryAuthFromPersistantStorage > called!");
    dispatch(authenticateUserLoading());

    _getUser()
        .then(response => {
            var seconds = new Date().getTime() / 1000;
            console.log("LoginScreen _getUser > userInfo > ", response.expiresIn);
            const email = response.email;
            if(response.currentTime + response.expiresIn > seconds) {
                dispatch(authUser(null, null, null, ""));
            } else {
                fetch('https://securetoken.googleapis.com/v1/token?key=AIzaSyC7sAMXpUKFwdm3beQlH3THyMg6hShKeuU', {
                    method: "POST",
                    body: JSON.stringify({
                        grant_type: "refresh_token",
                        refresh_token: response.refreshToken
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .catch(err => {
                    console.log("refreshToken > ",err)
                    dispatch(authUser(null, null, null, ""));
                })
                .then(response => response.json())
                .then(data => {
                    // console.log(data.user_id)
                    // console.log(data.refresh_token);
                    // console.log(data.id_token);
                    // console.log(data.expires_in);

                    var seconds = new Date().getTime() / 1000;

                    let userData = {
                        currentTime: seconds,
                        idToken: data.id_token,
                        localId: data.user_id,
                        refreshToken: data.refresh_token,
                        expiresIn: data.expires_in,
                        email: email
                    }
                    _storeUser(userData)
                        .then(response => {
                            console.log(" >>>>>>>>> ",response);
                            dispatch(authUser(response.idToken, response.localId, response.refreshToken, response.email));
                        })
                        .catch(err => {
                            console.log(err);
                            alert("An error occured!");
                            dispatch(authUser(null, null, null, ""));
                        });
                });
            }
            // navigate("Dashboard");
        })
        .catch(err => {
            dispatch(authUser(null, null, null));
            // console.log("LoginScreen _getUser > error > ", err);
        })
}

export const tryAuth = (email, password, mode) => dispatch => {
    dispatch(authenticateUserLoading());
    let end_point = "";
    const api_key = "AIzaSyC7sAMXpUKFwdm3beQlH3THyMg6hShKeuU";

    if(mode === "signup") {
        end_point = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`;
    } else {
        end_point = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`;
    }
    
    
    fetch(end_point, {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .catch(err => {
        console.log("Signup error > ", err);
        alert("an error occured!")
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            dispatch(authUser(null, null, null, ""));
            // navigate("Dashboard");        
            alert(data.error.message);
        } else {
            const localId = data.localId.toString();
            axios.patch("https://expense-tracker-9b728-default-rtdb.firebaseio.com/users.json?auth="+data.idToken, {
                [localId]: {
                    email: data.email,
                    last_login: {
                        ".sv": "timestamp"
                    }
                }
            }).then(response => {
                // console.log("saved to realtime database > ", response);
                _storeUser(data)
                    .then(res => {
                        // console.log("_storeUser response > ", res);
                        dispatch(authUser(data.idToken, data.localId, data.refreshToken, data.email));
                        // navigate("Dashboard");
                    }).catch(err => {
                        // console.log("_storeUser error > ", err)
                        alert(err);
                    });
            })
            .catch(err => {
                console.log("saving to realtime database > ", err);
                alert(err);
            });
        }
        console.log("Signup/Login > ", data);
    });
}

export const logoutUser = () => {
    return {
        type: actionTypes.LOGOUT_USER
    }
}

export const tryLogout = () => dispatch => {
    // console.log("I am called from App.js > logout button click!", navigationRef);
    
    _removeUser()
        .then(response => {
            dispatch(logoutUser());
        })
        .catch(err => {
            alert(err);
        })
}

const _storeUser = async data => {
    try {
        var seconds = new Date().getTime() / 1000;
        data.currentTime = seconds;
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem("userInfo", jsonValue);
        return data;
    } catch(err) {
        return err;
    }
}

export const _getUser = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem("userInfo");
        let userInfo = null;
        if(jsonValue != null) {
            userInfo = JSON.parse(jsonValue);
        }
        return userInfo;
    }catch(err) {
        return err;
    }
}

const _removeUser = async () => {
    try {
        await AsyncStorage.removeItem("userInfo");
        return true;
    } catch(err) {
        return err;
    }
}