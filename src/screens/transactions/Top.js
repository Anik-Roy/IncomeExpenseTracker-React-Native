import React, { useState, useEffect } from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { Avatar, Button, Divider, Card, Title, Paragraph, Modal, Portal, Provider } from 'react-native-paper';
import { connect, useSelector, useDispatch } from "react-redux";
import DateTimePicker from '@react-native-community/datetimepicker';
import MonthYearPicker from '../../components/MonthYearPicker';
import filtericon from '../../images/filter.png';

const mapStateToProps = state => {
    return {
        authUserInfo: state.authReducer,
        transactions: state.transactionsReducer.transactions
    }
}

const LeftContent = props => <Avatar.Icon {...props} size={50} icon="account-circle" />

const Top = props => {
    
    // const { transactions } = useSelector((state) => state.transactionsReducer);
    // const [date, setDate] = useState(new Date());

    let selectedMonth = props.date.getMonth();
    let selectedYear = props.date.getUTCFullYear();

    const filtered_transactions = props.filteredTransactions.filter(item => {
        const entryDate = new Date(item.date);
        let entryMonth = entryDate.getMonth();
        let entryYear = entryDate.getUTCFullYear();
        // console.log("entry month > ", entryMonth);
        // console.log("entry year > ", entryYear);
        
        if(selectedMonth === entryMonth && selectedYear === entryYear) {
            return true;
        }
        return false;
    });

    const prices = filtered_transactions.map(transaction => transaction.price);

    // console.log(prices);
    const balance = prices.reduce((prev, current) => prev += current, 0);
    const expenses = prices.filter(price => price < 0)
                           .reduce((prev, current) => prev += current, 0) * -1;

    const income = expenses + balance;

    return (
       <Card>
            <Title style={styles.cardTitle}>Account name: {props.account.account}</Title>
            {/* <Card.Title style={styles.cardTitle} title={props.authUserInfo.email} subtitle={props.account.account} left={LeftContent} /> */}
            <View style={{display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginLeft: 10, marginBottom: 10}}>
                {(props.startDate === null || props.endDate === null) && <TouchableOpacity onPress={props.setFilterModalVisible}>
                    <Image style={styles.filtericonStyle} source={filtericon} />
                </TouchableOpacity>}
                {(props.startDate !== null && props.endDate !== null) && <TouchableOpacity onPress={props.clearFilter}>
                    <Button sm mode="outlined">Clear filter</Button>
                </TouchableOpacity>}
            </View>
            <View>
                <MonthYearPicker style={{paddingLeft: 0, paddingRight: 0}} date={props.date} onChange={props.onChange} />
            </View>
            <Card.Content style={styles.cardContent}>
                <View>
                    <Title>Income</Title>
                    <Paragraph style={{color: "green"}}>{income} TK</Paragraph>
                </View>
                <Divider inset={false} style={styles.dividerStyle}/>
                <View>
                    <Title>Expenses</Title>
                    <Paragraph style={{color: "red"}}>{expenses} TK</Paragraph>
                </View>
                <Divider style={styles.dividerStyle}/>
                <View>
                    <Title>Balance</Title>
                    <Paragraph>{balance} TK</Paragraph>
                </View>
            </Card.Content>
       </Card> 
    )
}

const styles = StyleSheet.create({
    cardTitle: {
        backgroundColor: "#ffffe4",
        padding: 10
    },
    cardContent: {
        width: "100%",
        backgroundColor: "#ffffe4",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    dividerStyle: {
        width: 5,
        height: "100%"
    },
    filtericonStyle: {
        width: 30,
        height: 30,
        marginHorizontal: 20,
        marginVertical: 10
    },
    clearFilterStyle: {
        width: 30,
        height: 30,
        marginHorizontal: 20,
        marginVertical: 10
    } 
})

export default connect(mapStateToProps)(Top);