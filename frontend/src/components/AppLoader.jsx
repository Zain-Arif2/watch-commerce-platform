import { Watch } from "lucide-react";
import { motion } from "framer-motion";

const AppLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0b0c]">
      <div className="flex flex-col items-center">

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Watch
            size={56}
            strokeWidth={1.5}
            className="text-[#c8a45c]"
          />
        </motion.div>

        <h1 className="mt-6 text-3xl font-serif tracking-[0.2em] text-[#f5f1e8]">
          CHRONO<span className="text-[#c8a45c]">LUX</span>
        </h1>

        <p className="mt-2 text-xs tracking-[0.3em] uppercase text-[#c8a45c]">
          Loading...
        </p>

      </div>
    </div>
  );
};

export default AppLoader;