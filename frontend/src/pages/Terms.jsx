import React from "react";
import Seo from "../components/Seo";

const sections = [
  {
    title: "1. Acceptance of Terms",
    text: "By accessing and using the ChronoLux website, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.",
  },
  {
    title: "2. Products & Pricing",
    text: "All prices are listed in USD unless otherwise stated and are subject to change without notice. We make every effort to ensure product descriptions and pricing are accurate, but errors may occasionally occur.",
  },
  {
    title: "3. Orders & Payment",
    text: "All orders are subject to acceptance and availability. Payment must be received in full before an order is processed and shipped. We reserve the right to refuse or cancel any order at our discretion.",
  },
  {
    title: "4. Shipping & Delivery",
    text: "Estimated delivery times are provided for guidance only and are not guaranteed. Please refer to our Shipping & Returns page for full details on delivery and return policies.",
  },
  {
    title: "5. Intellectual Property",
    text: "All content on this website, including images, logos, and text, is the property of ChronoLux and may not be reproduced without prior written consent.",
  },
  {
    title: "6. Limitation of Liability",
    text: "ChronoLux shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our products or website.",
  },
  {
    title: "7. Changes to Terms",
    text: "We reserve the right to update these Terms & Conditions at any time. Continued use of our website following any changes constitutes acceptance of the revised terms.",
  },
  {
    title: "8. Contact Us",
    text: "If you have any questions regarding these Terms & Conditions, please reach out to our concierge team via our Contact page.",
  },
];

const Terms = () => {
  return (
    <>
      <Seo
        title="Terms & Conditions - ChronoLux"
        description="Read ChronoLux's Terms & Conditions covering orders, pricing, shipping, intellectual property, and use of our luxury watch website."
        path="/terms"
      />
      <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-3 md:mb-4">
              LEGAL
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 md:mb-6 leading-tight">
              Terms &amp; Conditions
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed px-2">
              Last updated: July 2026. Please read these terms carefully before
              using the ChronoLux website.
            </p>
          </div>

          <div className="bg-white border border-[#c8a45c]/20 p-6 sm:p-10 space-y-8 sm:space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-3">
                  {section.title}
                </h2>
                <p className="text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Terms;