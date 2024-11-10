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
    const res = await fetch(`http://127.0.0.1:8000/api/top-headlines`)
    const data = await res.json()
    console.log(data);

    setData(data.articles)
  }

  useEffect(() => {
  fetchData(); 

  const interval = setInterval(() => {
    fetchData(); 
  }, 60000);

  return () => clearInterval(interval); 
}, []);


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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((article) => (
            <Card
              key={article?.id}
              className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-t-4 border-t-purple-500 group"
            >
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200 mb-4">
                {article?.title}
                <br />

              </h2>
              <span className='p-2 mt-4'> - {article?.author || "Unknown Author"}</span>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-purple-100">
                <Link
                  to={`/${encodeURIComponent(article?.title)}`}
                  className="flex items-center text-purple-600 font-medium text-sm group-hover:gap-2 transition-all"
                  state={{ url: article?.url }}
                >
                  Read... <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;