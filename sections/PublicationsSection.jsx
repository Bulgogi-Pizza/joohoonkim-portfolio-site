import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiFileText } from 'react-icons/fi';

function PublicationsSection() {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    fetch('/api/publications/?status=published')
      .then(res => res.json())
      .then(data => setPublications(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="publications" className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-4">
              Recent Publications
            </h2>
            <div className="w-20 h-1 bg-brand-primary rounded-full" />
          </div>
          <a href="/publications" className="text-brand-primary font-semibold hover:text-brand-dark transition-colors flex items-center gap-2">
            View All Publications <FiArrowRight />
          </a>
        </motion.div>

        <div className="space-y-6">
          {publications.slice(0, 5).map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-brand-light rounded-xl p-6 border border-slate-100 hover:border-brand-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                    {pub.title}
                  </h3>
                  <p className="text-slate-600 mb-2 text-sm">
                    {pub.authors}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="font-medium text-brand-secondary">
                      {pub.journal}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">{pub.year}</span>
                  </div>
                </div>

                <div className="flex gap-3 shrink-0">
                  {pub.doi && (
                    <a
                      href={pub.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-brand-primary hover:bg-white rounded-lg transition-all"
                      title="DOI"
                    >
                      <FiExternalLink size={20} />
                    </a>
                  )}
                  {pub.pdf_link && (
                    <a
                      href={pub.pdf_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-brand-primary hover:bg-white rounded-lg transition-all"
                      title="PDF"
                    >
                      <FiFileText size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FiArrowRight() {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}

export default PublicationsSection;
