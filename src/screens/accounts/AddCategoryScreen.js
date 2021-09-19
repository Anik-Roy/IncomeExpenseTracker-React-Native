import React, {useState, useEffect} from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { TextInput, Title, Paragraph, Button, Modal, Dialog, Portal, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { addAccount, updateAccount, deleteAccount, fetchAccounts } from '../../redux/accountActionCreators';
import { connect } from 'react-redux';
import Account from './Account';
import { format } from 'date-fns';

const mapStateToProps = state => {
    return {
        accounts: state.accountsReducer.accounts,
        hasError: state.transactionsReducer.hasError
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addAccount: item => dispatch(addAccount(item)),
        updateAccount: item => dispatch(updateAccount(item)),
        deleteAccount: item => dispatch(deleteAccount(item)),
        fetchAccounts: () => dispatch(fetchAccounts()),
    }
}

const AddCategoryScreen = props => {
    const [ account, setAccount ] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [updateAccountModalVisible, setUpdateAccountModalVisible] = useState(false);
    const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const [ selectedItem, setSelectedItem ] = useState(null);
    const [itemToBeDeleted, setItemToBeDeleted] = useState(null);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    useEffect(() => {
        props.fetchAccounts();
    }, []);

    const addAccount = () => {
        if(account === "") {
            alert("Please enter account name!");
        } else {
            props.addAccount({
                account
            });
            hideModal();
        }
    }

    const updateAccount = item => {
        console.log(item);
        if(account === "") {
            alert("Please enter account name!");
        } else {
            props.updateAccount(item);
            setUpdateAccountModalVisible();
        }
    }

    const deleteAccount = item => {
        setDeleteAccountModalVisible(true);
        setItemToBeDeleted(item);
    }

    const deleteItemConfirmed = async () => {
        try {
            console.log("itemToBeDeleted > ",itemToBeDeleted);
            if(itemToBeDeleted === null) {
                alert("No item selected!");
                console.log(props);
            } else {
                props.deleteAccount(itemToBeDeleted);
            }
            return true;
        } catch(error) {
            return false;
        }
    }

    // props.accounts.sort((a, b) => {
    //     const date1 = new Date(a.addedtime);
    //     const date2 = new Date(b.addedtime);
    //     return date1 < date2;
    // });

    console.log("add category screen > ", props);

    const DATA = Object.values(
        props.accounts.reduce((acc, item) => {
            if (!acc[item.addedtime]) {
                acc[item.addedtime] = {
                    title: item.addedtime,
                    data: []
                };
            }
            acc[item.addedtime].data.push(item);
            return acc;
        }, {})
    )

    return (
        <View style={styles.container}>
            <SectionList
                sections={DATA}
                renderItem={({item}) => {
                    const index = item.id;
                    return <Account
                                transactions={() => props.navigation.navigate("Transactions", {item: item})}
                                editItem={() => {
                                    setUpdateAccountModalVisible(true);
                                    setAccount(item.account);
                                    setSelectedItem(item);
                                }}
                                item={item}
                                deleteItem={() => deleteAccount(item)} />
                }}
                renderSectionHeader={({section}) => <Title style={styles.sectionHeader}>Created at: {format(new Date(section.title), "dd MMMM, yyyy")}</Title>}
                keyExtractor={(item, index) => index} />
            <FAB small onPress={() => showModal(true)}  icon="plus" style={styles.fab} />
            {/* create account */}
            <Portal>
                <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalStyle}>
                    <View style={styles.modalContainer}>
                        <TextInput
                            style={{width: "85%", marginTop: 30, marginBottom: 20}}
                            mode="outlined"
                            label="Enter account of name"
                            value={account}
                            onChangeText={value => setAccount(value)} />
                        <Icon action={hideModal} name="close" color="black" size={32} iconStyle={styles.closeIconStyle} />
                        <Button style={{marginTop: 10, marginBottom: 20}} mode="contained" onPress={() => addAccount()}>Save account</Button>
                    </View>
                </Modal>
            </Portal>
            {/* update account */}
            <Portal>
                <Modal visible={updateAccountModalVisible} onDismiss={() => setUpdateAccountModalVisible(false)} contentContainerStyle={styles.modalStyle}>
                    <Title>Update account &gt; {selectedItem && selectedItem.account}</Title>
                    <View style={styles.modalContainer}>
                        <TextInput
                            style={{width: "85%", marginVertical: 20}}
                            mode="outlined"
                            label="Enter account name"
                            value={account}
                            onChangeText={value => setAccount(value)} />

                        <Button style={{marginTop: 10}} mode="contained" onPress={() => updateAccount({...selectedItem, account})}>Update Account</Button>
                    </View>
                </Modal>
            </Portal>
            {/* delete account */}
            <Portal>
                <Dialog visible={deleteAccountModalVisible} onDismiss={()=>setDeleteAccountModalVisible(false)}>
                <Dialog.Title>Warning</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Are you sure to delete this account record?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            console.log('Cancel');
                            setDeleteAccountModalVisible(false);
                        }}>Cancel</Button>
                        <Button onPress={() => {
                            deleteItemConfirmed()
                            .then(response => {
                                if(response) {
                                    console.log("successfull!");
                                    setDeleteAccountModalVisible(false);
                                } else {
                                    console.log("unsuccessfull!");
                                    setDeleteAccountModalVisible(false);
                                    alert("An error occured!");
                                }
                            });
                            
                        }}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        // marginBottom: 22
    },
    sectionHeader: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: "#cbae82",
    },
    modalStyle: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
        margin: 20,
        alignItems:"center"
    },
    closeIconStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        // marginRight: 10
    },
    fab: {
        position: 'absolute',
        marginHorizontal: 16,
        marginBottom: 20,
        right: 0,
        bottom: 0,
        backgroundColor: "#ff844c"
    },
    modalContainer: {
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
        // justifyContent: "flex-start"
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(AddCategoryScreen);