"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  RocketLaunchIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  ChartPieIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    title: 'AI-Generated Surveys for Data Collection',
    description: 'Our intelligent system dynamically adjusts questions based on your responses, making data collection effortless and precise. Experience streamlined ESG data gathering that adapts to your business context.',
    icon: RocketLaunchIcon,
  },
  {
    title: 'Automated Carbon Emission Calculation',
    description: 'Instantly compute emissions using standardized frameworks like HKEX and GHG Protocol. Our AI processes complex data points to deliver accurate carbon footprint measurements in real-time.',
    icon: ChartBarIcon,
  },
  {
    title: 'Instant ESG Report Generation',
    description: 'Transform raw data into compliance-ready ESG reports within seconds. Our platform automatically generates comprehensive reports that meet global reporting standards.',
    icon: DocumentTextIcon,
  },
  {
    title: 'Cost & Time Efficiency',
    description: 'Reduce ESG reporting time from 2 weeks to just 7 seconds. Save valuable resources while maintaining the highest standards of accuracy and compliance.',
    icon: ClockIcon,
  },
  {
    title: 'User-Friendly Dashboard',
    description: 'Track your sustainability progress through our intuitive interface. Get clear visualizations and actionable insights that help drive your ESG initiatives forward.',
    icon: ChartPieIcon,
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
              AI-Powered Carbon Tracking Made Simple
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
              Automate your ESG reporting with precision and ease. Experience the future of sustainability tracking with our intelligent platform.
            </p>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative mx-auto mb-24"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl transform rotate-1 scale-105 opacity-10"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <Image
                  src="/dashboard-preview.png"
                  alt="AskYou Dashboard Preview"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full text-sm font-medium shadow-lg">
                Interactive Dashboard
              </div>
            </motion.div>

            {/* AI Form Generation Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-2xl transform -rotate-1 scale-105 opacity-10"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <Image
                  src="/form-gen.png"
                  alt="AI Form Generation Preview"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-full text-sm font-medium shadow-lg">
                AI-Powered Form Generation
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Effortless ESG Reporting
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how AskYou transforms complex ESG reporting into a simple, automated process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your ESG Reporting?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join forward-thinking companies that are already saving time and resources with AskYou.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300 shadow-lg"
            >
              Try Demo Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 