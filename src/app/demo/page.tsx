"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

type Scenario = 'business-trip' | 'electricity' | 'commuting' | null;

type QuestionType = 'select' | 'radio' | 'text';

interface Question {
  label: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  showIf?: (answers: {[key: string]: string}) => boolean;
}

// 전력 공급업체별 배출 계수 (kg CO₂/kWh)
const ELECTRICITY_EMISSION_FACTORS = {
  'HK Electric': 0.66,
  'CLP': 0.37,
  'Other': 0.81 * 0.453592 // US factor converted from lbs to kg
};

// 배출 계수 상수 업데이트
const EMISSION_FACTORS = {
  car: {
    gasoline: {
      perGallon: 8.87, // kg CO2/gallon
      perLiter: 2.34,  // kg CO2/litre
    },
    diesel: {
      perGallon: 10.15, // kg CO2/gallon
      perLiter: 2.68,   // kg CO2/litre
    },
    hybrid: {
      perGallon: 5.0,   // kg CO2/gallon (예시값)
      perLiter: 1.32,   // kg CO2/litre
    }
  },
  airplane: {
    short_haul: 0.156,    // kg CO2 per passenger km (< 500 km)
    medium_haul: 0.131,   // kg CO2 per passenger km (500-3700 km)
    long_haul: 0.115      // kg CO2 per passenger km (> 3700 km)
  }
};

export default function Demo() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(null);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [calculationResults, setCalculationResults] = useState<{
    organizationEmissions: number | null;
    buildingEmissions: number | null;
    emissionFactor: number | null;
  }>({
    organizationEmissions: null,
    buildingEmissions: null,
    emissionFactor: null
  });

  // 입력값이 변경될 때마다 계산 실행
  useEffect(() => {
    if (activeScenario === 'electricity') {
      calculateElectricityEmissions();
    } else if (activeScenario === 'business-trip') {
      calculateBusinessTripEmissions();
    } else if (activeScenario === 'commuting') {
      calculateCommutingEmissions();
    }
  }, [answers, activeScenario]);

  const scenarios = {
    'business-trip': {
      title: 'Business Trip Carbon Emissions',
      questions: [
        {
          label: 'Transportation Mode',
          type: 'select',
          options: ['Airplane', 'Car'],
          required: true
        },
        // 항공기 관련 질문
        {
          label: 'Flight Type',
          type: 'select',
          options: [
            'Short-haul (< 500 km)',
            'Medium-haul (500-3700 km)',
            'Long-haul (> 3700 km)'
          ],
          required: true,
          showIf: (answers: {[key: string]: string}) => answers['Transportation Mode'] === 'Airplane'
        },
        {
          label: 'Total Flight Distance (in km)',
          type: 'text',
          placeholder: 'Enter distance in kilometers',
          required: true,
          showIf: (answers: {[key: string]: string}) => answers['Transportation Mode'] === 'Airplane'
        },
        // 자동차 관련 질문
        {
          label: 'Car Fuel Type',
          type: 'select',
          options: ['Gasoline', 'Diesel', 'Hybrid'],
          required: true,
          showIf: (answers: {[key: string]: string}) => answers['Transportation Mode'] === 'Car'
        },
        {
          label: 'Total Distance (in km)',
          type: 'text',
          placeholder: 'Enter distance in kilometers',
          required: true,
          showIf: (answers: {[key: string]: string}) => answers['Transportation Mode'] === 'Car'
        },
        {
          label: 'Fuel Efficiency (km/L)',
          type: 'text',
          placeholder: 'Enter km per liter',
          required: true,
          showIf: (answers: {[key: string]: string}) => answers['Transportation Mode'] === 'Car'
        },
        {
          label: 'Number of Occupants',
          type: 'select',
          options: ['1', '2', '3', '4', '5+'],
          required: true,
          showIf: (answers: {[key: string]: string}) => answers['Transportation Mode'] === 'Car'
        },
        {
          label: 'Trip Frequency',
          type: 'select',
          options: [
            'One-time trip',
            'Weekly',
            'Monthly',
            'Quarterly',
            'Annually'
          ],
          required: true
        }
      ]
    },
    'electricity': {
      title: 'Building Electricity Usage Analysis',
      questions: [
        {
          label: 'Do you occupy your own office space?',
          type: 'radio',
          options: ['yes', 'no_leased', 'no_metered'],
          required: true
        },
        {
          label: 'What is the total area of the building? (Enter in square meters)',
          type: 'text',
          placeholder: 'Enter area in square meters',
          required: true
        },
        {
          label: 'What is the total area occupied by your organization? (Enter in square meters)',
          type: 'text',
          placeholder: 'Enter area in square meters',
          required: true
        },
        {
          label: 'What is the total building energy consumption in the last 3 months? (Enter in kWh)',
          type: 'text',
          placeholder: 'Enter kWh',
          required: true
        },
        {
          label: 'If your electricity usage is separately metered, please enter your total electricity consumption in the last 3 months (in kWh):',
          type: 'text',
          placeholder: 'Enter kWh',
          required: false
        },
        {
          label: 'Electricity Provider',
          type: 'select',
          options: ['HK Electric', 'CLP', 'Other'],
          required: true
        }
      ]
    },
    'commuting': {
      title: 'Employee Commuting Emissions Analysis',
      questions: [
        {
          label: 'Total Employees',
          type: 'select',
          options: ['Less than 10', '10-50', '51-200', 'Over 200']
        },
        {
          label: 'Primary Commute Method',
          type: 'select',
          options: ['Public Transit', 'Personal Vehicle', 'Walking/Cycling', 'Mixed']
        },
        {
          label: 'Average Commute Distance',
          type: 'select',
          options: ['Less than 5km', '5-15km', '16-30km', 'Over 30km']
        },
        {
          label: 'Remote Work Percentage',
          type: 'select',
          options: ['0%', '1-20%', '21-50%', 'Over 50%']
        }
      ]
    }
  };

  const calculateElectricityEmissions = () => {
    if (activeScenario !== 'electricity') return;

    try {
      const totalArea = parseFloat(answers['What is the total area of the building? (Enter in square meters)'] || '0');
      const orgArea = parseFloat(answers['What is the total area occupied by your organization? (Enter in square meters)'] || '0');
      const totalUsage = parseFloat(answers['What is the total building energy consumption in the last 3 months? (Enter in kWh)'] || '0');
      const separateUsage = parseFloat(answers['If your electricity usage is separately metered, please enter your total electricity consumption in the last 3 months (in kWh):'] || '0');
      const provider = answers['Electricity Provider'];

      // 필수 입력값 체크
      if (!provider || (!totalArea && !separateUsage)) {
        setCalculationResults({
          organizationEmissions: null,
          buildingEmissions: null,
          emissionFactor: null
        });
        return;
      }

      const emissionFactor = ELECTRICITY_EMISSION_FACTORS[provider as keyof typeof ELECTRICITY_EMISSION_FACTORS];
      let organizationUsage: number;

      if (separateUsage > 0) {
        // 개별 계량기가 있는 경우
        organizationUsage = separateUsage;
      } else if (totalArea > 0 && orgArea > 0 && totalUsage > 0) {
        // 전체 건물 사용량에서 면적 비율로 계산
        organizationUsage = (orgArea / totalArea) * totalUsage;
      } else {
        setCalculationResults({
          organizationEmissions: null,
          buildingEmissions: null,
          emissionFactor: null
        });
        return;
      }

      const organizationEmissions = organizationUsage * emissionFactor;
      const buildingEmissions = totalUsage * emissionFactor;

      setCalculationResults({
        organizationEmissions,
        buildingEmissions,
        emissionFactor
      });
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculationResults({
        organizationEmissions: null,
        buildingEmissions: null,
        emissionFactor: null
      });
    }
  };

  const calculateBusinessTripEmissions = () => {
    if (activeScenario !== 'business-trip') return;

    try {
      const mode = answers['Transportation Mode'];
      let emissions = 0;
      let details = {
        fuelUsed: 0,
        distance: 0,
        emissionFactor: 0
      };

      if (mode === 'Car') {
        // 1. 기본 정보 가져오기
        const distance = parseFloat(answers['Total Distance (in km)'] || '0');
        const fuelEfficiency = parseFloat(answers['Fuel Efficiency (km/L)'] || '0');
        const occupants = parseInt(answers['Number of Occupants'] || '1');
        const fuelType = answers['Car Fuel Type']?.toLowerCase();

        if (distance > 0 && fuelEfficiency > 0 && fuelType) {
          // 2. 연료 사용량 계산 (리터 단위)
          const fuelUsed = distance / fuelEfficiency;
          
          // 3. 1인당 연료 사용량
          const fuelPerPerson = fuelUsed / occupants;
          
          // 4. CO2 배출량 계산
          const emissionFactor = EMISSION_FACTORS.car[fuelType as keyof typeof EMISSION_FACTORS.car].perLiter;
          emissions = fuelPerPerson * emissionFactor;
          
          details = {
            fuelUsed: fuelPerPerson,
            distance: distance / occupants,
            emissionFactor
          };
        }
      } else if (mode === 'Airplane') {
        const distance = parseFloat(answers['Total Flight Distance (in km)'] || '0');
        const flightType = answers['Flight Type'];
        let emissionFactor = 0;

        if (flightType?.includes('Short')) {
          emissionFactor = EMISSION_FACTORS.airplane.short_haul;
        } else if (flightType?.includes('Medium')) {
          emissionFactor = EMISSION_FACTORS.airplane.medium_haul;
        } else if (flightType?.includes('Long')) {
          emissionFactor = EMISSION_FACTORS.airplane.long_haul;
        }

        emissions = distance * emissionFactor;
        details = {
          fuelUsed: 0, // 항공기의 경우 연료 사용량은 표시하지 않음
          distance,
          emissionFactor
        };
      }

      // 주기적인 출장인 경우 연간 배출량으로 계산
      const frequency = answers['Trip Frequency'];
      let annualMultiplier = 1;
      
      if (frequency === 'Weekly') {
        annualMultiplier = 52;
      } else if (frequency === 'Monthly') {
        annualMultiplier = 12;
      } else if (frequency === 'Quarterly') {
        annualMultiplier = 4;
      }

      emissions *= annualMultiplier;
      details.distance *= annualMultiplier;
      details.fuelUsed *= annualMultiplier;

      setCalculationResults({
        organizationEmissions: emissions,
        buildingEmissions: details.distance, // 이동 거리 저장
        emissionFactor: details.emissionFactor
      });
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculationResults({
        organizationEmissions: null,
        buildingEmissions: null,
        emissionFactor: null
      });
    }
  };

  const calculateCommutingEmissions = () => {
    if (activeScenario !== 'commuting') return;

    try {
      const employeeCount = answers['Total Employees'];
      const commuteMethod = answers['Primary Commute Method'];
      const distance = answers['Average Commute Distance'];
      const remoteWork = answers['Remote Work Percentage'];

      // 직원 수 범위의 중간값 계산
      let numEmployees = 0;
      if (employeeCount === 'Less than 10') numEmployees = 5;
      else if (employeeCount === '10-50') numEmployees = 30;
      else if (employeeCount === '51-200') numEmployees = 125;
      else if (employeeCount === 'Over 200') numEmployees = 250;

      // 평균 통근 거리 계산 (km)
      let avgDistance = 0;
      if (distance === 'Less than 5km') avgDistance = 2.5;
      else if (distance === '5-15km') avgDistance = 10;
      else if (distance === '16-30km') avgDistance = 23;
      else if (distance === 'Over 30km') avgDistance = 35;

      // 재택근무 비율 적용
      let officeWorkRatio = 1;
      if (remoteWork === '1-20%') officeWorkRatio = 0.9;
      else if (remoteWork === '21-50%') officeWorkRatio = 0.65;
      else if (remoteWork === 'Over 50%') officeWorkRatio = 0.4;

      // 교통수단별 배출 계수 (kg CO2/km)
      let emissionFactor = 0;
      if (commuteMethod === 'Public Transit') emissionFactor = 0.04;
      else if (commuteMethod === 'Personal Vehicle') emissionFactor = 0.2;
      else if (commuteMethod === 'Walking/Cycling') emissionFactor = 0;
      else if (commuteMethod === 'Mixed') emissionFactor = 0.12;

      // 연간 근무일 수 (주 5일 * 52주 - 공휴일 20일)
      const workingDays = (52 * 5 - 20);

      // 연간 총 이동거리 계산
      const totalDistance = numEmployees * avgDistance * 2 * workingDays * officeWorkRatio;
      
      // 연간 총 배출량 계산
      const totalEmissions = totalDistance * emissionFactor;

      setCalculationResults({
        organizationEmissions: totalEmissions,
        buildingEmissions: totalDistance / numEmployees, // 1인당 평균 이동거리
        emissionFactor: emissionFactor
      });
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculationResults({
        organizationEmissions: null,
        buildingEmissions: null,
        emissionFactor: null
      });
    }
  };

  const handleInputChange = (questionLabel: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionLabel]: value
    }));
  };

  const renderQuestion = (question: Question, index: number) => {
    // showIf 조건이 있고, 조건이 false인 경우 렌더링하지 않음
    if (question.showIf && !question.showIf(answers)) {
      return null;
    }

    switch (question.type) {
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center">
                <input
                  type="radio"
                  id={`${option}-${index}`}
                  name={question.label}
                  value={option}
                  onChange={(e) => handleInputChange(question.label, e.target.value)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`${option}-${index}`} className="ml-2 text-sm text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case 'text':
        return (
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder={question.placeholder}
            onChange={(e) => handleInputChange(question.label, e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        );
      default:
        return (
          <select 
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            onChange={(e) => handleInputChange(question.label, e.target.value)}
          >
            <option value="">Please select</option>
            {question.options?.map((option, optionIndex) => (
              <option key={optionIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
    }
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return 'Calculating...';
    return num.toFixed(2);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Demo Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AskYou Demo
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Experience the Future of ESG Reporting Automation
          </p>
          
          {/* Scenario Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveScenario('business-trip')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors
                ${activeScenario === 'business-trip' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Business Trip Scenario
            </button>
            <button
              onClick={() => setActiveScenario('electricity')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors
                ${activeScenario === 'electricity' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Building Electricity Consumption
            </button>
            <button
              onClick={() => setActiveScenario('commuting')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors
                ${activeScenario === 'commuting' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Employee Commuting
            </button>
          </div>
        </div>

        {/* Survey Section */}
        {activeScenario && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {scenarios[activeScenario].title}
              </h2>
              
              <div className="space-y-6">
                {scenarios[activeScenario].questions.map((question, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {question.required && <span className="text-red-500 mr-1">*</span>}
                      {question.label}
                    </label>
                    {renderQuestion(question, index)}
                  </div>
                ))}

                {/* Results Preview */}
                {activeScenario && (
                  <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Estimated Results</h3>
                    <div className="space-y-3">
                      {activeScenario === 'business-trip' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total CO₂ Emissions</span>
                            <span className="font-medium text-gray-900">
                              {formatNumber(calculationResults.organizationEmissions)} kg CO₂
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Distance</span>
                            <span className="font-medium text-gray-900">
                              {formatNumber(calculationResults.buildingEmissions)} km
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Applied Emission Factor</span>
                            <span className="font-medium text-blue-600">
                              {formatNumber(calculationResults.emissionFactor)} kg CO₂/km
                            </span>
                          </div>
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              These calculations include adjustments for trip frequency and occupancy. For car travel, fuel efficiency and fuel type are considered. For air travel, different emission factors are applied based on flight distance.
                            </p>
                          </div>
                        </>
                      )}
                      
                      {activeScenario === 'electricity' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Organization's CO₂ Emissions (3 months)</span>
                            <span className="font-medium text-gray-900">
                              {formatNumber(calculationResults.organizationEmissions)} kg CO₂
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Building CO₂ Emissions (3 months)</span>
                            <span className="font-medium text-gray-900">
                              {formatNumber(calculationResults.buildingEmissions)} kg CO₂
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Applied Emission Factor</span>
                            <span className="font-medium text-blue-600">
                              {formatNumber(calculationResults.emissionFactor)} kg CO₂/kWh
                            </span>
                          </div>
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              These calculations are based on your electricity consumption and provider's emission factor. For shared spaces, emissions are calculated proportionally based on occupied area.
                            </p>
                          </div>
                        </>
                      )}

                      {activeScenario === 'commuting' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estimated Annual CO₂ Emissions</span>
                            <span className="font-medium text-gray-900">
                              {formatNumber(calculationResults.organizationEmissions)} kg CO₂
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average Distance per Employee</span>
                            <span className="font-medium text-gray-900">
                              {formatNumber(calculationResults.buildingEmissions)} km/year
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average Emission Factor</span>
                            <span className="font-medium text-blue-600">
                              {formatNumber(calculationResults.emissionFactor)} kg CO₂/km
                            </span>
                          </div>
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              These calculations consider the number of employees, commute methods, average distances, and work-from-home policies to estimate annual emissions.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
          >
            Try Full Features
          </Link>
        </div>
      </div>
    </main>
  );
}