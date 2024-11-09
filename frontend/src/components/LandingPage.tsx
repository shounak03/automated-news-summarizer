import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Article {
    id: string;
    title: string;
    url: string;
    author: string;
}

const LandingPage = () => {


    const [data, setData] = useState<Article[]>([]);
    const fetchData = async () => {
        await fetch(`https://newsapi.org/v2/top-headlines?language=en&apiKey=1cb06dbd21774e88aa8650851de9fe63`)
            .then(res => res.json())
            .then(data => setData(data.articles))
    }
    useEffect(() => {
        fetchData();
    }, [fetchData]);

   

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200">
                        Your daily dose of Latest news
                    </h1>

                </div>
            </div>


            <div className="container mx-auto px-4 py-8">
                {  /*  <div className="flex flex-col md:flex-row gap-4 items-center mb-8">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>


          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${selectedCategory === category 
                    ? 'bg-purple-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-purple-600 hover:bg-purple-50'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div> */}


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((article) => (
                        <Card
                            key={article?.id}
                            className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-t-4 border-t-purple-500 group"
                        >
                            {/* Category Tag */}
                            {/* <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                  {article.category}
                </span>
                {article.trending && (
                  <span className="flex items-center text-red-500 text-sm">
                    <TrendingUp size={16} className="mr-1" />
                    Trending
                  </span>
                )}
              </div> */}

                            {/* Article Title */}
                            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200 mb-4">
                                {article?.title}
                                <br />

                            </h2>
                            <span className='p-2 mt-4'> - {article?.author}</span>

                            {/* Article Footer */}
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-purple-100">
                                {/* <span className="flex items-center text-gray-500 text-sm">
                  <Clock size={16} className="mr-1" />
                  {article.readTime} read
                </span> */}
                                <Link
                                    to={`/${encodeURIComponent(article?.title)}`}
                                    className="flex items-center text-purple-600 font-medium text-sm group-hover:gap-2 transition-all"
                                    state={{ url: article?.url }}
                                >
                                    Summary <ArrowRight size={16} className="ml-1" />
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* No Results Message
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-purple-300 mb-4" />
            <p className="text-gray-500 text-lg">No articles found matching your search.</p>
          </div>
        )} */}
            </div>
        </div>
    );
};

export default LandingPage;