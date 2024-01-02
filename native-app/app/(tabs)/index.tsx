import {Alert, Button, Platform, StyleSheet} from 'react-native';
import {Text, View} from '../../components/Themed';
import {Link, router, useFocusEffect} from 'expo-router';
import axios from 'axios';
import {useMachineData} from '../useMachineData';
import {useCallback, useContext, useState} from 'react';
import {PartsOfMachine} from '../../components/PartsOfMachine';
import {MachineScore} from '../../components/MachineScore';
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTION_API_ENDPOINT } from '../../constants/urls';

let apiUrl: string = `${PRODUCTION_API_ENDPOINT}/api/machine-health`;

if (__DEV__) {
  apiUrl = `http://${Platform.select({ android: '10.0.2.2', ios: 'localhost' })}:3001/api/machine-health`;
}

export default function StateScreen() {
  const {machineData, resetMachineData, loadMachineData, setScores} =
    useMachineData();

  //Doing this because we're not using central state like redux
  useFocusEffect(
    useCallback(() => {
      loadMachineData();
    }, []),
  );

  const {
    token,
    setToken,
    setUsername,
  } = useContext(UserContext);

  const calculateHealth = useCallback(async () => {
    try {
      const response = await axios.post(apiUrl, {
        machines: machineData?.machines,
      }, {
        headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
      });

      if (response.data?.factory) {
        setScores(response.data);
      }
    } catch (error) {
      if (error?.response?.status !== 200) {
        Alert.alert('Something went wrong!', error?.response?.data?.error, [
          {
            text: 'Ignore',
            style: 'cancel',
          },
          {
            text: 'Login',
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
    }
  }, [machineData]);

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      {!machineData && (
        <Link href='/two' style={styles.link}>
          <Text style={styles.linkText}>
            Please log a part to check machine health
          </Text>
        </Link>
      )}
      {machineData && (
        <>
          <PartsOfMachine
            machineName={'Welding Robot'}
            parts={machineData?.machines?.weldingRobot}
          />
          <PartsOfMachine
            machineName={'Assembly Line'}
            parts={machineData?.machines?.assemblyLine}
          />
          <PartsOfMachine
            machineName={'Painting Station'}
            parts={machineData?.machines?.paintingStation}
          />
          <PartsOfMachine
            machineName={'Quality Control Station'}
            parts={machineData?.machines?.qualityControlStation}
          />
          <View
            style={styles.separator}
            lightColor='#eee'
            darkColor='rgba(255,255,255,0.1)'
          />
          <Text style={styles.title}>Factory Health Score</Text>
          <Text style={styles.text}>
            {machineData?.scores?.factory
              ? machineData?.scores?.factory
              : 'Not yet calculated'}
          </Text>
          {machineData?.scores?.machineScores && (
            <>
              <Text style={styles.title2}>Machine Health Scores</Text>
              {Object.keys(machineData?.scores?.machineScores).map((key) => (
                <MachineScore
                  key={key}
                  machineName={key}
                  score={machineData?.scores?.machineScores[key]}
                />
              ))}
            </>
          )}
        </>
      )}
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <Button title='Calculate Health' onPress={calculateHealth} />
      <View style={styles.resetButton}>
        <Button
          title='Reset Machine Data'
          onPress={async () => await resetMachineData()}
          color='#FF0000'
        />
      </View>
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
  title2: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  text: {},
  link: {
    paddingBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  resetButton: {
    marginTop: 10,
  },
});
