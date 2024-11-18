

import {  useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Link, useLocation } from 'react-router-dom'
import { HashLoader } from 'react-spinners'

interface ArticleData {
  title: string;
  content: string;
  summary: string;
  response: string;
}

export default function Summary() {
  const location = useLocation();
  const { url } = location.state || {};
  
  const [summary, setSummary] = useState<ArticleData>();
  const [data, setData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ url })
      });
      
      if (!res.ok) throw new Error('Failed to fetch summary');
      
      const summ = await res.json();
      setSummary(summ);
      setShowSummary(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate summary');
      console.error(error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const getContent = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/urlScrapper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ url })
      });
      
      if (!res.ok) throw new Error('Region-locked content, Cannot fetch');
      
      const content = await res.json();
      console.log(content);
      
      setData(content);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Region-locked content, Cannot fetch');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContent();
    
    // Polling interval
    const interval = setInterval(getContent, 10000);
    return () => clearInterval(interval);
  }, [url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <HashLoader
          color="#ffffff"
          loading={true}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-800">Region-locked content, Cannot fetch</p>
          <Link
              to={url}
              target="_blank"
              className='text-blue-600 underline cursor-pointer'
              rel="noopener noreferrer"
            >
              Article link
            </Link><br />
          <Button onClick={getContent} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-grow p-4 flex flex-col m-4">
        <h1 className="text-2xl font-bold text-white text-center mb-4">
          {data?.title || 'Loading...'}
        </h1>
        
        <div className="mb-4 flex justify-end space-x-2">
          <Button 
            onClick={summarize} 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            disabled={loadingSummary}
          >
            {loadingSummary ? 'Generating...' : 'Generate Summary'}
          </Button>
          
          <Button 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            disabled={!data}
          >
            <Link
              to={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Article link
            </Link>
          </Button>
        </div>

        <div className={`flex-grow flex ${showSummary ? 'space-x-4' : ''}`}>
          <Card className={`bg-white p-4 ${showSummary ? 'w-1/2' : 'w-full'}`}>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="pr-4">
                <h2 className="text-xl font-semibold mb-2 text-primary">
                  Article Content
                </h2>
                <p className="text-gray-800">{data?.content}</p>
              </div>
            </ScrollArea>
          </Card>

          {showSummary && (
            <Card className="w-1/2 bg-white p-4">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <h2 className="text-xl font-semibold mb-2 text-primary">
                  Summary
                </h2>
                <p className="text-gray-800">{summary?.response}</p>
              </ScrollArea>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}