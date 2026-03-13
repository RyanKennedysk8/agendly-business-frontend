import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { a, l, td } from '@constants/responsive';
import { Colors } from '@colors/color';
import { fonts } from '@assets/fonts/fonts';

type StoreSearchHeaderProps = {
  onBack: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  lojaNome: string;
  onClear: () => void;
  categories?: { id: string; name: string }[];
  activeCategoryId?: string | null;
  onPressCategory?: (index: number) => void;
};

export const StoreSearchHeader = ({ onBack, searchTerm, setSearchTerm, lojaNome, onClear }: StoreSearchHeaderProps) => {
  const insets = useSafeAreaInsets();
  
  return(
    <View style={[styles.searchHeader, { height: a(50) + insets.top }]}>
      <View style={styles.textInput}>
        <Ionicons name="search" size={td(14)} color="#aaa" />
        <TextInput 
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder={`Buscar em ${lojaNome}...`}
          placeholderTextColor={Colors.placeholder}
          autoFocus
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Ionicons name="close-circle" size={td(20)} color="#aaa" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
        <Text style={styles.txtCancelSearch}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: Colors.white, 
    paddingHorizontal: l(10),
    paddingBottom: td(10)
  },
  textInput: { 
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: td(8),
    paddingLeft: l(5),
    paddingRight: l(5),
    backgroundColor: '#f5f5f5',
    height: a(35),
    flex: 1, 
  },
  searchInput: {
    flex: 1,
    fontSize: td(13),
    paddingLeft: l(5),
    fontFamily: fonts.robotoRegular,
    color: Colors.corText, 
  },
  clearIcon: {
    marginLeft: l(5),
  },
  cancelButton: {
    height: a(35),
    paddingLeft: l(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtCancelSearch: {
    fontSize: td(12),
    fontFamily: fonts.robotoBold,
    color: Colors.corText,
  }
});