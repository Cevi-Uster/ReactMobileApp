import React from 'react';
import { Switch, View} from 'react-native';

/**
 * to be wrapped with redux-form Field component
 */
export default function CeviCheckBox(props) {
  
  const renderField = ({ input: { onChange, value } }) => {
    return (
       <View>
          <Switch 
            onValueChange={(value) => onChange(value)} 
            value={value} 
          /> 
       </View>
    );
 }; 
 
}