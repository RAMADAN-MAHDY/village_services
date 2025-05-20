"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ServiceDescription: React.FC<{ description: string }> = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const shortText = description.substring(0, 100);

  return (
    <div>
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 200, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-y-auto text-sm text-gray-700 bg-gray-100 p-2 rounded"
          >
            {description}
          </motion.div>
        ) : (
          <motion.p
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-gray-600"
          >
            {shortText}
          </motion.p>
        )}
      </AnimatePresence>

      {description.length > 100 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:underline mt-2"
        >
          {expanded ? "اختصار" : "عرض المزيد"}
        </button>
      )}
    </div>
  );
};

export default ServiceDescription;
