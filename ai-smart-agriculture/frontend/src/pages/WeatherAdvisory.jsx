import { useState } from 'react';
import { Cloud, MapPin, Loader, Thermometer, Droplets, CloudRain } from 'lucide-react';
import Card from '../components/Card';
import { getWeatherAdvisory } from '../services/api';

const WeatherAdvisory = () => {
  const [location, setLocation] = useState('Delhi');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const popularCities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
    'Hyderabad', 'Pune', 'Jaipur', 'Lucknow', 'Nagpur'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getWeatherAdvisory(location);
      setWeather(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectCity = async (city) => {
    setLocation(city);
    setLoading(true);
    setError(null);

    try {
      const result = await getWeatherAdvisory(city);
      setWeather(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Weather-Based Farming Advisory
          </h1>
          <p className="text-lg text-gray-600">
            Get irrigation and farming advice based on weather conditions
          </p>
        </div>

        {/* Location Input */}
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city name"
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Get Advisory'
              )}
            </button>
          </form>

          {/* Popular Cities */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Popular cities:</p>
            <div className="flex flex-wrap gap-2">
              {popularCities.map((city) => (
                <button
                  key={city}
                  onClick={() => selectCity(city)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-primary-100 hover:text-primary-700 rounded-full transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading && !weather && (
          <Card>
            <div className="text-center py-12">
              <Loader className="w-16 h-16 mx-auto mb-4 text-primary-600 animate-spin" />
              <p className="text-gray-600">Fetching weather data...</p>
            </div>
          </Card>
        )}

        {weather && (
          <div className="space-y-6">
            {/* Weather Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Temperature</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {weather.temperature}°C
                    </p>
                  </div>
                  <Thermometer className="w-12 h-12 text-orange-500" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Humidity</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {weather.humidity}%
                    </p>
                  </div>
                  <Droplets className="w-12 h-12 text-blue-500" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rain Forecast</p>
                    <p className="text-xl font-bold text-gray-800">
                      {weather.rain_prediction}
                    </p>
                  </div>
                  <CloudRain className="w-12 h-12 text-purple-500" />
                </div>
              </Card>
            </div>

            {/* Irrigation Advice */}
            <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <Droplets className="w-6 h-6 mr-2" />
                Irrigation Advisory
              </h3>
              <p className="text-lg">{weather.irrigation_advice}</p>
            </Card>

            {/* Farming Tips */}
            <Card className="bg-gradient-to-r from-primary-500 to-green-600 text-white">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <Cloud className="w-6 h-6 mr-2" />
                Farming Tips
              </h3>
              <p className="text-lg">{weather.farming_tips}</p>
            </Card>

            {/* Additional Info */}
            <Card>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Cloud className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Location: {weather.location}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Weather data is simulated for demonstration purposes. In production,
                    this would connect to real weather APIs for accurate forecasts.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {!weather && !loading && (
          <Card>
            <div className="text-center py-12 text-gray-400">
              <Cloud className="w-16 h-16 mx-auto mb-4" />
              <p>Enter a location to get weather-based farming advice</p>
            </div>
          </Card>
        )}

        {/* Guide */}
        <Card className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Weather-Based Farming Guidelines
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start">
              <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                ✓
              </div>
              <p className="text-sm">
                <strong>High Rainfall:</strong> Ensure proper drainage, avoid fertilizer
                application, and protect crops from waterlogging.
              </p>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                ✓
              </div>
              <p className="text-sm">
                <strong>High Temperature:</strong> Increase irrigation frequency,
                apply mulch, and consider shade nets for sensitive crops.
              </p>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                ✓
              </div>
              <p className="text-sm">
                <strong>Low Humidity:</strong> Monitor for pest activity and
                ensure adequate soil moisture to prevent crop stress.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WeatherAdvisory;
