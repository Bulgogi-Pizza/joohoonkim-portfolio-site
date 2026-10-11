import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownContent({ content }: { content: string }) {
    return (
        <div className="text-left">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    img: ({ node, ...props }) => (
                        <img {...props} className="mx-auto my-8 rounded-xl border border-line dark:border-dark-line shadow-elev dark:shadow-none max-h-96 w-auto" loading="lazy" />
                    ),
                    a: ({ node, ...props }) => (
                        <a {...props} className="text-accent dark:text-dark-accent hover:opacity-70 underline underline-offset-2 break-words transition-opacity" target="_blank" rel="noopener noreferrer" />
                    ),
                    h1: ({ node, ...props }) => (
                        <h1 {...props} className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-ink dark:text-dark-ink mb-4 mt-10 first:mt-0" />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 {...props} className="font-heading text-xl md:text-2xl font-bold tracking-tight text-ink dark:text-dark-ink mb-4 mt-10 first:mt-0" />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 {...props} className="font-heading text-lg md:text-xl font-bold text-ink dark:text-dark-ink mb-3 mt-8 first:mt-0" />
                    ),
                    p: ({ node, ...props }) => (
                        <p {...props} className="text-base text-ink-2 dark:text-dark-ink-2 leading-relaxed mb-5" />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul {...props} className="list-disc ml-6 mb-5 space-y-2" />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol {...props} className="list-decimal ml-6 mb-5 space-y-2" />
                    ),
                    li: ({ node, ...props }) => (
                        <li {...props} className="text-base text-ink-2 dark:text-dark-ink-2 leading-relaxed" />
                    ),
                    strong: ({ node, ...props }) => (
                        <strong {...props} className="font-semibold text-ink dark:text-dark-ink" />
                    ),
                    code: ({ node, inline, ...props }: any) => (
                        inline ?
                            <code {...props} className="bg-line/50 dark:bg-white/10 text-ink dark:text-dark-ink px-1.5 py-0.5 rounded font-mono text-sm" /> :
                            <code {...props} className="block bg-line/30 dark:bg-white/5 border border-line dark:border-dark-line text-ink dark:text-dark-ink p-4 rounded-xl overflow-x-auto font-mono text-sm" />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote {...props} className="border-l-2 border-accent dark:border-dark-accent pl-4 italic text-ink-3 dark:text-dark-ink-3 my-6" />
                    ),
                    hr: ({ node, ...props }) => (
                        <hr {...props} className="my-8 border-line dark:border-dark-line" />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
