import React from "react";
import "./infoCard.scss";

import { Link } from "react-router-dom";
import { motion } from "framer-motion"

function InfoCard({ info, number }) {
  return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1],
        }}
        transition={{
          duration: 0.2,
          delay: number * 0.1
        }}
      className="info-card">
        <div className="tag">
        </div>
        <h2>
          {info.title}
        </h2>
        <a href={info.link}>{info.link}</a>

        {/* <h4>{user.link}</h4> */}
      </motion.div>
  );
}

export default InfoCard;

