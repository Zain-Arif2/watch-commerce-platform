import React from "react";
import { ShieldCheck, Wrench, Clock, FileCheck } from "lucide-react";
import Seo from "../components/Seo";

const warrantyInfo = [
  {
    icon: <ShieldCheck size={22} />,
    title: "2-Year International Coverage",
    text: "Every watch sold by ChronoLux includes a minimum 2-year international warranty against manufacturing defects.",
  },
  {
    icon: <Wrench size={22} />,
    title: "Authorized Servicing",
    text: "Repairs are carried out exclusively by manufacturer-authorized watchmakers to preserve the integrity and value of your timepiece.",
  },
  {
    icon: <Clock size={22} />,
    title: "Extended Warranty Options",
    text: "Selected brands offer extended warranty plans of up to 5 years, available for purchase at checkout.",
  },
  {
    icon: <FileCheck size={22} />,
    title: "Warranty Documentation",
    text: "Your warranty card and certificate of authenticity are issued at the time of purchase and required for any future claims.",
  },
];

const Warranty = () => {
  return (
    <>
      <Seo
        title="Warranty Information - ChronoLux Luxury Watches"
        description="Every ChronoLux watch includes a minimum 2-year international warranty. Learn about coverage, authorized servicing, and how to file a claim."
        path="/warranty"
      />
      <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-3 md:mb-4">
              OUR PROMISE
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 md:mb-6 leading-tight">
              Warranty
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed px-2">
              Every ChronoLux timepiece is backed by a comprehensive warranty,
              giving you complete confidence in your investment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-12 md:mb-16">
            {warrantyInfo.map((item) => (
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
              What's Not Covered
            </h2>
            <p className="text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed">
              Our warranty does not cover damage resulting from accidents, misuse,
              unauthorized servicing, normal wear and tear (such as strap or
              crystal scratches), or water damage exceeding the watch's rated
              resistance. For any warranty claim, please contact our concierge
              team with your certificate of authenticity and proof of purchase.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Warranty;