import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SummaryPage = () => {
  const location = useLocation();
  const { url } = location.state || {};

  const [summary, setSummary] = useState([]);
  const [data, setData] = useState([]);

   const summarize = async () => {
        const res = await fetch(`http://127.0.0.1:8000/api/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                url: url
            })
        })
        const summ = await res.json()
        setSummary(summ)
        console.log(summary)
    }
   const getContent = async () => {
        const res = await fetch(`http://127.0.0.1:8000/api/urlScrapper`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                url: url
            })
        })
        const content = await res.json()
        setData(content)
        console.log(content)
    }


useEffect(() => {
    getContent();
    summarize();
},  [getContent,summarize]);

  return (
    <div className='flex flex-col items-center justify-center '>
      <h1>Summary Page</h1>
      <button onClick={getContent}  className='text-4xl text-blue-800'>Content</button>
      <h1 className='text-4xl text-blue-800'>{data.title}</h1>
      <p>{data.content}</p>
      <button onClick={summarize} className='text-4xl text-blue-800'>summary</button>
      <p >{summary.response}</p>
    </div>
  );
};

export default SummaryPage;