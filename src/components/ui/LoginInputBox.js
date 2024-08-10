import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

function LoginInputBox({ title, text, value, onChangeText, ...props}) {
    return (
        <View>
            <Text style={styles.innerText}>{title}</Text>
            <TextInput
                placeholder={text}
                placeholderTextColor='#25A4FF'
                value={value}
                onChangeText={onChangeText}
                textAlign='center'
                style={styles.textInput}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    innerText: {
        color: '#25A4FF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 5,
    },
    textInput: {
        width: 300,
        height: 45,
        borderColor: '#25A4FF',
        borderWidth: 2,
        borderRadius: 13,
        marginBottom: 10,
        paddingLeft: 10,
        textAlign: 'left',
    },
});

export default LoginInputBox;