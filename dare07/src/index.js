import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },

  welcome: {
    fontsize: 20,
    textAlign: 'center',
    margin: 10
  }
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Step One</Text>
      <Text style={styles.welcome}>Teste</Text>
    </View>
  );
}
