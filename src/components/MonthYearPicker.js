import React, {useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { addMonths, format, subMonths } from 'date-fns';

const MonthYearPicker = ({date, onChange}) => {
    const handlePrev = () => {
        const newDate = subMonths(date, 1);
        onChange(newDate);
    }

    const handleNext = () => {
        const newDate = addMonths(date, 1);
        onChange(newDate);
    }

    return (
        <View style={styles.row}>
            <IconButton icon="arrow-left" onPress={handlePrev} />
            <Text>{format(date, "MMMM yyyy")}</Text>
            <IconButton icon="arrow-right" onPress={handleNext} />
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: "#eee"
    }
});

export default MonthYearPicker;