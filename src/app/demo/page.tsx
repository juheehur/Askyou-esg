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
      "항공 및 차량 이동 거리 기반 배출량 계산",
      "다양한 교통수단 지원",
      "출장 빈도 반영"
    ]
  },
  {
    title: "Building Electricity Consumption",
    description: "Track and measure your organization&apos;s electricity usage and related carbon emissions.",
    icon: BuildingOffice2Icon,
    href: "?scenario=electricity",
    features: [
      "전력 공급사별 배출계수 적용",
      "건물 면적 기반 사용량 계산",
      "실시간 모니터링"
    ]
  },
  {
    title: "Employee Commuting",
    description: "Assess the environmental impact of your employees&apos; daily commute.",
    icon: UserGroupIcon,
    href: "?scenario=commuting",
    features: [
      "교통수단별 배출량 산정",
      "재택근무 영향 반영",
      "연간 통근 거리 자동 계산"
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
            ESG 보고서 자동화의 미래를 체험해보세요. 아래 시나리오 중 하나를 선택하여 시작하실 수 있습니다.
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
                  시작하기
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
            전체 기능 살펴보기
          </Link>
        </motion.div>
      </div>
    </div>
  );
}