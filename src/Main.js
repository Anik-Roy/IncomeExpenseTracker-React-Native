import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// navigation components
import { NavigationContainer, useNavigation} from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
// import { navigationRef, navigate } from './NavigationRoot';

// redux
import store from './redux/store';
import { tryAuthFromPersistantStorage, tryLogout } from './redux/authActionCreators';
import { connect } from 'react-redux';



// screen components
import LoginScreen from './screens/LoginScreen';
import AddCategoryScreen from './screens/accounts/AddCategoryScreen';
import Transactions from './screens/transactions/Transactions';
import OnBoarding from './screens/transactions/OnBoarding';
import Add from './screens/transactions/Add';
import SplashScreen from './screens/SplashScreen';

// icon components
import Icon from "./components/Icon";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const mapStateToProps = state => {
    // console.log("Main.js > state > ", state);
    return {
        idToken: state.authReducer.idToken,
        isAuthUserLoading: state.authReducer.isAuthUserLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        tryAuthFromPersistantStorage: () => dispatch(tryAuthFromPersistantStorage())
    }
}

const DashboardStack = () => {
    const navigation = useNavigation();
    return (
        <Stack.Navigator
            initialRouteName="AddCategory"
            screenOptions={({route}) => ({
                headerStyle: {
                    backgroundColor: "#f44336",
                },
                headerTintColor: "#0000b4",
                headerTitleStyle: {
                    color: "#fff",
                    fontWeight: "500",
                    fontSize: 18
                }
            })}>
                <Stack.Screen
                    name="AddCategory"
                    component={AddCategoryScreen}
                    options={({route}) => ({
                        headerLeft: () => (
                            <Icon action={()=>navigation.toggleDrawer()} name="ios-menu" color="black" size={28} iconStyle={{paddingLeft: 15}} />
                        ),
                        title: "Accounts",
                        headerRight: () => (
                            <TouchableOpacity onPress={() => {
                                store.dispatch(tryLogout());
                            }}>
                                <AntDesign name="poweroff" size={26} style={{paddingRight: 10}} />
                            </TouchableOpacity>
                        )
                })} />
                <Stack.Screen
                    name="Transactions"
                    component={Transactions}
                    options={{
                        title: "Transaction Summary",
                        headerRight: () => (
                            <TouchableOpacity onPress={() => {
                                store.dispatch(tryLogout());
                            }}>
                                <AntDesign name="poweroff" size={26} style={{paddingRight: 10}} />
                            </TouchableOpacity>
                        )
                }} />
                <Stack.Screen
                    name="Add"
                    component={Add}
                    options={{
                        title: "Add a transaction"
                    }}/>
        </Stack.Navigator>
    )
}

const Main = props => {
  useEffect(() => {
    props.tryAuthFromPersistantStorage();
  }, []);

  if(props.isAuthUserLoading) {
      return (
          <SplashScreen />
      )
  } else {
      if(props.idToken === null) {
          return (
              <LoginScreen />
          )
      } else {
            return (
                <NavigationContainer>
                    <Drawer.Navigator
                        initialRouteName="Dashboard">
                            <Drawer.Screen
                                name="Dashboard"
                                component={DashboardStack} />
                    </Drawer.Navigator>
                </NavigationContainer>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
