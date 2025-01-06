import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt'; // Import MQTT.js
import './MonitoringUi.css';

const MonitoringUI = () => {
  const [temperature, setTemperature] = useState(''); // State for Temperature
  const [humidity, setHumidity] = useState(''); // State for Humidity
  const [soilMoisture, setSoilMoisture] = useState(''); // State for Soil Moisture

  useEffect(() => {
    // Connect to the MQTT broker via WebSocket
    const client = mqtt.connect('wss://broker.mqttgo.io:8084/mqtt');

    // When connected
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Subscribe to the three topics
      client.subscribe('Temperature');
      client.subscribe('Humidity');
      client.subscribe('SoilMoisture');
    });

    // When a message is received
    client.on('message', (topic, message) => {
      const payload = message.toString(); // Convert message to string
      console.log(`Received message on topic ${topic}: ${payload}`);

      // Update state based on the topic
      if (topic === 'Temperature') {
        setTemperature(payload);
      } else if (topic === 'Humidity') {
        setHumidity(payload);
      } else if (topic === 'SoilMoisture') {
        setSoilMoisture(payload);
      }
    });

    // Cleanup function to disconnect the client when the component unmounts
    return () => {
      client.end();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className='start-page'>
      <h1>Sensor Monitoring Dashboard</h1>
      <div className='sensor-data'>
        <p><strong>Temperature:</strong> {temperature || 'Waiting for data...'}</p>
        <p><strong>Humidity:</strong> {humidity || 'Waiting for data...'}</p>
        <p><strong>Soil Moisture:</strong> {soilMoisture || 'Waiting for data...'}</p>
      </div>
    </div>
  );
};

export default MonitoringUI;
