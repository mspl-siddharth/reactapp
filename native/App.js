import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'http://192.168.10.133:3000' }}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        onMessage={event => {
          const user = JSON.parse(event.nativeEvent.data);
          console.log(user);
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
