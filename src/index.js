import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';

const Index = () => {
  const video = useRef(null);
  const navigation = useNavigation();

  

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={{
          uri: "https://cdn.pixabay.com/video/2021/04/19/71569-538974129_tiny.mp4"
        }}
        style={styles.video}
        resizeMode="cover"
        repeat
        muted={true}
        onBuffer={() => {}}
        onError={(e) => console.log(e)}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>DHARVEE Ecommerce</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() =>navigation.navigate('login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('register')}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'gold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Index;
