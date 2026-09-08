import React from "react";
import { motion } from "framer-motion";

export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <motion.div
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="bg-white dark:bg-[#0b1220] shadow-sm rounded-2xl p-5 flex items-start gap-4"
    >
      <div className="p-3 rounded-lg bg-accent/10 text-accent">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-textBody dark:text-gray-200">
          {title}
        </div>
        <div className="text-2xl font-bold text-primary dark:text-white">
          {value ?? "0"}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </div>
        )}
      </div>
    </motion.div>
  );
}
