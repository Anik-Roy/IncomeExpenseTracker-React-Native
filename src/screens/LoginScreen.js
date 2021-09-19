import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ImageBackground } from 'react-native';
import PasswordTextBox from '../components/PasswordTextBox';
import { connect } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { tryAuth, authUser } from '../redux/authActionCreators';
// import { navigationRef, navigate } from '../NavigationRoot';

const mapStateToProps = state => {
    return {
        isAuth: state.authReducer.isAuth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        tryAuth: (email, password, mode) => dispatch(tryAuth(email, password, mode)),
        authUser: (idToken, localId, refreshToken) => dispatch(authUser(idToken, localId, refreshToken))
    }
}

const LoginScreen = props => {
    
    const [authState, setAuthState] = useState({
        mode: "Login",
        inputs: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    // useEffect(() => {
    //     // console.log("LoginScreen: > inside useEffect");
    //     // console.log("LoginScreen: navigationRef ", navigationRef);

    //     _getUser()
    //         .then(response => {
    //             // console.log("LoginScreen _getUser > userInfo > ", response);
    //             props.authUser(response.idToken, response.localId, response.refreshToken);
    //             navigate("Dashboard");
    //         })
    //         .catch(err => {
    //             // console.log("LoginScreen _getUser > error > ", err);
    //         })
    // }, [props.isAuth]);

    // const _getUser = async () => {
    //     try {
    //         const jsonValue = await AsyncStorage.getItem("userInfo");
    //         let userInfo = null;
    //         if(jsonValue != null) {
    //             userInfo = JSON.parse(jsonValue);
    //         }
    //         return userInfo;
    //     }catch(err) {
    //         return err;
    //     }
    // }

    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const handleAuth = () => {
        const email = authState.inputs.email;
        const password = authState.inputs.password;
        const confirmPassword = authState.inputs.confirmPassword;

        if(email !== "" && password !== "") {
            if(re.test(email)) {
                if(authState.mode === "Login") {
                    props.tryAuth(email, password, "login");
                } else {
                    if(password === confirmPassword) {
                        props.tryAuth(email, password, "signup");
                        // props.navigation.navigate("Dashboard");
                    } else {
                        alert("Password doesn't matched!");
                    }
                }
            } else {
                alert("Invalid email!");
            }
        } else {
            alert("Input all the fields!");
        }
    }
    const switchViews = () => {
        setAuthState({
            ...authState,
            mode: authState.mode === "Login" ? "Signup" : "Login"
        })
    }

    const updateInput = (name, value) => {
        setAuthState({
            ...authState,
            inputs: {
                ...authState.inputs,
                [name]: value
            }
        })
    }

    let confirmPasswordField = null;

    if(authState.mode === "Signup") {
        confirmPasswordField = <PasswordTextBox
                                    style={styles.input} 
                                    placeholderValue="Confirm password"
                                    value={authState.inputs.confirmPassword}
                                    name="confirmPassword"
                                    updateInput={updateInput} />
    }

    return (
        <View style={styles.loginView}>
            <TouchableOpacity
                onPress={switchViews}
                style={{...styles.btnContainer, backgroundColor: "#1167b1", width: "85%"}}>
                <Text style={styles.btnStyle}>{authState.mode === "Login" ? "Switch to signup" : "Switch to login"}</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Your email address"
                value={authState.inputs.email}
                textContentType="emailAddress"
                onChangeText={value => updateInput("email", value)} />
            
            <PasswordTextBox
                style={styles.input} 
                placeholderValue="Password"
                value={authState.inputs.password}
                name="password"
                updateInput={updateInput} />
            
            {confirmPasswordField}

            <TouchableOpacity style={styles.btnContainer} onPress={handleAuth}>
                <Text style={styles.btnStyle}>{authState.mode === "Login" ? "Login" : "Signup"}</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    loginView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#ff7961"
    },
    input: {
        width: "85%",
        padding: 5,
        marginVertical: 20,
        backgroundColor: "#eee",
        borderWidth: 1,
        borderColor: "#009688",
        borderRadius: 4
    },
    btnStyle: {
        fontSize: 15,
        color: "#fff",
        alignSelf: "center"
    },
    btnContainer: {
        flexDirection: "row",
        width: 150,
        paddingVertical: 10,
        backgroundColor: "#009688",
        borderRadius: 5,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);