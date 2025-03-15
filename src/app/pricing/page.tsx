"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const pricingPlans = [
  {
    name: 'Free',
    description: 'Perfect for small businesses exploring ESG reporting',
    price: '0',
    period: 'forever',
    features: [
      { text: '3 AI-generated surveys per month', included: true },
      { text: 'Basic carbon emission calculations', included: true },
      { text: 'Watermarked ESG reports', included: true },
      { text: 'Email support', included: true },
      { text: 'Real-time tracking', included: false },
      { text: 'Custom branding', included: false },
    ],
    cta: 'Start Free Trial',
    href: '/demo',
    popular: false,
  },
  {
    name: 'Starter',
    description: 'Ideal for growing SMEs committed to sustainability',
    price: '49',
    period: 'per month',
    features: [
      { text: '20 AI-generated surveys per month', included: true },
      { text: 'Full carbon emission calculations', included: true },
      { text: 'Standard ESG report generation', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Real-time tracking', included: true },
      { text: 'Custom branding', included: false },
    ],
    cta: 'Get Started',
    href: '/demo',
    popular: true,
  },
  {
    name: 'Pro',
    description: 'For businesses seeking comprehensive ESG solutions',
    price: '199',
    period: 'per month',
    features: [
      { text: 'Unlimited AI-generated surveys', included: true },
      { text: 'Advanced carbon emission tracking', included: true },
      { text: 'Compliance-ready reports (HKEX, GRI, TCFD)', included: true },
      { text: 'Priority 24/7 support', included: true },
      { text: 'Real-time tracking dashboard', included: true },
      { text: 'Custom branding', included: true },
    ],
    cta: 'Get Started',
    href: '/demo',
    popular: false,
  },
  {
    name: 'Enterprise',
    description: 'Tailored solutions for large corporations',
    price: 'Custom',
    period: 'contact us',
    features: [
      { text: 'Full platform access with API', included: true },
      { text: 'White-label reporting', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Compliance consultation', included: true },
      { text: 'Custom integration support', included: true },
      { text: 'SLA guarantee', included: true },
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to your plan until the end of your billing period.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a free trial with our Free plan that includes basic features to help you explore our platform.",
  },
  {
    question: "How does billing work?",
    answer: "We bill monthly or annually, with significant savings on annual plans. All major credit cards are accepted.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Pricing() {
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
              Affordable, Transparent, and Scalable Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
              Choose the perfect plan for your business. From startups to enterprises, we've got you covered with flexible pricing options.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border ${
                  plan.popular ? 'border-blue-500' : 'border-gray-100'
                }`}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price === 'Custom' ? '' : '$'}{plan.price}
                    </span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        {feature.included ? (
                          <CheckIcon className="h-5 w-5 text-blue-500 mr-3" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-gray-400 mr-3" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our pricing and plans.
            </p>
          </motion.div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
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
              Start Your ESG Journey Today
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Begin with our free plan and upgrade as your needs grow.
            </p>
            <div className="space-x-4">
              <Link
                href="/demo"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300 shadow-lg"
              >
                Start Free Trial
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-full text-white hover:bg-white/10 transition-colors duration-300"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 