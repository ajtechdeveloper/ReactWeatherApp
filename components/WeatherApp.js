import { CONFIG } from './config';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, FlatList } from 'react-native-web';
import { Picker } from '@react-native-picker/picker';

const CITIES = [
  "New York,US",
  "London,GB",
  "Paris,FR",
  "Tokyo,JP",
  "Sydney,AU",
  "Moscow,RU",
  "Berlin,DE",
  "Rome,IT",
  "Madrid,ES",
  "Beijing,CN",
  "Cairo,EG",
  "Rio de Janeiro,BR",
  "Mumbai,IN",
  "Toronto,CA",
  "Seoul,KR",
  "Amsterdam,NL",
  "Singapore,SG",
  "Stockholm,SE",
  "Dubai,AE",
  "Bangkok,TH",
];

const WeatherApp = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [isCelsius, setIsCelsius] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchWeather = async () => {
    if (!selectedCity) {
      setError('Please select a city');
      return;
    }
    try {
      setError('');
      const response = await fetch(
        `${CONFIG.BASE_URL}?q=${selectedCity}&appid=${CONFIG.API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemp = (temp) => {
    if (isCelsius) return temp;
    return (temp * 9) / 5 + 32;
  };

  return (
    <div style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Weather App</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue) => setSelectedCity(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a city" value="" />
            {CITIES.map((city, index) => (
              <Picker.Item key={index} label={city} value={city} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Get Weather</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleUnit}>
          <Text style={styles.buttonText}>
            Toggle to {isCelsius ? 'Fahrenheit' : 'Celsius'}
          </Text>
        </TouchableOpacity>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : weather ? (
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherTitle}>{weather.name}</Text>
            <Text style={styles.weatherText}>
              Temperature: {convertTemp(weather.main.temp).toFixed(1)}°
              {isCelsius ? 'C' : 'F'}
            </Text>
            <Text style={styles.weatherText}>
              Feels like: {convertTemp(weather.main.feels_like).toFixed(1)}°
              {isCelsius ? 'C' : 'F'}
            </Text>
            <Text style={styles.weatherText}>
              Description: {weather.weather[0].description}
            </Text>
            <Text style={styles.weatherText}>
              Humidity: {weather.main.humidity}%
            </Text>
            <Text style={styles.weatherText}>
              Wind Speed: {weather.wind.speed} m/s
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  weatherInfo: {
    marginTop: 20,
  },
  weatherTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default WeatherApp;