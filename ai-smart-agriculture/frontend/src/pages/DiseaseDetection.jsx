import { useState } from 'react';
import { Upload, Camera, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import Card from '../components/Card';
import { predictDisease } from '../services/api';

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await predictDisease(selectedImage);
      setPrediction(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Crop Disease Detection
          </h1>
          <p className="text-lg text-gray-600">
            Upload an image of your crop to detect diseases using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Image</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block w-full cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={!selectedImage || loading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Detect Disease
                    </>
                  )}
                </button>
                {selectedImage && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-secondary"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </Card>

          {/* Results Section */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h2>
            
            {!prediction && !loading && (
              <div className="text-center py-12 text-gray-400">
                <Camera className="w-16 h-16 mx-auto mb-4" />
                <p>Upload an image to see the analysis results</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <Loader className="w-16 h-16 mx-auto mb-4 text-primary-600 animate-spin" />
                <p className="text-gray-600">Analyzing your image...</p>
              </div>
            )}

            {prediction && (
              <div className="space-y-4">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Disease Detected</h3>
                  </div>
                  <p className="text-2xl font-bold text-primary-700 mb-1">
                    {prediction.disease}
                  </p>
                  <p className="text-sm text-gray-600">
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                {prediction.severity && (
                  <div className={`rounded-lg p-4 ${getSeverityColor(prediction.severity)}`}>
                    <h3 className="font-semibold mb-1">Severity</h3>
                    <p className="font-medium">{prediction.severity}</p>
                  </div>
                )}

                {prediction.description && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600">{prediction.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Recommended Treatment
                  </h3>
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    {prediction.treatment}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-700 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Upload Image</h4>
              <p className="text-sm text-gray-600">
                Take a clear photo of affected crop leaves
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-700 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-600">
                Our ML model analyzes the image for disease symptoms
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-700 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Get Treatment</h4>
              <p className="text-sm text-gray-600">
                Receive actionable treatment recommendations
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseDetection;
