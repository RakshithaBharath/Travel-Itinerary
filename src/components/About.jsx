import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      className="p-8 max-w-5xl mx-auto text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold text-primary mb-4">About Us</h1>
      <p className="text-lg text-gray-500 mb-8">
        We craft extraordinary travel experiences powered by intelligent
        planning and premium support.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-2">Who We Are</h2>
          <p className="text-gray-600">Travelers. Dreamers. Tech Wizards.</p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-2">Why Us?</h2>
          <ul className="text-gray-600 list-disc list-inside">
            <li>Custom Plans for Every Trip</li>
            <li>Dedicated Travel Support 24/7</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
