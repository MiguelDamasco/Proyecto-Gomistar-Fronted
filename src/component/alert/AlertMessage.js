import { motion } from "framer-motion";

const AlertMessage = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.5 }}
      className={`alert ${type}`}
    >
      <p>{message}</p>
      <button onClick={onClose}>X</button>
    </motion.div>
  );
};

export default AlertMessage;