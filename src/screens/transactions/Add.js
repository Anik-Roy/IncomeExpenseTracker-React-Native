import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import { addTransaction } from '../../redux/transactionActionCreators';
import { connect } from 'react-redux';
import { useState } from 'react/cjs/react.development';
import DateTimePicker from '@react-native-community/datetimepicker';

const mapDispatchToProps = dispatch => {
    return {
        addTransaction: item => dispatch(addTransaction(item))
    }
}

const Add = props => {
    console.log(props);
    const [ checked, setChecked ] = useState("first");
    const [ title, setTitle ] = useState("");
    const [ amount, setAmount ] = useState("");
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const {account} = props.route.params;

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log("local time > ", currentDate.toLocaleTimeString());
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const addTheItem = () => {
        let inputAmount = parseFloat(amount);
        if(title === "") {
            alert("Please enter a title!")
        } else if(isNaN(inputAmount) || inputAmount === 0) {
            alert("Please enter a valid amount!");
        } else {
            // { addedtime: 1576590342000, id: 2, title: "Amala Soup", price: -40 },
            if(checked === 'second') {
                inputAmount = amount * -1;
            }
            props.addTransaction({
                title: title,
                price: inputAmount,
                date: date,
                accountId: account.id
            });
            props.navigation.pop();
        }

        // console.log("amount > ", inputAmount);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.radioContainer}>
                <View>
                    <Text>Income</Text>
                    <RadioButton
                        color="green"
                        value="Income"
                        status={checked === "first" ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('first')} />
                </View>
                
                <View>
                    <Text>Expense</Text>
                    <RadioButton
                        color="red"
                        value="Expense"
                        status={checked === "second" ? "checked" : "unchecked"}
                        onPress={()=>setChecked('second')}/>
                </View>
            </View>
            <View>
                <Button style={{width: 300, paddingHorizontal: 20}} onPress={showDatepicker} mode="outlined" dark>Select date</Button>
                <Text style={{marginTop: 20, fontSize: 20, fontWeight: 'bold'}}>Selected date: {date.toLocaleDateString()}</Text>
            </View>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
            <TextInput
                style={{width: "85%", marginVertical: 20}}
                mode="outlined"
                label="Enter Type of transaction"
                value={title}
                onChangeText={value => setTitle(value)} />

            <TextInput
                style={{width: "85%", marginVertical: 20}}
                mode="outlined"
                keyboardType="numeric"
                label="Enter amount"
                value={amount}
                onChangeText={value => {
                    if(!isNaN(value)) {
                        setAmount(value);
                    } else {
                        alert("Please enter a number!");
                    }
                }}/>
            <Button style={{marginTop: 10}} mode="contained" onPress={() => addTheItem()}>Add Item</Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "flex-start"
    },
    radioContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 20
    }
});

export default connect(null, mapDispatchToProps)(Add);