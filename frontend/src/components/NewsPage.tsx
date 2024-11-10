
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link } from "react-router-dom"
import { CSSProperties, useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { HashLoader } from "react-spinners"

// This would typically come from an API or props

interface Article {
    id: string;
    title: string;
    url: string;
    author: string;
}

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  
export default function NewsDisplay() {

    const [data, setData] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false)


    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/top-headlines`)
            const data = await res.json()
            console.log(data);
    
            setData(data.articles)
        } catch (error) {
            console.log(error);
            
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    
    return (
        <main className="flex-grow p-4 bg-gray-900">

            <div className="flex justify-center items-center text-4xl m-2 pb-2 ">

                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                    Latest News
                </h1>
            </div>
            
            {loading && 
                <HashLoader
                    className="flex justify-center items-center mt-5"
                    color="white" 
                    loading={loading}
                    cssOverride={override}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            }
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {data.map((article) => (
                        <Card key={article.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{article.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-gray-600">{article.author}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                {/* <span className="text-sm text-gray-500">{article.date}</span> */}
                                <Button asChild>
                                    <Link
                                        to={`/${encodeURIComponent(article?.title)}`}
                                        className="flex items-center  font-medium text-sm group-hover:gap-2 transition-all"
                                        state={{ url: article?.url }}
                                    >
                                        Read more <ArrowRight size={16} className="ml-1" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </main>



    )
}