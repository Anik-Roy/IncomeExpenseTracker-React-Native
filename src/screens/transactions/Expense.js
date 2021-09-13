import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from '../../components/Icon';

const Expense = props => {
    return (
        <View>
            <TouchableWithoutFeedback onPress={() => props.onTap()}>
                <View style={styles.container}>
                    <Text>{props.item.title}</Text>
                    <Text style={{
                        color: props.item.price < 0 ? "red" : "green"
                    }}>{props.item.price} TK</Text>
                    <Icon
                        name="remove-circle-outline"
                        size={30}
                        color="red"
                        action={props.deleteItem} />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#cbae82"
    }
})
export default Expense;