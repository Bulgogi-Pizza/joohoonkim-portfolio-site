import React, { useEffect, useState } from "react";
import HorizontalGallery from "../components/HorizontalGallery";
import { useNavigate } from "react-router-dom";

const normalizeLink = (href = "") => {
  if (!href) {
    return "";
  }
  const t = href.trim();
  if (/^mailto:|^tel:/i.test(t)) {
    return t;
  }
  if (/^https?:\/\//i.test(t)) {
    return t;
  }
  if (t.startsWith("//")) {
    return `${window.location.protocol}${t}`;
  }
  if (/^[\w.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(t)) {
    return `https://${t}`;
  }
  return t;
};
const isExternal = (href = "") =>
  /^https?:\/\//i.test(normalizeLink(href)) || /^mailto:|^tel:/i.test(
    href.trim());

function useCardLink() {
  const nav = useNavigate();
  const openLink = (link) => {
    if (!link) {
      return;
    }
    const target = normalizeLink(link);
    if (isExternal(target)) {
      window.open(target, "_blank", "noopener");
    } else {
      nav(target.startsWith("/") ? target : `/${target}`);
    }
  };
  const keyActivate = (e, link) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      import React, { useEffect, useState, useRef } from "react";
      import { motion } from 'framer-motion';

      function CoverArtsSection() {
        const [coverArts, setCoverArts] = useState([]);
        const scrollRef = useRef(null);

        useEffect(() => {
          fetch('/api/cover-arts/?active_only=1')
            .then(res => res.json())
            .then(data => setCoverArts(data))
            .catch(err => console.error(err));
        }, []);

        return (
          <section className="py-24 bg-brand-light overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-4">
                  Featured Cover Arts
                </h2>
                <div className="w-20 h-1 bg-brand-accent mx-auto rounded-full" />
              </motion.div>
            </div>

            {/* Infinite Scroll Container */}
            <div className="relative w-full">
              <div className="flex gap-8 animate-scroll hover:pause px-4">
                {[...coverArts, ...coverArts].map((art, index) => (
                  <motion.div
                    key={`${art.id}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-[300px] md:w-[400px] relative group rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img
                        src={art.image_path}
                        alt={art.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-brand-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                        <div>
                          <h3 className="text-white font-bold text-lg mb-2">{art.title}</h3>
                          <p className="text-brand-accent text-sm">{art.journal} {art.year}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <style jsx>{`
          .pause {
            animation-play-state: paused;
          }
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
            width: max-content;
          }
        `}</style>
          </section>
        );
      }

      export default CoverArtsSection;