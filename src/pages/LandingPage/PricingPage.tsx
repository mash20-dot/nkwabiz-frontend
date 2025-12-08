import React, { useState, Fragment } from "react";
import SEO from "../../pages/LandingPage/SEO";
import Navbar from "../../components/LandingPage/Navbar";
import Footer from "../../components/LandingPage/Footer";
import { Check, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const plans = [
    {
      name: "Starter",
      description: "Perfect for new and small businesses",
      monthlyPrice: "₵49",
      yearlyPrice: "₵470",
      yearlyDiscount: "Save ₵118",
      features: [
        "Up to 500 products",
        "500 SMS credits/month",
        "Basic inventory management",
        "Sales tracking",
        "2 user accounts",
        "Email support",
        "Mobile access",
      ],
      cta: "Start your free trial",
      highlighted: false,
    },
    {
      name: "Standard",
      description: "Ideal for growing businesses",
      monthlyPrice: "₵99",
      yearlyPrice: "₵950",
      yearlyDiscount: "Save ₵238",
      features: [
        "Unlimited products",
        "2,000 SMS credits/month",
        "Advanced inventory management",
        "Sales & revenue analytics",
        "Low stock alerts",
        "Bulk SMS campaigns",
        "5 user accounts",
        "Priority email support",
        "Customer management",
        "Offline mode",
      ],
      cta: "Start your free trial",
      highlighted: true,
    },
    {
      name: "Premium",
      description: "For established businesses with multiple locations",
      monthlyPrice: "₵199",
      yearlyPrice: "₵1,990",
      yearlyDiscount: "Save ₵398",
      features: [
        "Everything in Standard",
        "5,000 SMS credits/month",
        "Multiple store locations",
        "Advanced SMS automation",
        "Advanced analytics & reports",
        "Unlimited user accounts",
        "24/7 priority support",
        "Dedicated account manager",
        "API access",
        "Custom integrations",
      ],
      cta: "Contact sales",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes, we offer a 14-day free trial for all our plans with 100 free SMS credits. No credit card required to get started.",
    },
    {
      question: "How does SMS pricing work?",
      answer:
        "Each plan includes monthly SMS credits. Additional SMS can be purchased at competitive rates. Unused credits roll over to the next month.",
    },
    {
      question: "Can I change plans later?",
      answer:
        "Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle.",
    },
    {
      question: "Is there a setup fee?",
      answer:
        "No, there are no setup fees for any of our plans. You only pay the advertised subscription price.",
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer:
        "Yes, we offer special pricing for registered non-profit organizations. Please contact our sales team for more information.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, mobile money, and bank transfers for annual plans.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "Yes, you can cancel your subscription at any time. If you cancel, you'll have access to NkwaBiz until the end of your current billing period.",
    },
    {
      question: "What happens if I run out of SMS credits?",
      answer:
        "You can purchase additional SMS credits at any time. We'll also notify you when you're running low so you never miss important customer communications.",
    },
  ];

  return (
    <>
      <SEO
        title="Pricing - Affordable Bulk SMS & Business Management Plans | Nkwabiz Ghana"
        description="Transparent pricing for bulk SMS and business management in Ghana. Plans start at ₵49/month with SMS credits included. 14-day free trial. No setup fees."
        canonical="https://www.nkwabiz.com/pricing"
        keywords="bulk sms pricing ghana, sms rates ghana, affordable business software, inventory management pricing, sms marketing cost ghana, business management plans"
      />

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-blue-700 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Simple, transparent pricing
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                Choose the plan that's right for your business. All plans include
                bulk SMS credits and a 14-day free trial.
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Billing Toggle */}
              <div className="flex justify-center">
                <div className="relative bg-gray-100 p-1 rounded-lg inline-flex">
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`${billingPeriod === "monthly"
                        ? "bg-white shadow-sm"
                        : "bg-transparent"
                      } relative py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200`}
                  >
                    Monthly billing
                  </button>
                  <button
                    onClick={() => setBillingPeriod("yearly")}
                    className={`${billingPeriod === "yearly"
                        ? "bg-white shadow-sm"
                        : "bg-transparent"
                      } relative py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200`}
                  >
                    Annual billing
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="mt-12 grid gap-8 lg:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative flex flex-col rounded-2xl border ${plan.highlighted
                        ? "border-blue-600 shadow-xl"
                        : "border-gray-200"
                      } p-8`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white">
                        Most Popular
                      </div>
                    )}
                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-gray-900">
                        {plan.name}
                      </h3>
                      <p className="mt-2 text-gray-500">{plan.description}</p>
                    </div>
                    <div className="mb-5">
                      <p className="text-5xl font-bold text-gray-900">
                        {billingPeriod === "monthly"
                          ? plan.monthlyPrice
                          : plan.yearlyPrice}
                      </p>
                      <p className="mt-1 text-gray-500">
                        per {billingPeriod === "monthly" ? "month" : "year"}
                      </p>
                      {billingPeriod === "yearly" && (
                        <p className="mt-1 text-sm text-green-600 font-medium">
                          {plan.yearlyDiscount}
                        </p>
                      )}
                    </div>
                    <ul className="mb-8 space-y-4 flex-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="ml-3 text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={plan.cta === "Contact sales" ? "#" : "/login"}
                      className={`w-full rounded-md py-3 px-5 text-center text-base font-medium ${plan.highlighted
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Compare plans in detail
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Find the plan that best fits your business needs.
                </p>
              </div>
              <div className="mt-12 overflow-hidden">
                <div className="relative">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Features
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                        >
                          Starter
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-center text-sm font-semibold text-blue-700 bg-blue-50 rounded-t-lg"
                        >
                          Standard
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                        >
                          Premium
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          category: "Bulk SMS Marketing",
                          features: [
                            {
                              name: "Monthly SMS credits",
                              starter: "500",
                              standard: "2,000",
                              premium: "5,000",
                            },
                            {
                              name: "SMS campaign scheduling",
                              starter: "—",
                              standard: "✓",
                              premium: "✓",
                            },
                            {
                              name: "Contact list management",
                              starter: "Basic",
                              standard: "Advanced",
                              premium: "Advanced",
                            },
                            {
                              name: "SMS delivery reports",
                              starter: "—",
                              standard: "✓",
                              premium: "✓",
                            },
                            {
                              name: "SMS automation",
                              starter: "—",
                              standard: "—",
                              premium: "✓",
                            },
                          ],
                        },
                        {
                          category: "Inventory Management",
                          features: [
                            {
                              name: "Product listings",
                              starter: "500",
                              standard: "Unlimited",
                              premium: "Unlimited",
                            },
                            {
                              name: "Categories and tags",
                              starter: "Basic",
                              standard: "Advanced",
                              premium: "Advanced",
                            },
                            {
                              name: "Low stock alerts",
                              starter: "—",
                              standard: "✓",
                              premium: "✓",
                            },
                            {
                              name: "Barcode scanning",
                              starter: "—",
                              standard: "✓",
                              premium: "✓",
                            },
                            {
                              name: "Multiple locations",
                              starter: "—",
                              standard: "—",
                              premium: "✓",
                            },
                          ],
                        },
                        {
                          category: "Sales & Analytics",
                          features: [
                            {
                              name: "Sales recording",
                              starter: "Basic",
                              standard: "Advanced",
                              premium: "Advanced",
                            },
                            {
                              name: "Revenue reports",
                              starter: "Basic",
                              standard: "Detailed",
                              premium: "Custom",
                            },
                            {
                              name: "Sales trends",
                              starter: "—",
                              standard: "✓",
                              premium: "✓",
                            },
                            {
                              name: "Product performance",
                              starter: "—",
                              standard: "✓",
                              premium: "✓",
                            },
                            {
                              name: "Export reports",
                              starter: "—",
                              standard: "✓",
                              premium: "✓",
                            },
                          ],
                        },
                        {
                          category: "Users & Support",
                          features: [
                            {
                              name: "User accounts",
                              starter: "2",
                              standard: "5",
                              premium: "Unlimited",
                            },
                            {
                              name: "Role-based access",
                              starter: "—",
                              standard: "✓",
                              premium: "✓",
                            },
                            {
                              name: "Customer support",
                              starter: "Email",
                              standard: "Priority email",
                              premium: "24/7 priority",
                            },
                            {
                              name: "Account manager",
                              starter: "—",
                              standard: "—",
                              premium: "✓",
                            },
                            {
                              name: "Training sessions",
                              starter: "—",
                              standard: "1",
                              premium: "Unlimited",
                            },
                          ],
                        },
                      ].map((section) => (
                        <Fragment key={section.category}>
                          <tr className="border-b border-gray-200">
                            <th
                              colSpan={4}
                              scope="colgroup"
                              className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 bg-gray-100 sm:pl-0"
                            >
                              {section.category}
                            </th>
                          </tr>
                          {section.features.map((feature) => (
                            <tr
                              key={feature.name}
                              className="border-b border-gray-200"
                            >
                              <td className="py-3.5 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                                <div className="flex items-center">
                                  {feature.name}
                                  <HelpCircle className="ml-1.5 h-4 w-4 text-gray-400" />
                                </div>
                              </td>
                              <td className="px-3 py-3.5 text-center text-sm text-gray-500">
                                {feature.starter}
                              </td>
                              <td className="px-3 py-3.5 text-center text-sm text-gray-900 bg-blue-50">
                                {feature.standard}
                              </td>
                              <td className="px-3 py-3.5 text-center text-sm text-gray-500">
                                {feature.premium}
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Section */}
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-blue-700 rounded-2xl shadow-xl overflow-hidden">
                <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                  <div className="lg:self-center">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                      <span className="block">Need unlimited SMS or a custom solution?</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-blue-200">
                      Our Enterprise plan is designed for larger businesses with
                      high SMS volume and specific needs. Get unlimited SMS, custom features, dedicated support, and
                      tailored onboarding.
                    </p>
                    <a
                      href="#"
                      className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-blue-700 hover:bg-blue-50"
                    >
                      Contact our sales team
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center">
                  Frequently asked questions
                </h2>
                <dl className="mt-10 space-y-6 divide-y divide-gray-200">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="pt-6">
                      <dt className="text-lg font-medium text-gray-900">
                        {faq.question}
                      </dt>
                      <dd className="mt-2 text-base text-gray-500">
                        {faq.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-700">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to start sending bulk SMS?</span>
                <span className="block text-blue-200">
                  Start your free 14-day trial with 100 SMS credits today.
                </span>
              </h2>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                  >
                    Get started
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PricingPage;