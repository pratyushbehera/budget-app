import { motion } from "framer-motion";

export function GradientBlob() {
  return (
    <motion.div
      animate={{ y: [0, -30, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-20 left-10 w-72 h-72 bg-primary-400/30 blur-3xl rounded-full"
    />
  );
}
