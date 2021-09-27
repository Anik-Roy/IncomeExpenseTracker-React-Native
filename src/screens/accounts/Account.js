import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Icon from "../../components/Icon";

const Account = props => {
    return (
        <View style={styles.root}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => props.transactions()}>
                    <Text style={{flex: 1, fontSize: 15}}>
                        {props.item.account}
                    </Text>
                </TouchableWithoutFeedback>
                <View style={styles.icon}>
                    <Icon action={()=>props.editItem()} name="create" color="black" size={28} iconStyle={{paddingLeft: 15}} />
                    <Icon action={()=>props.deleteItem()} name="trash" color="black" size={28} iconStyle={{paddingLeft: 15}} />
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#ddd",
        padding: 10
    },
    icon: {
        display: "flex",
        flexDirection: "row"
    }
})
export default Account;