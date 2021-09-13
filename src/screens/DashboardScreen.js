import React, { useEffect, createRef } from 'react';
import { View, Text } from 'react-native';
import { navigationRef } from '../NavigationRoot';

const mapStateToProps = state => {
    return {
        idToken: state.idToken,
        localId: state.localId,
        refreshToken: state.refreshToken
    }
}

const DashboardScreen = props => {
    // console.log(navigationRef);

    return (
        <View>
            <Text>Dashboard</Text>
        </View>
    )
}

export default DashboardScreen;