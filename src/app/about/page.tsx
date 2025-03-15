import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Revolutionizing ESG Reporting
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-500">
            AskYou is an innovative AI-powered platform that transforms how businesses track and report their carbon emissions. 
            We make ESG compliance accessible, accurate, and efficient for organizations of all sizes.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Key Benefits */}
        <div className="py-16 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose AskYou?</h2>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Simplified Data Collection</h3>
              <p className="text-gray-500">
                Our AI-powered surveys dynamically adapt to your business context, making it easy to collect accurate carbon emission data across all activities. From flights to energy consumption, we've got you covered.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry Standard Compliance</h3>
              <p className="text-gray-500">
                Built on frameworks like HKEX and GHG Protocol, AskYou ensures your ESG reporting meets global standards including GRI and TCFD requirements. Stay compliant without the complexity.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Automated Calculations</h3>
              <p className="text-gray-500">
                Say goodbye to manual calculations. Our platform instantly processes your data to generate accurate carbon emission metrics for all business activities, saving you time and reducing errors.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessible for All</h3>
              <p className="text-gray-500">
                Whether you're an SME or NGO, AskYou makes sustainability tracking affordable and manageable. Access the tools you need to enhance compliance and secure sustainability-linked funding.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16 border-t border-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to Transform Your ESG Reporting?</h2>
            <div className="flex justify-center gap-4">
              <Link
                href="/demo"
                className="rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white shadow hover:bg-indigo-700"
              >
                Request Demo
              </Link>
              <Link
                href="/contact"
                className="rounded-md bg-white px-8 py-3 text-base font-medium text-indigo-600 border border-indigo-600 hover:bg-gray-50"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 