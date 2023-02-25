import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';

const apiEndpoint =
  'https://eqfsaekh46.execute-api.ap-south-1.amazonaws.com/Dev/lock';

export default function App() {
  const [lockId, setLockId] = useState('');
  const [actualLockState, setActualLockState] = useState('');
  const [desiredLockState, setDesiredLockState] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getLockInfo = () => {
    setLoading(true);
    fetch(`${apiEndpoint}?LockID=${lockId}`)
      .then((response) => response.json())
      .then((data) => {
        setActualLockState(data.ActualLockState);
        setDesiredLockState(data.DesiredLockState);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const updateLockState = (newState) => {
    setLoading(true);
    fetch(`${apiEndpoint}`, {
      method: 'POST',
      body: JSON.stringify({
        LockID: lockId,
        DesiredLockState: newState,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDesiredLockState(newState);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const refreshLockInfo = () => {
    setRefreshing(true);
    fetch(`${apiEndpoint}?LockID=${lockId}`)
      .then((response) => response.json())
      .then((data) => {
        setActualLockState(data.ActualLockState);
        setDesiredLockState(data.DesiredLockState);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    refreshLockInfo();
  }, []);

  return (
    <View style={styles.container}>
      {!actualLockState || !desiredLockState ? (
        <View style={styles.containerGetStatus}>
          <TextInput
            style={styles.input}
            placeholder="Enter lock ID"
            onChangeText={setLockId}
            value={lockId}
          />
          <Button
            style={styles.button}
            title="Get Status"
            onPress={getLockInfo}
            disabled={!lockId}
          />
        </View>
      ) : (
        <View>
          <Button
            style={styles.button}
            title="Refresh"
            onPress={refreshLockInfo}
            disabled={refreshing}
          />
          <Text style={styles.text}>Current state: {actualLockState}</Text>
          <Text style={styles.text}>Desired state: {desiredLockState}</Text>
          <Button
            style={[styles.button, { marginBottom: 10, marginRight: 10 }]}
            title={desiredLockState === 'lock' ? 'Unlock' : 'Lock'}
            onPress={() =>
              updateLockState(desiredLockState === 'lock' ? 'unlock' : 'lock')
            }
            disabled={loading}
          />

          <Text>
            {loading && <Text style={styles.text}>Updating lock state...</Text>}
            {refreshing && <Text style={styles.text}> Refreshing...</Text>}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  containerGetStatus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
  },
  button: {
    justifyContent: 'center',
    padding: 8,
    margin: 10,
    width: 200,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    margin: 10,
  },
});
