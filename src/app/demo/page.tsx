"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BuildingOffice2Icon, 
  GlobeAsiaAustraliaIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// 배출 계수 상수
const EMISSION_FACTORS = {
  electricity: {
    HKElectric: 0.66, // kg CO2/kWh
    CLP: 0.37, // kg CO2/kWh
    other: 0.367 // kg CO2/kWh (US average)
  },
  transportation: {
    airplane: {
      shortHaul: 0.156, // kg CO2/passenger-km
      mediumHaul: 0.131, // kg CO2/passenger-km
      longHaul: 0.115 // kg CO2/passenger-km
    },
    car: {
      gasoline: 0.234, // kg CO2/km
      diesel: 0.268, // kg CO2/km
      hybrid: 0.131 // kg CO2/km
    }
  }
};

const scenarios = [
  {
    title: "Business Trip Scenario",
    description: "Calculate carbon emissions from your business travel including flights and ground transportation.",
    icon: GlobeAsiaAustraliaIcon,
    id: "business-trip",
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
    id: "electricity",
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
    id: "commuting",
    features: [
      "Emissions by transportation mode",
      "Work-from-home impact analysis",
      "Annual commute distance automation"
    ]
  }
];

interface Question {
  id: string;
  type: 'select' | 'number';
  label: string;
  options?: string[];
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
  condition?: (answers: Answer) => boolean;
}

interface Questions {
  'business-trip': Question[];
  'electricity': Question[];
  'commuting': Question[];
}

const questions: Questions = {
  'business-trip': [
    {
      id: 'transportMode',
      type: 'select',
      label: 'What mode of transportation did you use?',
      options: ['Airplane', 'Car'],
      required: true
    },
    {
      id: 'distance',
      type: 'number',
      label: 'Total distance traveled (in km)',
      required: true,
      min: 0,
      step: 0.01
    },
    {
      id: 'flightType',
      type: 'select',
      label: 'For flights, what was the type?',
      options: ['Short-haul (<500km)', 'Medium-haul (500-3700km)', 'Long-haul (>3700km)'],
      condition: (answers) => answers.transportMode === 'Airplane',
      required: true
    },
    {
      id: 'fuelType',
      type: 'select',
      label: 'For car travel, what type of fuel?',
      options: ['Gasoline', 'Diesel', 'Hybrid'],
      condition: (answers) => answers.transportMode === 'Car',
      required: true
    },
    {
      id: 'occupants',
      type: 'number',
      label: 'Number of occupants in the vehicle',
      condition: (answers) => answers.transportMode === 'Car',
      required: true,
      min: 1,
      step: 1
    },
    {
      id: 'frequency',
      type: 'select',
      label: 'How often do you make this trip?',
      options: ['One-time', 'Weekly', 'Monthly', 'Quarterly', 'Annually'],
      required: true
    }
  ],
  'electricity': [
    {
      id: 'provider',
      type: 'select',
      label: 'Who is your electricity provider?',
      options: ['HK Electric', 'CLP', 'Other'],
      required: true
    },
    {
      id: 'hasMetering',
      type: 'select',
      label: 'Do you have separate electricity metering?',
      options: ['Yes', 'No'],
      required: true
    },
    {
      id: 'consumption',
      type: 'number',
      label: 'Monthly electricity consumption (kWh)',
      condition: (answers) => answers.hasMetering === 'Yes',
      required: true,
      min: 0,
      step: 0.01
    },
    {
      id: 'buildingTotal',
      type: 'number',
      label: 'Total building electricity consumption (kWh/month)',
      condition: (answers) => answers.hasMetering === 'No',
      required: true,
      min: 0,
      step: 0.01
    },
    {
      id: 'totalArea',
      type: 'number',
      label: 'Total building area (m²)',
      condition: (answers) => answers.hasMetering === 'No',
      required: true,
      min: 0,
      step: 0.01
    },
    {
      id: 'occupiedArea',
      type: 'number',
      label: 'Your occupied area (m²)',
      condition: (answers) => answers.hasMetering === 'No',
      required: true,
      min: 0,
      step: 0.01
    }
  ],
  'commuting': [
    {
      id: 'transportMode',
      type: 'select',
      label: 'Primary mode of transportation',
      options: ['Car', 'Public Transport', 'Bicycle/Walk'],
      required: true
    },
    {
      id: 'distance',
      type: 'number',
      label: 'One-way commute distance (km)',
      required: true,
      min: 0,
      step: 0.01
    },
    {
      id: 'daysPerWeek',
      type: 'number',
      label: 'Days commuting per week',
      required: true,
      min: 0,
      max: 7,
      step: 1
    },
    {
      id: 'weeksPerYear',
      type: 'number',
      label: 'Weeks worked per year',
      required: true,
      min: 0,
      max: 52,
      step: 1
    },
    {
      id: 'fuelType',
      type: 'select',
      label: 'For car commuting, what type of fuel?',
      options: ['Gasoline', 'Diesel', 'Hybrid'],
      condition: (answers) => answers.transportMode === 'Car',
      required: true
    },
    {
      id: 'occupants',
      type: 'number',
      label: 'Number of occupants in the vehicle',
      condition: (answers) => answers.transportMode === 'Car',
      required: true,
      min: 1,
      step: 1
    }
  ]
};

// 타입 정의
type ScenarioType = 'business-trip' | 'electricity' | 'commuting' | null;

interface Answer {
  [key: string]: string | undefined;
  transportMode?: string;
  distance?: string;
  flightType?: string;
  fuelType?: string;
  occupants?: string;
  frequency?: string;
  provider?: string;
  hasMetering?: string;
  consumption?: string;
  buildingTotal?: string;
  totalArea?: string;
  occupiedArea?: string;
  daysPerWeek?: string;
  weeksPerYear?: string;
}

interface CalculationResult {
  emissions: string;
  unit: string;
  details: string;
}

export default function Demo() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>(null);
  const [answers, setAnswers] = useState<Answer>({});
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [calculating, setCalculating] = useState(false);

  const handleScenarioSelect = (scenarioId: ScenarioType) => {
    setSelectedScenario(scenarioId);
    setAnswers({});
    setResults(null);
  };

  // URL에서 시나리오 파라미터 읽기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const scenario = params.get('scenario') as ScenarioType;
      if (scenario && Object.keys(questions).includes(scenario)) {
        setSelectedScenario(scenario);
      }
    }
  }, []);

  // 답변이 변경될 때마다 자동으로 계산 실행
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      setCalculating(true);
      try {
        let result: CalculationResult | null = null;
        switch (selectedScenario) {
          case 'business-trip':
            result = calculateBusinessTripEmissions(answers);
            break;
          case 'electricity':
            result = calculateElectricityEmissions(answers);
            break;
          case 'commuting':
            result = calculateCommutingEmissions(answers);
            break;
        }
        setResults(result);
      } catch (error) {
        console.error('Calculation error:', error);
        setResults(null);
      }
      setCalculating(false);
    }
  }, [answers, selectedScenario]);

  // 비즈니스 출장 배출량 계산
  const calculateBusinessTripEmissions = (answers: Answer): CalculationResult => {
    let emissions = 0;
    const distance = answers.distance ? parseFloat(answers.distance) : 0;

    if (answers.transportMode === 'Airplane' && answers.flightType) {
      let factor = 0;
      switch (answers.flightType) {
        case 'Short-haul (<500km)':
          factor = EMISSION_FACTORS.transportation.airplane.shortHaul;
          break;
        case 'Medium-haul (500-3700km)':
          factor = EMISSION_FACTORS.transportation.airplane.mediumHaul;
          break;
        case 'Long-haul (>3700km)':
          factor = EMISSION_FACTORS.transportation.airplane.longHaul;
          break;
      }
      emissions = distance * factor;
    } else if (answers.transportMode === 'Car' && answers.fuelType && answers.occupants) {
      let factor = 0;
      switch (answers.fuelType.toLowerCase()) {
        case 'gasoline':
          factor = EMISSION_FACTORS.transportation.car.gasoline;
          break;
        case 'diesel':
          factor = EMISSION_FACTORS.transportation.car.diesel;
          break;
        case 'hybrid':
          factor = EMISSION_FACTORS.transportation.car.hybrid;
          break;
      }
      emissions = (distance * factor) / parseInt(answers.occupants);
    }

    if (answers.frequency) {
      switch (answers.frequency) {
        case 'Weekly':
          emissions *= 52;
          break;
        case 'Monthly':
          emissions *= 12;
          break;
        case 'Quarterly':
          emissions *= 4;
          break;
        case 'Annually':
          emissions *= 1;
          break;
      }
    }

    return {
      emissions: emissions.toFixed(2),
      unit: 'kg CO₂',
      details: `Based on ${distance}km travel using ${answers.transportMode?.toLowerCase() || 'unknown transport'}`
    };
  };

  // 전기 사용량 배출량 계산
  const calculateElectricityEmissions = (answers: Answer): CalculationResult => {
    let monthlyConsumption = 0;
    let emissionFactor = EMISSION_FACTORS.electricity.other; // 기본값

    if (answers.provider) {
      switch (answers.provider) {
        case 'HK Electric':
          emissionFactor = EMISSION_FACTORS.electricity.HKElectric;
          break;
        case 'CLP':
          emissionFactor = EMISSION_FACTORS.electricity.CLP;
          break;
      }
    }

    if (answers.hasMetering === 'Yes' && answers.consumption) {
      monthlyConsumption = parseFloat(answers.consumption);
    } else if (answers.buildingTotal && answers.totalArea && answers.occupiedArea) {
      const totalConsumption = parseFloat(answers.buildingTotal);
      const totalArea = parseFloat(answers.totalArea);
      const occupiedArea = parseFloat(answers.occupiedArea);
      monthlyConsumption = (totalConsumption * occupiedArea) / totalArea;
    }

    const emissions = monthlyConsumption * emissionFactor;

    return {
      emissions: emissions.toFixed(2),
      unit: 'kg CO₂',
      details: `Based on ${monthlyConsumption.toFixed(2)} kWh monthly consumption`
    };
  };

  // 직원 통근 배출량 계산
  const calculateCommutingEmissions = (answers: Answer): CalculationResult => {
    let emissions = 0;
    const distance = answers.distance ? parseFloat(answers.distance) * 2 : 0; // 왕복 거리
    const daysPerWeek = answers.daysPerWeek ? parseInt(answers.daysPerWeek) : 0;
    const weeksPerYear = answers.weeksPerYear ? parseInt(answers.weeksPerYear) : 0;

    if (answers.transportMode === 'Car' && answers.fuelType && answers.occupants) {
      let factor = 0;
      switch (answers.fuelType.toLowerCase()) {
        case 'gasoline':
          factor = EMISSION_FACTORS.transportation.car.gasoline;
          break;
        case 'diesel':
          factor = EMISSION_FACTORS.transportation.car.diesel;
          break;
        case 'hybrid':
          factor = EMISSION_FACTORS.transportation.car.hybrid;
          break;
      }
      emissions = (distance * factor) / parseInt(answers.occupants);
    } else if (answers.transportMode === 'Public Transport') {
      emissions = distance * 0.04; // 평균 대중교통 배출계수
    }

    const annualEmissions = emissions * daysPerWeek * weeksPerYear;

    return {
      emissions: annualEmissions.toFixed(2),
      unit: 'kg CO₂/year',
      details: `Based on ${distance}km daily round trip, ${daysPerWeek} days per week`
    };
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // 현재 시나리오에 대한 질문들 필터링
  const currentQuestions = selectedScenario ? questions[selectedScenario].filter(q => 
    !q.condition || q.condition(answers)
  ) : [];

  if (!selectedScenario) {
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
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-500 transition-colors duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onClick={() => handleScenarioSelect(scenario.id as ScenarioType)}
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
                  <button
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Get Started
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {scenarios.find(s => s.id === selectedScenario)?.title}
            </h2>
            <button
              onClick={() => handleScenarioSelect(null)}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Scenarios
            </button>
          </div>
          
          <div className="space-y-6">
            {currentQuestions.map((question) => (
              <div key={question.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {question.type === 'select' ? (
                  <select
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required={question.required}
                  >
                    <option value="">Select an option</option>
                    {question.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={question.type}
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required={question.required}
                    min={question.min}
                    max={question.max}
                    step={question.step}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Results Section */}
          {calculating ? (
            <div className="mt-8 text-center text-gray-600">
              Calculating...
            </div>
          ) : results && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {results.emissions} {results.unit}
              </p>
              <p className="text-gray-600 text-sm">
                {results.details}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}