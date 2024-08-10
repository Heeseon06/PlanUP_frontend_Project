import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Logo from '../../assets/images/logo.svg';


const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>취업공고를</Text>
      <Text style={styles.title}>불러오고 있어요!</Text>
      {/* <Image 
        source={require('../../assets/images/loading.gif')}  
        style={{width: 140, height: 140, resizeMode: 'contain', marginBottom: 10, marginTop: 20}}
      /> */}
      <Logo style={styles.logo} width={100} height={100} />
      <Text style={styles.infotext}>10초 ~ 20초 정도 소요돼요.</Text>
      <Text style={styles.infotext}>잠시만 기다려주세요!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 34,
    fontFamily: 'NanumSquareEB',
    color: 'black',
    marginBottom: 2,
  },
  infotext: {
    fontSize: 16,
    fontFamily: 'NanumSquareB',
    color: 'black',
  },
  logo: {
    alignSelf: 'center',
},
});

export default LoadingScreen;
