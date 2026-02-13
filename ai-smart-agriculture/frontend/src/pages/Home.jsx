import { Link } from 'react-router-dom';
import { Camera, Droplet, Cloud, BarChart3, ArrowRight } from 'lucide-react';
import Card from '../components/Card';

const Home = () => {
  const features = [
    {
      icon: Camera,
      title: 'Disease Detection',
      description: 'Upload crop images to detect diseases using AI-powered computer vision',
      link: '/disease-detection',
      color: 'bg-blue-500',
    },
    {
      icon: Droplet,
      title: 'Soil Analysis',
      description: 'Get personalized crop recommendations based on your soil parameters',
      link: '/soil-recommendation',
      color: 'bg-amber-500',
    },
    {
      icon: Cloud,
      title: 'Weather Advisory',
      description: 'Receive weather-based irrigation and farming advice for your location',
      link: '/weather',
      color: 'bg-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Dashboard',
      description: 'Track your prediction history and view comprehensive analytics',
      link: '/dashboard',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Agriculture Assistant
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50">
              Empowering farmers with AI-driven insights for better crop management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/disease-detection"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/dashboard"
                className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Leverage cutting-edge AI technology to make informed decisions
            and maximize your agricultural productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-primary-600 font-medium group-hover:translate-x-2 transition-transform">
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600">Offline Capable</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">AI-Powered</div>
              <div className="text-gray-600">Machine Learning Models</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">Real-time</div>
              <div className="text-gray-600">Instant Predictions</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-700 text-white">
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-lg mb-6 text-green-50">
              Start using our AI-powered tools to improve your crop yields today
            </p>
            <Link
              to="/disease-detection"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Try Disease Detection
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
