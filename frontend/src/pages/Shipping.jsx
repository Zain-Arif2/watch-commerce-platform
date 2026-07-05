import React from "react";
import { Truck, PackageCheck, RotateCcw, Globe } from "lucide-react";
import Seo from "../components/Seo";

const shippingInfo = [
  {
    icon: <Truck size={22} />,
    title: "Delivery Times",
    text: "Domestic orders arrive within 2-4 business days. International orders typically take 5-10 business days depending on destination and customs processing.",
  },
  {
    icon: <PackageCheck size={22} />,
    title: "Secure & Insured Packaging",
    text: "Every watch is shipped fully insured in discreet, tamper-evident packaging with signature required upon delivery.",
  },
  {
    icon: <Globe size={22} />,
    title: "International Shipping",
    text: "We ship to over 40 countries worldwide. Import duties and taxes, where applicable, are the responsibility of the recipient.",
  },
  {
    icon: <RotateCcw size={22} />,
    title: "Easy Returns",
    text: "Unworn watches in original condition with all packaging and documentation may be returned within 14 days of delivery for a full refund.",
  },
];

const Shipping = () => {
  return (
    <>
      <Seo
        title="Shipping & Returns - Luxury Watch Delivery Policy"
        description="Learn about ChronoLux's insured worldwide shipping, delivery timeframes, and 14-day return policy for luxury watches."
        path="/shipping"
      />
      <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-3 md:mb-4">
              CUSTOMER CARE
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 md:mb-6 leading-tight">
              Shipping &amp; Returns
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed px-2">
              We take great care in getting your timepiece to you safely, and
              we're just as committed to making returns simple should you need one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-12 md:mb-16">
            {shippingInfo.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-[#c8a45c]/20 rounded-sm p-5 sm:p-7 transition duration-300 hover:border-[#a6813f] hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#c8a45c]/10 border border-[#c8a45c]/20 flex items-center justify-center text-[#a6813f] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      {item.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#c8a45c]/20 p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6">
              How Our Return Process Works
            </h2>
            <ol className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed list-decimal list-inside">
              <li>Contact our concierge team within 14 days of delivery to request a return authorization.</li>
              <li>Repackage the watch securely with all original documentation and accessories included.</li>
              <li>Ship the item back using the prepaid, insured shipping label provided by our team.</li>
              <li>Once inspected, your refund will be processed to the original payment method within 5-7 business days.</li>
            </ol>
          </div>
        </div>
      </main>
    </>
  );
};

export default Shipping;