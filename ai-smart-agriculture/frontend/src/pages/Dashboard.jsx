import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Loader, RefreshCw } from 'lucide-react';
import Card from '../components/Card';
import { getPredictionHistory, getStatistics } from '../services/api';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [historyData, statsData] = await Promise.all([
        getPredictionHistory(filter === 'all' ? null : filter, 50),
        getStatistics(),
      ]);
      setHistory(historyData);
      setStatistics(statsData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPredictionTypeColor = (type) => {
    switch (type) {
      case 'disease':
        return 'bg-blue-100 text-blue-700';
      case 'soil':
        return 'bg-amber-100 text-amber-700';
      case 'weather':
        return 'bg-cyan-100 text-cyan-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPredictionTypeIcon = (type) => {
    switch (type) {
      case 'disease':
        return '🌿';
      case 'soil':
        return '🌾';
      case 'weather':
        return '🌤️';
      default:
        return '📊';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600">
              Track your predictions and analytics
            </p>
          </div>
          <button
            onClick={fetchData}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>

        {loading && !statistics && (
          <div className="text-center py-20">
            <Loader className="w-16 h-16 mx-auto mb-4 text-primary-600 animate-spin" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {statistics && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-primary-50 to-green-50 border border-primary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Predictions</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {statistics.total_predictions}
                    </p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-primary-500" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Disease Scans</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {statistics.disease_predictions}
                    </p>
                  </div>
                  <div className="text-4xl">🌿</div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Soil Analyses</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {statistics.soil_predictions}
                    </p>
                  </div>
                  <div className="text-4xl">🌾</div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Weather Checks</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {statistics.weather_predictions}
                    </p>
                  </div>
                  <div className="text-4xl">🌤️</div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 mr-2 self-center">Filter:</span>
                {['all', 'disease', 'soil', 'weather'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filter === type
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </Card>

            {/* Prediction History */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
                Recent Predictions
              </h2>

              {history.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                  <p>No predictions found</p>
                  <p className="text-sm mt-2">
                    Start using our tools to see your prediction history here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((prediction) => (
                    <div
                      key={prediction.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">
                              {getPredictionTypeIcon(prediction.prediction_type)}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getPredictionTypeColor(
                                prediction.prediction_type
                              )}`}
                            >
                              {prediction.prediction_type.toUpperCase()}
                            </span>
                            {prediction.confidence && (
                              <span className="text-sm text-gray-500">
                                {(prediction.confidence * 100).toFixed(0)}% confidence
                              </span>
                            )}
                          </div>

                          {prediction.prediction_type === 'disease' && (
                            <div>
                              <p className="font-semibold text-gray-800">
                                {prediction.result.disease}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {prediction.result.treatment}
                              </p>
                            </div>
                          )}

                          {prediction.prediction_type === 'soil' && (
                            <div>
                              <p className="font-semibold text-gray-800">
                                Recommended: {prediction.result.recommended_crop}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {prediction.result.fertilizer_advice}
                              </p>
                            </div>
                          )}

                          {prediction.prediction_type === 'weather' && (
                            <div>
                              <p className="font-semibold text-gray-800">
                                {prediction.result.location} - {prediction.result.temperature}°C
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {prediction.result.irrigation_advice}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="text-right ml-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(prediction.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
