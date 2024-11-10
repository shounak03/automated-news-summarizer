import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import logging


class ArticleScraper:
    
    def __init__(self):
        
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def fetch_url(self, url):
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            self.logger.error(f"Error fetching URL {url}: {str(e)}")
            raise

    def extract_hindustan_times_content(self, soup):
        article_data = {
            'title': '',
            'content': '',
            'author': '',
            'date': '',
        }

        title_element = soup.find('h1', {'class': 'hdg1'})
        if title_element:
            article_data['title'] = title_element.get_text().strip()

        author_element = soup.find('div', {'class': 'authorName'})
        if author_element:
            article_data['author'] = author_element.get_text().strip()

        date_element = soup.find('div', {'class': 'dateTime'})
        if date_element:
            article_data['date'] = date_element.get_text().strip()

        article_div = soup.find('div', {'class': 'detail'})
        if article_div:
            paragraphs = article_div.find_all('p')
            article_data['content'] = ' '.join(
                p.get_text().strip() 
                for p in paragraphs 
                if p.get_text().strip()
            )

        return article_data



    def extract_generic_content(self, soup):
        """Generic extraction logic for any website."""
        article_data = {
            'title': '',
            'content': '',
            'author': '',
            'date': '',
        }

        # Try different title patterns
        title_candidates = [
            soup.find('h1'),  # Most common
            soup.find('meta', {'property': 'og:title'}),
            soup.find('meta', {'name': 'twitter:title'}),
            soup.find('title')
        ]
        
        for candidate in title_candidates:
            if candidate:
                article_data['title'] = (candidate.get('content', '') or candidate.get_text()).strip()
                if article_data['title']:
                    break

        # Try different author patterns
        author_candidates = [
            soup.find('meta', {'name': 'author'}),
            soup.find('a', {'rel': 'author'}),
            soup.find(['span', 'div', 'p'], {'class': ['author', 'byline', 'writer']}),
            soup.find('meta', {'property': 'article:author'})
        ]
        
        for candidate in author_candidates:
            if candidate:
                article_data['author'] = (candidate.get('content', '') or candidate.get_text()).strip()
                if article_data['author']:
                    break

        # Try different date patterns
        date_candidates = [
            soup.find('meta', {'property': 'article:published_time'}),
            soup.find('time'),
            soup.find(['span', 'div', 'p'], {'class': ['date', 'published', 'timestamp']})
        ]
        
        for candidate in date_candidates:
            if candidate:
                article_data['date'] = (
                    candidate.get('content', '') or 
                    candidate.get('datetime', '') or 
                    candidate.get_text()
                ).strip()
                if article_data['date']:
                    break

        # Try different content patterns
        content_candidates = [
            soup.find('article'),
            soup.find(['div', 'section'], {'class': ['article-content', 'post-content', 'entry-content']}),
            soup.find(['div', 'section'], {'id': ['article-content', 'post-content', 'entry-content']}),
            soup.find('main'),
        ]

        for container in content_candidates:
            if container:
                # Get all text-containing elements
                elements = container.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
                content = '\n\n'.join(
                    elem.get_text().strip()
                    for elem in elements
                    if elem.get_text().strip() and len(elem.get_text().strip()) > 20 
                )
                if content:
                    article_data['content'] = content
                    break

        return article_data

    def extract_article_content(self, html_content, url):
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove unwanted elements
        for element in soup.find_all(['script', 'style', 'nav', 'iframe', 'footer', 'header', 'aside']):
            element.decompose()

        domain = urlparse(url).netloc
        article_data = {'source': domain}

        # Try site-specific extractors first
        if 'hindustantimes.com' in domain:
            specific_data = self.extract_hindustan_times_content(soup)
        # elif 'medium.com' in domain:
        #     specific_data = self.extract_medium_content(soup)
        else:
            specific_data = self.extract_generic_content(soup)

        article_data.update(specific_data)

        if not article_data.get('content'):
            self.logger.warning(f"No content extracted from {url}")
            
        return article_data

    def scrape_article(self, url):
        try:
            html_content = self.fetch_url(url)
            article_data = self.extract_article_content(html_content, url)
            return article_data
        except Exception as e:
            self.logger.error(f"Error scraping article from {url}: {str(e)}")
            raise

