
import json
from fastapi import FastAPI
from models import Data, Source, EnrichedData, EnrichedSource   
from pathlib import Path
import re

import hashlib

app = FastAPI()

@app.get("/data", response_model=list[EnrichedData])
def get_data() -> list[EnrichedData]:
    """Fetch and process data from a mock JSON file."""
    data = Path("data/mock.json").read_text()
    list_of_data = [Data.model_validate(item) for item in json.loads(data)]
    
    # Process each content item
    processed_data = [process_data(item) for item in list_of_data]

    return processed_data

def process_data(item: Data) -> EnrichedData:
    """Process the data item to resolve references and enrich sources."""
    item = resolve_references(item)
    item = enrich_data(item)
    return item

def resolve_references(item: Data) -> Data:
    """Replace <ref>id</ref> tags with HTML <sub> anchor links to the source."""
    for i, source in enumerate(item.sources, start=1):
        pattern = f"<ref>{re.escape(source.id)}</ref>"
        link = (
            f'<sup><a href="#reference-{i}" rel="noopener noreferrer" class="link-primary">[{i}]</a></sup>'
        )
        item.content = item.content.replace(pattern, link)
    return item

def enrich_data(item: Data) -> EnrichedData:
    """Enrich the data item with additional information including citations and source favicons."""
    enriched_sources = enrich_sources(item.sources, item.content)

    # Count cited sources
    cited_count = count_cited_sources(enriched_sources)

    # Generate a unique id for the enriched data
    raw = f"{item.category}|{item.content}"
    id = hashlib.md5(raw.encode()).hexdigest()

    # Sanitize and format content
    processed_content = process_content(item.content)

    return EnrichedData(
        id=id,
        category=item.category,
        content=processed_content,
        sources=enriched_sources,
        cited_count=cited_count
    )

def enrich_sources(sources: list[Source], content: str) -> list[EnrichedSource]:
    """Enrich sources with favicon URLs and citation status."""
    enriched_sources = []
    for source in sources:
        domain = extract_domain(source.source)
        enriched_sources.append(EnrichedSource(
            id=source.id,
            title=source.title,
            source=source.source,
            favicon_url=generate_favicon_url(domain),
            is_cited=is_source_cited(source, content)
        ))
    return enriched_sources

def extract_domain(url: str) -> str:
    """Extract the domain from a URL."""
    match = re.search(r"https?://([^/]+)", url)
    return match.group(1) if match else ""

def generate_favicon_url(domain: str) -> str:
    """Generate a favicon URL using the domain and google's favicon service."""
    return f"https://www.google.com/s2/favicons?sz=16&domain={domain}"

def is_source_cited(source: Source, content: str) -> bool:
    """Check if the source is cited in the content."""
    pattern = re.compile(re.escape(source.title), re.IGNORECASE)
    return bool(pattern.search(content))

def count_cited_sources(sources: list[EnrichedSource]) -> int:
    """Count how many sources are cited."""
    return sum(1 for source in sources if source.is_cited)

def process_content(text: str) -> str:
    """Process the content for web display."""
    # Replace newlines with <br />
    processed_text = text.replace('\n', '<br />')

    return processed_text