import React, { useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Gauge from './Gauge';
import './MonitoringUI.css';
import plantLogo from '../assets/plantlogo.jpg';
import PlantRecommendation from './PlantRecommendation';

const MonitoringUI = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [client, setClient] = useState(null);
  
  

  useEffect(() => {
    const mqttClient = mqtt.connect('wss://broker.mqttgo.io:8084/mqtt', {
      clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });
  
    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Subscribe to topics
      mqttClient.subscribe('Temperature');
      mqttClient.subscribe('Humidity');
      mqttClient.subscribe('SoilMoisture');
    });
  
    mqttClient.on('message', (topic, message) => {
      const value = parseFloat(message.toString());
      switch (topic) {
        case 'Temperature':
          setTemperature(value);
          break;
        case 'Humidity':
          setHumidity(value);
          break;
        case 'SoilMoisture':
          setSoilMoisture(value);
          break;
        default:
          break;
      }
    });
  
    mqttClient.on('error', (err) => {
      console.error('MQTT connection error:', err);
    });
  
    setClient(mqttClient);
  
    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  return (
    <div className='dashboard-container'>

      
      <div className='gauges-container'>
        <div className='gauge-card'>
          <h2>Temperature</h2>
          <Gauge
            value={temperature}
            minValue={0}
            maxValue={50}
            title="Temperature"
            needleColor="#FF6B6B"
            color="#FF6B6B"
          />
          <div className='gauge-value'>{temperature.toFixed(1)}°C</div>
        </div>

        <div className='gauge-card'>
          <h2>Humidity</h2>
          <Gauge
            value={humidity}
            minValue={0}
            maxValue={100}
            title="Humidity"
            needleColor="#4ECDC4"
            color="#4ECDC4"
          />
          <div className='gauge-value'>{humidity.toFixed(1)}%</div>
        </div>

        <div className='gauge-card'>
          <h2>Soil Moisture</h2>
          <Gauge
            value={soilMoisture}
            minValue={0}
            maxValue={100}
            title="Soil Moisture"
            needleColor="#f9b603"
            color="#f9b603"
          />
          <div className='gauge-value'>{soilMoisture.toFixed(1)}%</div>
        </div>
      </div>

      <div className='recommendation-container'>
        <PlantRecommendation 
          temperature={temperature}
          humidity={humidity}
          soilMoisture={soilMoisture}
        />
      </div>
    </div>
  );
};

export default MonitoringUI;