import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useSendRegisterOtpMutation,
  useVerifyOtpAndRegisterMutation,
} from "../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const RESEND_COOLDOWN = 60; // seconds

const Register = () => {
  const { register, handleSubmit } = useForm();
  const [sendRegisterOtp, { isLoading: isSendingOtp }] = useSendRegisterOtpMutation();
  const [verifyOtpAndRegister, { isLoading: isVerifying }] = useVerifyOtpAndRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [pendingData, setPendingData] = useState(null); // { name, email, password }
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmitDetails = async (data) => {
    try {
      await sendRegisterOtp(data).unwrap();
      setPendingData(data);
      setStep("otp");
      setCooldown(RESEND_COOLDOWN);
      toast.success("OTP sent to your email");
    } catch (error) {
      const errorMsg = error?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMsg);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }

    try {
      const response = await verifyOtpAndRegister({ ...pendingData, otp }).unwrap();

      if (response.success && response.data) {
        dispatch(setCredentials(response.data));
        toast.success("Welcome to ChronoLux");
        navigate("/");
      }
    } catch (error) {
      const errorMsg = error?.data?.message || "Invalid or expired OTP.";
      toast.error(errorMsg);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !pendingData) return;
    try {
      await sendRegisterOtp(pendingData).unwrap();
      setCooldown(RESEND_COOLDOWN);
      toast.success("OTP resent to your email");
    } catch (error) {
      const errorMsg = error?.data?.message || "Failed to resend OTP.";
      toast.error(errorMsg);
    }
  };

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen flex items-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">

        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-3">
            CHRONOLUX
          </p>

          <h1 className="text-4xl font-serif mb-3">
            {step === "form" ? "Create Account" : "Verify Your Email"}
          </h1>

          <p className="text-[#0b0b0c]/60">
            {step === "form"
              ? "Join the world of timeless luxury watches"
              : `Enter the 6-digit code sent to ${pendingData?.email}`}
          </p>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-6">

            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                {...register("name")}
                required
                className="w-full px-4 py-3 border border-[#c8a45c]/20 bg-white focus:border-[#a6813f] outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                {...register("email")}
                required
                className="w-full px-4 py-3 border border-[#c8a45c]/20 bg-white focus:border-[#a6813f] outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 border border-[#c8a45c]/20 bg-white focus:border-[#a6813f] outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0b0b0c]/50 hover:text-[#a6813f] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full bg-[#0b0b0c] hover:bg-[#a6813f] transition-all duration-300 text-white py-3 tracking-wide disabled:opacity-50"
            >
              {isSendingOtp ? "Sending OTP..." : "CONTINUE"}
            </button>
          </form>
        ) : (
          <form onSubmit={onSubmitOtp} className="space-y-6">

            <div>
              <label className="block text-sm font-medium mb-2">Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                autoFocus
                className="w-full px-4 py-3 border border-[#c8a45c]/20 bg-white focus:border-[#a6813f] outline-none transition-all tracking-[0.5em] text-center text-lg"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#0b0b0c] hover:bg-[#a6813f] transition-all duration-300 text-white py-3 tracking-wide disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "VERIFY & CREATE ACCOUNT"}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="text-[#0b0b0c]/60 hover:underline"
              >
                &larr; Edit details
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="text-[#a6813f] font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-8">
          <p className="text-[#0b0b0c]/60">
            Already have an account?{" "}
            <Link to="/login" className="text-[#a6813f] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;