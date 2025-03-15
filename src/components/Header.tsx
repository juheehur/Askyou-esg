import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              AskYou
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              <Link
                href="/about"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                About
              </Link>
              <Link
                href="/features"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <Link
              href="/demo"
              className="inline-block bg-indigo-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700"
            >
              Try Demo
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-white py-2 px-4 border border-indigo-600 rounded-md text-base font-medium text-indigo-600 hover:bg-gray-50"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          <Link
            href="/about"
            className="text-base font-medium text-gray-500 hover:text-gray-900"
          >
            About
          </Link>
          <Link
            href="/features"
            className="text-base font-medium text-gray-500 hover:text-gray-900"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-base font-medium text-gray-500 hover:text-gray-900"
          >
            Pricing
          </Link>
        </div>
      </nav>
    </header>
  );
} 