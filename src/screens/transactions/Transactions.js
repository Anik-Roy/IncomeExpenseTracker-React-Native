import React, { useState, useEffect } from 'react';
import { View, Image, SectionList, StyleSheet } from 'react-native';
import {Title, TextInput, Button, RadioButton, Paragraph, Dialog, Modal, Portal, Text, Provider, FAB} from 'react-native-paper';
import { connect, useSelector } from 'react-redux';
import Top from './Top';
import Expense from './Expense';
import { rangeFilter } from './RangeFilter';
import { fetchTransaction, updateTransaction, deleteTransaction } from '../../redux/transactionActionCreators';
import moment from 'moment';
import format from 'date-fns/format';
import DateTimePicker from '@react-native-community/datetimepicker';

const mapStateToProps = state => {
    return {
        transactions: state.transactionsReducer.transactions,
        hasError: state.transactionsReducer.hasError
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTransaction: accountId => dispatch(fetchTransaction(accountId)),
        updateTransaction: item => dispatch(updateTransaction(item)),
        deleteTransaction: item => dispatch(deleteTransaction(item))
    }
}

const Transactions = props => {
    // console.log("----------------------------------------------------");
    // console.log("-------------Transactions.js > ", props.transactions);
    // console.log("----------------------------------------------------");
    const [visible, setVisible] = useState(false);
    const [itemToBeDeleted, setItemToBeDeleted] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [ selectedItem, setSelectedItem ] = useState(null);
    const [ checked, setChecked ] = useState("first");
    const [ title, setTitle ] = useState("");
    const [ amount, setAmount ] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [DATA, setDATA] = useState([]);
    const [date, setDate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startClicked, setStartClicked] = useState(false);
    const [endClicked, setEndClicked] = useState(false);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const {item} = props.route.params;
    console.log("account name > ", item.account, "account id > ", item.id);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);
    const hideFilterModal = () => setFilterModalVisible(false);
    
    useEffect(() => {
        props.fetchTransaction(item.id);
    }, []);

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const onStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShow(Platform.OS === 'ios');
        setStartDate(currentDate);
        console.log("current date > ", currentDate.toLocaleTimeString());
    };

    const onEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShow(Platform.OS === 'ios');
        setEndDate(currentDate);
        console.log("end date > ", currentDate.toLocaleTimeString());
    };

    const clearFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setStartClicked(false);
        setEndClicked(false);
    }

    // let DATA = Object.values(
    //     props.transactions.reduce((acc, item) => {
    //         if (!acc[item.addedtime]) {
    //             acc[item.addedtime] = {
    //                 title: item.addedtime,
    //                 data: [],
    //                 price: item.price,
    //             };
    //         }
    //         acc[item.addedtime].data.push(item);
    //         return acc;
    //     }, {}));

    useEffect(() => {
        if(startDate === null || endDate === null) {
            let selectedMonth = date.getMonth();
            let selectedYear = date.getUTCFullYear();
            
            let filtered_transactions = props.transactions.filter(item => {
                const entryDate = new Date(item.date);
                let entryMonth = entryDate.getMonth();
                let entryYear = entryDate.getUTCFullYear();
                
                if(selectedMonth === entryMonth && selectedYear === entryYear) {
                    return true;
                }
                return false;
            });

            setFilteredTransactions(filtered_transactions);

            setDATA(Object.values(
                filtered_transactions.reduce((acc, item) => {
                    if (!acc[item.addedtime]) {
                        acc[item.addedtime] = {
                            title: item.addedtime,
                            data: [],
                            price: item.price,
                        };
                    }
                    acc[item.addedtime].data.push(item);
                    return acc;
                }, {})
            ));
            return;
        } else {

            let sDate = new Date(startDate);
            let eDate = new Date(endDate);

            if(sDate > eDate) {
                alert('Invalid date range!');
            } else {
                let filtered_transactions = props.transactions.filter(item => {
                    const entryDate = new Date(item.date);
                    console.log(sDate, eDate, entryDate);
                    if(rangeFilter(sDate, eDate, entryDate)) {
                        console.log('range filter true > ', sDate, eDate, entryDate);
                        return true;
                    }
                    console.log('range filter false > ', sDate, eDate, entryDate);
                    return false;
                });
        
                setFilteredTransactions(filtered_transactions);

                setDATA(Object.values(
                    filtered_transactions.reduce((acc, item) => {
                        if (!acc[item.date]) {
                            acc[item.date] = {
                                title: item.date,
                                data: [],
                                price: item.price,
                            };
                        }
                        acc[item.date].data.push(item);
                        return acc;
                    }, {})
                ));
            }
        }
    }, [props.transactions, date, startDate, endDate]);

    // useEffect(() => {
    //     let selectedMonth = date.getMonth();
    //     let selectedYear = date.getUTCFullYear();
        
    //     let filtered_transactions = props.transactions.filter(item => {
    //         const entryDate = new Date(item.date);
    //         let entryMonth = entryDate.getMonth();
    //         let entryYear = entryDate.getUTCFullYear();
            
    //         if(selectedMonth === entryMonth && selectedYear === entryYear) {
    //             return true;
    //         }
    //         return false;
    //     });

    //     // console.log("filtered transactions > ", filtered_transactions);

    //     setFilteredTransactions(filtered_transactions);

    //     setDATA(Object.values(
    //         filtered_transactions.reduce((acc, item) => {
    //             if (!acc[item.addedtime]) {
    //                 acc[item.addedtime] = {
    //                     title: item.addedtime,
    //                     data: [],
    //                     price: item.price,
    //                 };
    //             }
    //             acc[item.addedtime].data.push(item);
    //             return acc;
    //         }, {})
    //     ));
    // }, [props.transactions, date]);

    const updateTheItem = () => {
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
            props.updateTransaction({
                ...selectedItem,
                title: title,
                price: inputAmount
            });
            setModalVisible(false);
            // props.navigation.pop();
        }

        // console.log("amount > ", inputAmount);
    }

    const deleteItem = item => {
        setVisible(true);
        setItemToBeDeleted(item);
        // alert(item.price)
    }

    const deleteItemConfirmed = async () => {
        try {
            console.log("itemToBeDeleted > ",itemToBeDeleted);
            if(itemToBeDeleted === null) {
                alert("No item selected!");
                console.log(props);
            } else {
                props.deleteTransaction(itemToBeDeleted);
            }
            return true;
        } catch(error) {
            return false;
        }
    }

    return (
        <View style={styles.container}>
            <Top account={item} date={date} startDate={startDate} endDate={endDate} clearFilter={clearFilter} filteredTransactions={filteredTransactions} setFilterModalVisible={() => setFilterModalVisible(true)} onChange={date => setDate(date)} />
            <SectionList
                sections={DATA}
                renderItem={({item}) => {
                    const index = item.id;
                    return <Expense
                                onTap={() => {
                                    setModalVisible(true);
                                    setSelectedItem(item);
                                    setTitle(item.title);
                                    setAmount(item.price.toString());
                                }}
                                item={item}
                                deleteItem={() => deleteItem(item)} />
                }}
                renderSectionHeader={({section}) => <Title style={styles.sectionHeader}>{new Date(section.title).toDateString()}</Title>}
                keyExtractor={(item, index) => index} />
            <FAB small onPress={() => props.navigation.navigate("Add", {account: item})}  icon="plus" style={styles.fab} />
            <Portal>
                <Dialog visible={visible} onDismiss={()=>setVisible(false)}>
                <Dialog.Title>Warning</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Are you sure to delete this transaction record?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            console.log('Cancel');
                            setVisible(false);
                        }}>Cancel</Button>
                        <Button onPress={() => {
                            deleteItemConfirmed()
                            .then(response => {
                                if(response) {
                                    console.log("successfull!");
                                    setVisible(false);
                                } else {
                                    console.log("unsuccessfull!");
                                    setVisible(false);
                                    alert("An error occured!");
                                }
                            });
                            
                        }}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalStyle}>
                    <Title>Update transaction &gt; {selectedItem && selectedItem.title}</Title>
                    <View style={styles.modalContainer}>
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
                        <Button style={{marginTop: 10}} mode="contained" onPress={() => updateTheItem()}>Update Item</Button>
                    </View>
                </Modal>
            </Portal>
            <Portal>
                <Modal visible={filterModalVisible} onDismiss={hideFilterModal} contentContainerStyle={styles.modalStyle}>
                    <Title style={{marginBottom: 20}}>Filter transaction</Title>
                    <View style={styles.modalContainer}>
                        <View style={styles.filterButtonContainer}>                            
                            <View>
                                <Button onPress={() => {setEndClicked(false); setStartClicked(true); showDatepicker()}} mode="outlined" dark>Start date</Button>
                                <Text>{startDate && format(new Date(startDate), 'dd MMMM yy')}</Text>
                            </View>
                            <View>
                                <Button  onPress={() => {setStartClicked(false); setEndClicked(true); showDatepicker()}} mode="outlined" dark>End date</Button>
                                <Text>{endDate && format(new Date(endDate), 'dd MMMM yy')}</Text>
                            </View>
                        </View>
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                display="default"
                                onChange={startClicked ? onStartDateChange : onEndDateChange}
                            />
                        )}
                        <Button style={{marginTop: 10}} mode="outlined" onPress={() => {
                            if(startDate === null || endDate === null) {
                                alert('Please select valid date range!');
                            } else {
                                hideFilterModal();
                            }
                        }}>Done</Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 22
    },
    sectionHeader: {
        paddingTop: 4,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 4,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: "#cbae82",
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 46,
        backgroundColor: "#ffffe4"
    },
    modalStyle: {
        display: "flex",
        // height: "40%",
        flexDirection: "column",
        backgroundColor: 'white',
        padding: 20,
        alignItems:"center"
    },
    fab: {
        position: 'absolute',
        marginHorizontal: 16,
        marginTop: 10,
        right: 0,
        bottom: 0,
        backgroundColor: "#ff844c"
    },
    modalContainer: {
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "space-between",
        // backgroundColor: "green"
    },
    radioContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 20
    },
    filterButtonContainer: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Transactions);