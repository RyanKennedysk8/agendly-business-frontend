import React from 'react';
import { View, Text, TouchableOpacity, TextInput, NativeSyntheticEvent, TextInputSubmitEditingEventData, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { l, td, a } from '@constants/responsive';
import { Colors } from '@colors/color';
import { fonts } from '@assets/fonts/fonts';

type SearchHeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onPressLocation: () => void; 
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  onClear: () => void;
  onCancel: () => void;
  onSearch: boolean;
  address: string;
};

export const SearchHeader = ({
  searchQuery, setSearchQuery, onPressLocation, onFocus, onBlur,
  onSubmit, onClear, onCancel, address, onSearch
}: SearchHeaderProps) => {

  return (
    <View style={onSearch ? styles.containerOnSearch : styles.containerSearch}>
      <View style={styles.searchRow}> 
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={td(18)} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar lojas ou serviços..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={onFocus}
            onBlur={onBlur}
            onSubmitEditing={onSubmit}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={onClear}>
              <Ionicons name="close-circle" size={td(20)} color="#aaa" style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
        
        {onSearch && (
          <View style={{ marginLeft: l(10) }}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {!onSearch && (
        <View style={styles.locationButtonContainer}>
          <TouchableOpacity onPress={onPressLocation} style={styles.locationButton}>
            <Ionicons name='location-outline' size={td(14)} color={Colors.corScreen}/>
            <Text style={styles.textLocationButton} numberOfLines={1}>{address}</Text>
            <Ionicons name='chevron-down' size={td(14)} color={Colors.corScreen}/>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerSearch: {
    backgroundColor: Colors.corContainer, 
    height: a(80),
  },
  containerOnSearch: {
    backgroundColor: Colors.corContainer, 
    height: a(55),
  },
  searchRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: l(10), 
    height: a(55)
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(10),
    borderRadius: td(20),
    backgroundColor: '#fff',
    height: a(35), 
    borderWidth: td(0.5),
    borderColor: Colors.border,
    flex: 1, 
  },
  searchIcon: { 
    marginRight: l(10) 
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
  cancelButtonText: {
    color: Colors.corText,
    fontSize: td(12),
    fontFamily: fonts.robotoMedium,
    paddingRight: l(5)
  },
  locationButtonContainer: {
    backgroundColor: Colors.white,
    height: a(25),
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: Colors.border,
    borderBottomWidth: 1
  },
  locationButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: td(7)
  },
  textLocationButton: {
    color: Colors.corText,
    fontSize: td(12),
    fontFamily: fonts.robotoRegular,
  }
});