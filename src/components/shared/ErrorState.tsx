import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { a, l, td } from '@constants/responsive';
import { Colors } from '@colors/color';

type ErrorStateProps = {
    message?: string;
    buttonText?: string;
    onRetry?: () => void;
    showButton?: boolean;
};

export const ErrorState = ({
    message = 'Ops! Ocorreu um erro.',
    buttonText = 'Tentar novamente',
    onRetry,
    showButton = true
}: ErrorStateProps) => {

    return (
        <>
            <Stack.Screen
                options={{
                    headerType: 'simple'
                } as any}
            />

            <StatusBar barStyle="dark-content" />

            <View style={styles.container}>

                <Image
                    style={styles.errorImage}
                    source={require('@assets/images/SearchSad.png')}
                />

                <Text style={styles.errorSubText}>
                    {message}
                </Text>

                {showButton && onRetry && (
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={onRetry}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.retryButtonText}>
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                )}

            </View>
        </>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: l(24),
        backgroundColor: Colors.white
    },

    errorImage: {
        width: l(180),
        height: l(180),
        resizeMode: 'contain',
        marginBottom: a(16)
    },

    errorSubText: {
        fontSize: td(16),
        color: Colors.corTextSecondary,
        textAlign: 'center',
        marginBottom: a(20),
        lineHeight: td(22)
    },

    retryButton: {
        backgroundColor: Colors.corText ,
        paddingVertical: a(12),
        paddingHorizontal: l(24),
        borderRadius: td(12),
        justifyContent: 'center',
        alignItems: 'center'
    },

    retryButtonText: {
        color: '#FFF',
        fontSize: td(15),
        fontWeight: '600'
    }

});
