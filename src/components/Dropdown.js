import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const data = [
  {label: 'miles/hour (mi/h)', value: 1},
  {label: 'kilometer/hour (km/h)', value: 2},

];

const DropdownComponent = () => {
  const [value, setValue] = useState(2);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedStyle={styles.selectedTextStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        itemContainerStyle={styles.itemContainerStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.itemTextStyle}
        data={data}
        activeColor='#dee9ff'
        maxHeight={300}
        labelField="label"
        valueField="value"
        alwaysRenderSelectedItem
        placeholder={!isFocus ? 'Unit' : '...'}
        showsVerticalScrollIndicator={false}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
        
        dropdownPosition='top'
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingTop: 10,
  },
  itemContainerStyle:{
    
    backgroundColor: 'white',
  },

  dropdown: {
    height: 50,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(74, 85, 104, 0.8)',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
 
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  itemTextStyle: {
    fontSize: 14,
   

  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  
});
