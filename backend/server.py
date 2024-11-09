from scrape import ArticleScraper
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from llm import Summarizer  # Import the Summarizer class
import asyncio

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic models
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
    return article_data

@app.get("/api/summary")
async def get_summary():
    try:
        # Scrape the article
        url = "https://www.hindustantimes.com/india-news/article-370-electoral-bonds-cji-designate-sanjiv-khanna-was-part-of-landmark-verdicts-101729789006951.html"
        scrapper = ArticleScraper()
        article_data = scrapper.scrape_article(url)
        
        # Generate summary
        summary = Summarizer.summarize_text(article_data['content'])
        
        return summary
    except Exception as e:
        return {"error": str(e)}

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

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)