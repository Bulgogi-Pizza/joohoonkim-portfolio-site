import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function MediaSection() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/media/')
    .then(res => res.json())
    .then(data => {
      // 최신 3개만 가져오기
      setMediaItems(data.slice(0, 3));
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching media:', error);
      setLoading(false);
    });
  }, []);

  const getCategoryStyle = (category) => {
    const styles = {
      'news': {
        class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        icon: '📰'
      },
      'interview': {
        class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        icon: '🎤'
      },
      'feature': {
        class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        icon: '⭐'
      },
      'press-release': {
        class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        icon: '📢'
      }
    };
    return styles[category] || {
      class: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      icon: '📄'
    };
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US',
        {year: 'numeric', month: 'short', day: 'numeric'});
  };

  if (loading) {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading media
                coverage...</p>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 lg:px-8">
          {/* 섹션 헤더 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Media Coverage
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Featured stories and media coverage highlighting breakthrough
              research achievements.
            </p>
          </div>

          {/* 미디어 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {mediaItems.map((item, index) => {
              const categoryInfo = getCategoryStyle(item.category);

              return (
                  <article
                      key={item.id}
                      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* 이미지 영역 */}
                    <div className="aspect-video overflow-hidden relative">
                      {item.image_url ? (
                          <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                      ) : (
                          <div
                              className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                            <div className="text-6xl">{categoryInfo.icon}</div>
                          </div>
                      )}
                      <div
                          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${categoryInfo.class}`}>
                      <span className="mr-1">{categoryInfo.icon}</span>
                      {item.category.replace('-', ' ').replace(/\b\w/g,
                          l => l.toUpperCase())}
                    </span>
                      </div>
                    </div>

                    {/* 콘텐츠 영역 */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                    <span
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {item.source}
                    </span>
                        <time
                            className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(item.date)}
                        </time>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>

                      {item.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                            {item.description}
                          </p>
                      )}

                      {/* 액션 버튼 */}
                      {item.url ? (
                          <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm group/link"
                          >
                            Read Article
                            <svg
                                className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform"
                                fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                          </a>
                      ) : (
                          <span
                              className="text-gray-400 text-sm">Coming Soon</span>
                      )}
                    </div>
                  </article>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
                to="/media"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Media Coverage
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
  );
}

export default MediaSection;
