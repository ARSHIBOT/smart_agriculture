import { useState } from 'react';
import { Droplet, Send, Loader, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import { predictSoilRecommendation } from '../services/api';

const SoilRecommendation = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    rainfall: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall),
      };

      const result = await predictSoilRecommendation(data);
      setPrediction(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      ph: '',
      rainfall: '',
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Soil Analysis & Crop Recommendation
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized crop recommendations based on your soil parameters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Soil Parameters</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  Nitrogen (N) - kg/ha
                </label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  min="0"
                  max="200"
                  step="0.1"
                  required
                  className="input-field"
                  placeholder="0-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nitrogen content in soil (0-200 kg/ha)
                </p>
              </div>

              <div>
                <label className="label">
                  Phosphorus (P) - kg/ha
                </label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  min="0"
                  max="200"
                  step="0.1"
                  required
                  className="input-field"
                  placeholder="0-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Phosphorus content in soil (0-200 kg/ha)
                </p>
              </div>

              <div>
                <label className="label">
                  Potassium (K) - kg/ha
                </label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleChange}
                  min="0"
                  max="200"
                  step="0.1"
                  required
                  className="input-field"
                  placeholder="0-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Potassium content in soil (0-200 kg/ha)
                </p>
              </div>

              <div>
                <label className="label">
                  Soil pH Level
                </label>
                <input
                  type="number"
                  name="ph"
                  value={formData.ph}
                  onChange={handleChange}
                  min="0"
                  max="14"
                  step="0.1"
                  required
                  className="input-field"
                  placeholder="0-14"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Soil pH value (0-14, neutral is 7)
                </p>
              </div>

              <div>
                <label className="label">
                  Average Rainfall (mm)
                </label>
                <input
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  min="0"
                  max="500"
                  step="0.1"
                  required
                  className="input-field"
                  placeholder="0-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Average annual rainfall in mm (0-500)
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Get Recommendation
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  Reset
                </button>
              </div>
            </form>
          </Card>

          {/* Results Section */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommendations</h2>
            
            {!prediction && !loading && (
              <div className="text-center py-12 text-gray-400">
                <Droplet className="w-16 h-16 mx-auto mb-4" />
                <p>Enter soil parameters to get crop recommendations</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <Loader className="w-16 h-16 mx-auto mb-4 text-primary-600 animate-spin" />
                <p className="text-gray-600">Analyzing soil parameters...</p>
              </div>
            )}

            {prediction && (
              <div className="space-y-6">
                <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Recommended Crop
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-primary-700 mb-2">
                    {prediction.recommended_crop}
                  </p>
                  {prediction.confidence && (
                    <p className="text-sm text-gray-600">
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Droplet className="w-5 h-5 mr-2 text-amber-600" />
                    Fertilizer Advice
                  </h3>
                  <p className="text-gray-700">{prediction.fertilizer_advice}</p>
                </div>

                {prediction.additional_tips && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Additional Tips
                    </h3>
                    <p className="text-gray-700">{prediction.additional_tips}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Guide Section */}
        <Card className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            How to Measure Soil Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border-l-4 border-primary-500 pl-4">
              <h4 className="font-semibold mb-2">NPK Values</h4>
              <p className="text-sm text-gray-600">
                Use a soil testing kit or send samples to agricultural lab for
                accurate nitrogen, phosphorus, and potassium measurements.
              </p>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h4 className="font-semibold mb-2">pH Level</h4>
              <p className="text-sm text-gray-600">
                Use a pH meter or pH testing strips. Collect samples from
                multiple spots for accurate average reading.
              </p>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h4 className="font-semibold mb-2">Rainfall</h4>
              <p className="text-sm text-gray-600">
                Use historical rainfall data from local weather stations or
                agricultural department records.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SoilRecommendation;
