import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import Seo from "../components/Seo";

const faqs = [
  {
    question: "How do I know if a luxury watch is authentic?",
    answer:
      "Every timepiece we sell is verified by our in-house horologists and comes with a certificate of authenticity, original packaging, and manufacturer documentation where available. We never source from unauthorized dealers.",
  },
  {
    question: "Do you offer international shipping for watch orders?",
    answer:
      "Yes, we ship worldwide via fully insured courier services. Delivery times and customs duties vary by destination country. See our Shipping & Returns page for details by region.",
  },
  {
    question: "What is your return policy on luxury timepieces?",
    answer:
      "Unworn watches in original condition can be returned within 14 days of delivery, with all packaging and documentation included. Full details are on our Shipping & Returns page.",
  },
  {
    question: "Do ChronoLux watches come with a warranty?",
    answer:
      "All watches include a minimum 2-year international warranty covering manufacturing defects. Select brands offer extended coverage of up to 5 years.",
  },
  {
    question: "Can I request a private viewing or consultation?",
    answer:
      "Absolutely. Our concierge team can arrange private appointments at our Geneva boutique or virtual consultations for remote clients anywhere in the world.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, bank wire transfers, and secure online payments through Stripe, with encrypted checkout on every order.",
  },
  {
    question: "How do you determine the price of a luxury watch?",
    answer:
      "Pricing reflects brand, model rarity, condition, and current market demand. Our specialists regularly benchmark against auction results and dealer networks to keep prices fair.",
  },
  {
    question: "Do you buy or trade in used watches?",
    answer:
      "Yes, we offer appraisals and trade-in credit toward your next purchase. Contact our concierge team with photos and details of your timepiece to begin.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <Seo
        title="FAQ - Luxury Watch Buying, Shipping & Authenticity"
        description="Answers to common questions about buying luxury watches from ChronoLux, including authenticity, shipping, returns, warranty, and payment options."
        path="/faq"
      />
      <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-3 md:mb-4">
              SUPPORT
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 md:mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed px-2">
              Answers to the questions we hear most from our clients about
              buying, shipping, and caring for luxury watches. Can't find
              what you're looking for? Our concierge team is happy to help.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className="bg-white border border-[#c8a45c]/20 rounded-sm transition duration-300 hover:border-[#a6813f]/50"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-7 text-left"
                  >
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#c8a45c]/10 border border-[#c8a45c]/20 flex items-center justify-center text-[#a6813f] shrink-0">
                        <HelpCircle size={20} />
                      </div>
                      <h2 className="text-base sm:text-lg font-semibold">
                        {faq.question}
                      </h2>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#a6813f] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-52 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="px-5 sm:px-7 pb-5 sm:pb-7 pl-[4.25rem] sm:pl-[5.25rem] text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default FAQ;