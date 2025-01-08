import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import Gauge from './Gauge';
import './MonitoringUI.css';
import plantLogo from '../assets/plantlogo.jpg';
import PlantRecommendation from './PlantRecommendation';

const MonitoringUI = () => {
  const [selectedSensor, setSelectedSensor] = useState(1);
  const [sensorData, setSensorData] = useState({
    1: { temperature: 0, humidity: 0, soilmoisture: 0 },
    2: { temperature: 0, humidity: 0, soilmoisture: 0 },
    3: { temperature: 0, humidity: 0, soilmoisture: 0 },
    4: { temperature: 0, humidity: 0, soilmoisture: 0 },
    5: { temperature: 0, humidity: 0, soilmoisture: 0 },
    6: { temperature: 0, humidity: 0, soilmoisture: 0 },
  });
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
      for (let i = 1; i <= 6; i++) {
        mqttClient.subscribe(`Temperature_0${i}`);
        mqttClient.subscribe(`Humidity_0${i}`);
        mqttClient.subscribe(`Soilmoisture_0${i}`);
      }
    });
  
    mqttClient.on('message', (topic, message) => {
      const value = parseFloat(message.toString());
      const [type, sensorNum] = topic.split('_');
      const sensorId = parseInt(sensorNum);
      
      setSensorData(prev => ({
        ...prev,
        [sensorId]: {
          ...prev[sensorId],
          [type.toLowerCase()]: value
        }
      }));
    });
  
    setClient(mqttClient);
  
    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const renderSidebar = () => (
    <div className="sidebar">

      <nav>
        <ul>
          {[...Array(6)].map((_, index) => (
            <li key={index + 1}>
              <button 
                className={`nav-item ${selectedSensor === index + 1 ? 'active' : ''}`}
                onClick={() => setSelectedSensor(index + 1)}
              >
                Plant_{String(index + 1).padStart(2, '0')}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="app-container">
      {renderSidebar()}
      <div className="dashboard-container">
        <div className="gauges-container">
          <div className="gauge-card">
            <h2>Temperature</h2>
            <Gauge
              value={sensorData[selectedSensor].temperature}
              minValue={0}
              maxValue={50}
              title="Temperature"
              needleColor="#FF6B6B"
              color="#FF6B6B"
            />
            <div className="gauge-value">{sensorData[selectedSensor].temperature.toFixed(1)}°C</div>
          </div>

          <div className="gauge-card">
            <h2>Humidity</h2>
            <Gauge
              value={sensorData[selectedSensor].humidity}
              minValue={0}
              maxValue={100}
              title="Humidity"
              needleColor="#4ECDC4"
              color="#4ECDC4"
            />
            <div className="gauge-value">{sensorData[selectedSensor].humidity.toFixed(1)}%</div>
          </div>

          <div className="gauge-card">
            <h2>Soil Moisture</h2>
            <Gauge
              value={sensorData[selectedSensor].soilmoisture}
              minValue={0}
              maxValue={100}
              title="Soil Moisture"
              needleColor="#f9b603"
              color="#f9b603"
            />
            <div className="gauge-value">{sensorData[selectedSensor].soilmoisture.toFixed(1)}%</div>
          </div>
        </div>

        <PlantRecommendation
          className="plant-recommendation"
          temperature={sensorData[selectedSensor].temperature}
          humidity={sensorData[selectedSensor].humidity}
          soilmoisture={sensorData[selectedSensor].soilmoisture}
        />
      </div>
    </div>
  );
};

export default MonitoringUI;