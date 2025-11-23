import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { motion } from 'framer-motion';

function ResearchSection() {
  const [researchAreas, setResearchAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/research-areas/')
      .then(res => res.json())
      .then(data => setResearchAreas(data))
      .catch(err => console.error(err));
  }, []);

  const getIcon = (slug) => {
    switch (slug) {
      case 'metasurface': return <FiLayers className="w-8 h-8" />;
      case 'nanofabrication': return <FiCpu className="w-8 h-8" />;
      default: return <FiActivity className="w-8 h-8" />;
    }
  };

  return (
    <section id="research" className="py-24 bg-brand-light relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-4">
            Research Areas
          </h2>
          <div className="w-20 h-1 bg-brand-primary mx-auto rounded-full" />
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Exploring the frontiers of nanophotonics through advanced fabrication and design.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {researchAreas.map((area, index) => (
            <motion.div
              key={area.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              <div className="mb-6 p-4 bg-brand-light rounded-xl inline-block text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                {getIcon(area.slug)}
              </div>

              <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">
                {area.title}
              </h3>

              <p className="text-slate-600 mb-6 line-clamp-3">
                {area.description}
              </p>

              <a
                href={`/research/${area.slug}`}
                className="inline-flex items-center text-brand-primary font-semibold group-hover:gap-2 transition-all"
              >
                Learn more <FiArrowRight className="ml-2" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ResearchSection;
