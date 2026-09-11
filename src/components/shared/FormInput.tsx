// components/shared/FormInput.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  Pressable,
} from 'react-native';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { Minus, Plus } from 'lucide-react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string | boolean;
  prefix?: string;
  suffix?: string;

  // Controle numérico
  numericControls?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export function FormInput({
  label,
  error,
  prefix,
  suffix,
  style,
  onFocus,
  onBlur,
  numericControls = false,
  min,
  max,
  step = 1,
  value,
  onChangeText,
  ...rest
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;

  const numericValue = Number(value);

  const canDecrease =
    !Number.isNaN(numericValue) &&
    (min === undefined || numericValue > min);

  const canIncrease =
    !Number.isNaN(numericValue) &&
    (max === undefined || numericValue < max);

  const updateValue = (newValue: number) => {
    let finalValue = newValue;

    if (min !== undefined) {
      finalValue = Math.max(finalValue, min);
    }

    if (max !== undefined) {
      finalValue = Math.min(finalValue, max);
    }

    onChangeText?.(String(finalValue));
  };

  const decrease = () => {
    if (!canDecrease) return;

    updateValue(numericValue - step);
  };

  const increase = () => {
    if (!canIncrease) return;

    updateValue(numericValue + step);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, hasError && styles.labelError]}>
        {label}
      </Text>

      <View
        style={[
          styles.inputContainer,
          hasError && styles.inputError,
        ]}
      >
        {prefix ? (
          <Text style={styles.prefix}>
            {prefix}
          </Text>
        ) : null}

        {numericControls && (
          <Pressable
            onPress={decrease}
            disabled={!canDecrease}
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlButtonPressed,
              !canDecrease && styles.controlButtonDisabled,
            ]}
          >
            <Minus
              size={td(17)}
              strokeWidth={2}
              color={
                canDecrease
                  ? Colors.corTextStrong
                  : Colors.corTextLight
              }
            />
          </Pressable>
        )}

        <TextInput
          {...rest}
          value={value}
          style={[
            styles.input,
            numericControls && styles.numericInput,
            style,
          ]}
          placeholderTextColor={Colors.placeholder}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onChangeText={onChangeText}
        />

        {numericControls && (
          <Pressable
            onPress={increase}
            disabled={!canIncrease}
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlButtonPressed,
              !canIncrease && styles.controlButtonDisabled,
            ]}
          >
            <Plus
              size={td(17)}
              strokeWidth={2}
              color={
                canIncrease
                  ? Colors.corTextStrong
                  : Colors.corTextLight
              }
            />
          </Pressable>
        )}

        {suffix ? (
          <Text style={styles.suffix}>
            {suffix}
          </Text>
        ) : null}
      </View>

      {typeof error === 'string' && error.length > 0 && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    fontSize: td(13),
    fontFamily: fonts?.robotoMedium || 'System',
    color: Colors.corTextStrong,
    marginBottom: a(6),
  },

  labelError: {
    color: '#EF4444',
  },

  inputContainer: {
    height: a(46),
    borderWidth: 1,
    borderColor: Colors.borderHairLine,
    borderRadius: td(10),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(8),
  },

  inputFocused: {
    borderColor: Colors.border,
    backgroundColor: Colors.corContainer,
  },

  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },

  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts?.robotoRegular || 'System',
    fontSize: td(14),
    color: Colors.corText,
    paddingHorizontal: l(6),
  },

  numericInput: {
    textAlign: 'center',
    fontFamily: fonts?.robotoMedium || 'System',
    fontSize: td(16),
  },

  controlButton: {
    width: a(34),
    height: a(34),
    borderRadius: td(9),
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlButtonPressed: {
    backgroundColor: '#E8E8E8',
    transform: [{ scale: 0.94 }],
  },

  controlButtonDisabled: {
    opacity: 0.35,
  },

  prefix: {
    fontSize: td(14),
    fontFamily: fonts?.robotoMedium,
    color: Colors.corTextLight,
    marginRight: l(6),
  },

  suffix: {
    fontSize: td(13),
    fontFamily: fonts?.robotoRegular || 'System',
    color: Colors.corTextLight,
    marginLeft: l(6),
    marginRight: l(5),
  },

  errorText: {
    fontSize: td(11),
    fontFamily: fonts?.robotoRegular || 'System',
    color: '#EF4444',
    marginTop: a(4),
  },
});