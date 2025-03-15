"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BuildingOffice2Icon, 
  GlobeAsiaAustraliaIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const scenarios = [
  {
    title: "Business Trip Scenario",
    description: "Calculate carbon emissions from your business travel including flights and ground transportation.",
    icon: GlobeAsiaAustraliaIcon,
    href: "?scenario=business-trip",
    features: [
      "Emission calculations based on flight and vehicle distances",
      "Support for various transportation modes",
      "Trip frequency adjustments"
    ]
  },
  {
    title: "Building Electricity Consumption",
    description: "Track and measure your organization&apos;s electricity usage and related carbon emissions.",
    icon: BuildingOffice2Icon,
    href: "?scenario=electricity",
    features: [
      "Emission factors by electricity provider",
      "Usage calculations based on building area",
      "Real-time monitoring"
    ]
  },
  {
    title: "Employee Commuting",
    description: "Assess the environmental impact of your employees&apos; daily commute.",
    icon: UserGroupIcon,
    href: "?scenario=commuting",
    features: [
      "Emissions by transportation mode",
      "Work-from-home impact analysis",
      "Annual commute distance automation"
    ]
  }
];

export default function Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
            AskYou Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of ESG reporting automation. Choose one of the scenarios below to get started.
          </p>
        </motion.div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={index}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-500 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="p-8">
                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <scenario.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {scenario.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {scenario.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {scenario.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={scenario.href}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link
            href="/features"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-lg"
          >
            Explore All Features
          </Link>
        </motion.div>
      </div>
    </div>
  );
}