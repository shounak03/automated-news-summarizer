from llama_index.core import SimpleDirectoryReader
from llama_index.core import SummaryIndex
from llama_index.llms.groq import Groq
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Settings

import os
from dotenv import load_dotenv
import tempfile 

load_dotenv()
API_KEY = os.getenv("API_KEY")
llm = Groq(model="llama-3.1-8b-instant",api_key=API_KEY)
Settings.llm = llm

class Summarizer:

    def summarize_text(data):
    
        with tempfile.NamedTemporaryFile(mode="w", delete=False) as temp_file:
            temp_file.write(data)
            temp_file.flush()

        documents = SimpleDirectoryReader(input_files=[temp_file.name]).load_data()

        splitter = SentenceSplitter(chunk_size=1024)
        nodes = splitter.get_nodes_from_documents(documents)

        summary_index = SummaryIndex(nodes)

        summmary_query_engine = summary_index.as_query_engine(
            response_mode="tree_summarize",
            use_async = True
        )

        response = summmary_query_engine.query("Summarize the given data")

        return response