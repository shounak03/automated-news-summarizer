from scrape import ArticleScraper
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from llm import Summarizer  # Import the Summarizer class
import asyncio, os
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

class URLRequest(BaseModel):
    url: str

class SummaryResponse(BaseModel):
    content: str
    summary: str

@app.post("/api/urlScrapper")
def url_scraper(request: URLRequest):
    url = request.url
    scrapper = ArticleScraper()
    article_data = scrapper.scrape_article(url)
    if article_data['content'] == "":
        raise HTTPException(status_code=404, detail="No content found")
    return article_data




@app.get("/api/top-headlines")
async def get_top_headlines():
    if not NEWS_API_KEY:
        raise HTTPException(status_code=500, detail="API key not found")

    url = f"https://newsapi.org/v2/top-headlines?language=en&apiKey={NEWS_API_KEY}"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            articles = data.get("articles", [])
            return {"articles": articles}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Testing route
# @app.get("/api/summary")
# async def get_summary():
#     try:
#         # Scrape the article
#         url = "https://www.hindustantimes.com/india-news/article-370-electoral-bonds-cji-designate-sanjiv-khanna-was-part-of-landmark-verdicts-101729789006951.html"
#         scrapper = ArticleScraper()
#         article_data = scrapper.scrape_article(url)
        
#         # Generate summary
#         summary = Summarizer.summarize_text(article_data['content'])
        
#         return summary
#     except Exception as e:
#         return {"error": str(e)}

@app.post("/api/summarize")
def summarize_url(request: URLRequest):
    try:
        # Scrape the provided URL
        scrapper = ArticleScraper()
        article_data = scrapper.scrape_article(request.url)
        
        # Generate summary
        summary = Summarizer.summarize_text(article_data['content'])
        
        return summary
    except Exception as e:
        return {"summary error": str(e)}

