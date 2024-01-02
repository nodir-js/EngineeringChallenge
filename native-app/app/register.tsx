import {StatusBar} from 'expo-status-bar';
import {ActivityIndicator, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

import {Text, View} from '../components/Themed';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { PRODUCTION_API_ENDPOINT } from '../constants/urls';

let apiUrl: string = `${PRODUCTION_API_ENDPOINT}/api`;

if (__DEV__) {
  apiUrl = `http://${Platform.select({ android: '10.0.2.2', ios: 'localhost' })}:3001/api`;
}

export default function RegisterScreen() {
	const [loading, setLoading] = useState(false);
	const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const register = async () => {
		try {
			setError('')
			setLoading(true);
			await axios.post(apiUrl + '/auth/register', {
				username,
				password,
			}, {
				headers: {
					'Content-Type': 'application/json',
				}
			});

			router.replace('/login');

		} catch (error) {
			setError(error?.response?.data?.error)
		} finally {
			setLoading(false);
		}
	}

	const logIn = () => {
		router.replace('/login');
	}

  return (
		<SafeAreaView style={{ flex: 1}}>
			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
			<View style={styles.container}>
				<ScrollView
					contentContainerStyle={{
						alignItems: 'center',
						justifyContent: 'center',
					}}
					style={{ flex: 1 }}
				>
					<Text style={styles.title}>Register Screen</Text>
					<View style={styles.form}>
						<Text style={styles.label}>Username</Text>
						<TextInput
							style={styles.input}
							value={username}
							onChangeText={setUsernameInput}
							placeholder="Enter your username"
							autoCapitalize='none'
						/>

						<Text style={styles.label}>Password</Text>
						<TextInput
							style={styles.input}
							value={password}
							onChangeText={setPassword}
							placeholder="Enter your password"
							secureTextEntry
						/>

						{error && <Text style={styles.errorText}>{error}</Text>}
					</View>


					<TouchableOpacity style={styles.button} onPress={register} disabled={loading}>
						{loading ? <ActivityIndicator size={'small'} color={'#fff'} /> :  <Text style={styles.text}>Register</Text>}
					</TouchableOpacity>

					<Text style={styles.orText}>OR</Text>

					<TouchableOpacity style={styles.buttonSecondary} onPress={logIn} disabled={loading}>
						<Text style={styles.textSecondary}>Log in</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
		marginVertical: 50,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
	button: {
		marginTop: 20,
		alignSelf: 'stretch',
		marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4d4dff',
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    elevation: 5, // for Android shadow
  },
	buttonSecondary: {
		marginTop: 20,
		alignSelf: 'stretch',
		marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    elevation: 5, // for Android shadow
	},
	textSecondary: {
		color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
	},
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
	label: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    height: 40,
		width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
		borderRadius: 5,
  },
	form: {
		paddingHorizontal: 20,
		width: '100%',
	},
	orText: {
		marginTop: 20,
	},
	errorText: {
		color: '#f00',
	}
});
