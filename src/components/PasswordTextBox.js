import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const PasswordTextBox = props => {
    const [ visible, setVisible ] = useState(false);

    const iconName = visible ? "eye-outline" : "eye-off-outline"

    return (
        <View style={{...props.style, flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 5, marginVertical: 10, backgroundColor: "#eee", borderWidth: 1, borderColor: "#009688", borderRadius: 4}}>
            <TextInput
                placeholder={props.placeholderValue}
                value={props.value}
                secureTextEntry={!visible}
                textContentType="password"
                style={{flex: 1, flexDirection: "row"}}
                onChangeText={value => props.updateInput(props.name, value)} />
            <Ionicons
                onPress={()=>setVisible(!visible)}
                name={iconName}
                size={18} />
        </View>
    )
}

export default PasswordTextBox;