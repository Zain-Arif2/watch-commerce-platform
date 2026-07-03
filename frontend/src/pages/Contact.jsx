import React from "react";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Send } from "lucide-react";

const Contact = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Thank you for contacting CHRONOLUX.");
    reset();
  };

  const contactInfo = [
    {
      icon: <MapPin size={22} />,
      title: "Visit Our Boutique",
      text: "12 Rue de la Paix, Geneva, Switzerland",
    },
    {
      icon: <Phone size={22} />,
      title: "Call Us",
      text: "+41 22 123 4567",
    },
    {
      icon: <Mail size={22} />,
      title: "Email",
      text: "concierge@chronolux.com",
    },
  ];

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">

        {/* Hero */}
        <div className="text-center mb-12 md:mb-20">
          <p className="text-[10px] sm:text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-3 md:mb-4">
            CONTACT US
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 md:mb-6 leading-tight">
            Let's Start a Conversation
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed px-2">
            Whether you're searching for your next luxury timepiece or need
            assistance with an existing order, our concierge team is always
            ready to help.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Left Column (Contact Info) */}
          <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-[#c8a45c]/20 rounded-sm p-5 sm:p-7 transition duration-300 hover:border-[#a6813f] hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#c8a45c]/10 border border-[#c8a45c]/20 flex items-center justify-center text-[#a6813f] shrink-0">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#0b0b0c]/60 break-all sm:break-normal">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Extra Card */}
            <div className="bg-white border border-[#c8a45c]/20 p-6 sm:p-8 mt-6 sm:mt-8">
              <h3 className="text-xl sm:text-2xl font-serif mb-3 sm:mb-4">
                Concierge Service
              </h3>
              <p className="text-sm sm:text-base text-[#0b0b0c]/60 leading-relaxed">
                Our dedicated watch specialists are available Monday through
                Saturday to answer your questions regarding availability,
                authentication, sourcing, and private appointments.
              </p>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="bg-white border border-[#c8a45c]/20 shadow-[0_2px_20px_rgba(0,0,0,.04)] p-6 sm:p-10 order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl font-serif mb-6 sm:mb-8">
              Send Us a Message
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >
              <div>
                <label className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium">
                  Full Name
                </label>
                <input
                  {...register("name")}
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full border border-[#c8a45c]/20 bg-[#faf9f6] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base outline-none transition-all duration-300 focus:border-[#a6813f]"
                />
              </div>

              <div>
                <label className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full border border-[#c8a45c]/20 bg-[#faf9f6] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base outline-none transition-all duration-300 focus:border-[#a6813f]"
                />
              </div>

              <div>
                <label className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium">
                  Subject
                </label>
                <input
                  {...register("subject")}
                  placeholder="Luxury Watch Inquiry"
                  className="w-full border border-[#c8a45c]/20 bg-[#faf9f6] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base outline-none transition-all duration-300 focus:border-[#a6813f]"
                />
              </div>

              <div>
                <label className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium">
                  Message
                </label>
                <textarea
                  {...register("message")}
                  rows={5}
                  required
                  placeholder="Tell us how we can assist you..."
                  className="w-full border border-[#c8a45c]/20 bg-[#faf9f6] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base outline-none resize-none transition-all duration-300 focus:border-[#a6813f]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0b0b0c] hover:bg-[#a6813f] transition-all duration-300 text-white py-3 sm:py-4 flex items-center justify-center gap-3 text-sm sm:text-base tracking-wider font-medium"
              >
                <Send size={16} />
                SEND MESSAGE
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Contact;