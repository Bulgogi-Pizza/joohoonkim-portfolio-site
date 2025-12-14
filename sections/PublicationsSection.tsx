'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiFileText, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function PublicationsSection() {
    const [publications, setPublications] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/publications')
            .then(res => res.json())
            .then(data => setPublications(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <section id="publications" className="py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Selected Publications
                        </h2>
                        <div className="w-20 h-1 bg-blue-600 rounded-full" />
                    </div>
                    <Link href="/publications" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-2">
                        View All Publications <FiArrowRight />
                    </Link>
                </motion.div>

                <div className="space-y-6">
                    {publications.slice(0, 5).map((pub, index) => (
                        <motion.div
                            key={pub.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {pub.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                                        {pub.authors}
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                            {pub.journal}
                                        </span>
                                        <span className="text-gray-400">|</span>
                                        <span className="text-gray-500 dark:text-gray-500">{pub.year}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 shrink-0">
                                    {pub.doi && (
                                        <a
                                            href={`https://doi.org/${pub.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all"
                                            title="DOI"
                                        >
                                            <FiExternalLink size={20} />
                                        </a>
                                    )}
                                    {pub.arxiv && (
                                        <a
                                            href={pub.arxiv}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all"
                                            title="arXiv"
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
