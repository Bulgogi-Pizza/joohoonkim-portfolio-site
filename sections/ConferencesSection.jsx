import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ConferencesSection() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/conferences/')
      .then(res => res.json())
      .then(data => {
        // 최신 3개만 가져오기
        setConferences(data.slice(0, 3));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching conferences:', error);
        setLoading(false);
      });
  }, []);

  const getTypeStyle = (type) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('keynote') || lowerType.includes('plenary')) {
      return {
        class: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
        icon: '🎤'
      };
    } else if (lowerType.includes('invited')) {
      return {
        class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        icon: '🌟'
      };
    } else if (lowerType.includes('oral')) {
      return {
        class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        icon: '🗣️'
      };
    }
    return {
      class: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      icon: '📋'
    };
  };

  const formatDate = (dateStr) => {
    const [year, month] = dateStr.split('-');
    if (month) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return year;
  };

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading
              conferences...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Conferences
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Latest speaking engagements and research presentations at premier
            scientific conferences.
          </p>
        </div>

        {/* 컨퍼런스 리스트 */}
        <div className="space-y-6 mb-12">
          {conferences.map((conference, index) => {
            const typeInfo = getTypeStyle(conference.presentation_type);

            return (
              <div
                key={conference.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      {/* 발표 타입 배지 */}
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${typeInfo.class}`}>
                        <span className="mr-2">{typeInfo.icon}</span>
                        {conference.presentation_type}
                      </span>

                      {/* 수상 배지 */}
                      {conference.award && (
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                          🏆 {conference.award}
                        </span>
                      )}

                      {/* 날짜 */}
                      <span
                        className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {formatDate(conference.date)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {conference.title}
                    </h3>

                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                      {conference.conference_name}
                    </p>

                    <div
                      className="flex items-center text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0"
                        fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{conference.location}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="text-3xl">{typeInfo.icon}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/conferences"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View All Conferences
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ConferencesSection;
