import {Alert, StyleSheet} from 'react-native';

import {Text, View} from '../../components/Themed';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function TabThreeScreen() {
	const {
    username,
    setToken,
    setUsername,
  } = useContext(UserContext);

	const logOut = () => {
		Alert.alert("Log out", "Are you sure that you want to log out?", [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
				text: 'Yes',
				onPress: async () => {
          await AsyncStorage.setItem('user', JSON.stringify({}));
          setToken(null);
          setUsername(null);
          router.replace('/login');
        },
				style: 'destructive',
			},
    ])
	}

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
			<Text style={styles.title}>User: {username}</Text>
			<TouchableOpacity onPress={logOut} style={styles.button}>
				<Text style={styles.text}>Log out</Text>
			</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
	button: {
		marginTop: 20,
		alignSelf: 'stretch',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    elevation: 5, // for Android shadow
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
