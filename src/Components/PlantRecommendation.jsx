import React, { useState, useEffect, useCallback } from 'react';
import OpenAI from 'openai';
import './PlantRecommendation.css';

const PlantRecommendation = ({ temperature, humidity, soilMoisture }) => {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [error, setError] = useState(null);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const generateRecommendation = useCallback(async () => {
    console.log("Starting to generate recommendation...");
    setLoading(true); // Set loading to true
    
    try {
      const prompt = `
        As a plant care expert, analyze these conditions for Pak Choi (Chinese Cabbage):
        
        Current Readings:
        - Temperature: ${temperature}°C
        - Humidity: ${humidity}%
        - Soil Moisture: ${soilMoisture}%
        
        Optimal Conditions for Pak Choi:
        - Temperature: 15-22°C
        - Humidity: 60-70%
        - Soil Moisture: 60-80%
        
        Please provide your response in this format:
        
        # Assessment of Current Conditions
        [Your assessment here]
        
        # Required Actions
        * [Action 1]
        * [Action 2]
        * [Action 3]
        
        # Warnings
        * [Warning 1]
        * [Warning 2]
        
        # Maintenance Tips
        * [Tip 1]
        * [Tip 2]
        * [Tip 3]
        
        Keep each section concise and practical.
      `;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });

      const formattedResponse = completion.choices[0].message.content
        .replace(/# (.*)/g, '<h3>$1</h3>')
        .replace(/\* (.*)/g, '<li>$1</li>')
        .replace(/\n\n/g, '</ul><br/><ul>')
        .replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');

      setRecommendation(formattedResponse);
      setShowRecommendation(true);
    } catch (error) {
      console.error('Error generating recommendation:', error);
      setError('Unable to get recommendation at this time. Please try again later.');
    } finally {
      setLoading(false); // Ensure loading is set to false after the call
    }
  }, [temperature, humidity, soilMoisture]);

  const handleToggle = useCallback((e) => {
    setIsChecked(e.target.checked);
  if (e.target.checked) {
    setLoading(true); 
    generateRecommendation(); 
  } else {
    setLoading(false); 
  }
}, [generateRecommendation]);

  const closeRecommendation = () => {
    setShowRecommendation(false);
    setRecommendation('');
    setIsChecked(false); // Reset toggle switch to off
    document.body.classList.remove('modal-open'); // Remove class to unfreeze background
  };

  useEffect(() => {
    if (showRecommendation) {
      document.body.classList.add('modal-open'); // Add class to freeze background
    } else {
      document.body.classList.remove('modal-open'); // Remove class when closed
    }
  }, [showRecommendation]);

  return (
    <div className="recommendation-box">
      <h2>Plant Care Recommendation</h2>
      
      <div className="current-conditions">
        <p>The current plant conditions are:</p>
        <p>Temperature: {temperature}°C</p>
        <p>Humidity: {humidity}%</p>
        <p>Soil Moisture: {soilMoisture}%</p>
      </div>

      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            disabled={loading}
          />
          <span className="slider round"></span>
        </label>
        <span>Get Plant Care Advice</span>
      </div>

      {showRecommendation && (
        <div className="overlay">
          <div className="recommendation-content">
            <button className="close-button" onClick={closeRecommendation}>✖</button>
            {loading ? (
              <div className="loading flashing">Generating recommendation...</div> 
            ) : (
              <div>
                <div dangerouslySetInnerHTML={{ __html: recommendation }} />
                <div className="disclaimer">
                  <p>This is a recommendation from Generative AI and does not serve as professional advice. Always consult with a qualified agronomist or expert for critical decisions.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PlantRecommendation;