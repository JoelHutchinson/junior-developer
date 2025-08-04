import json
from fastapi import FastAPI
from models import Data
from pathlib import Path
import re

app = FastAPI()

@app.get("/data", response_model=list[Data])
def get_data() -> list[Data]:
    """
    Endpoint to return the parsed and reference-resolved data from a local JSON file.
    
    - Loads raw JSON from 'data/mock.json'.
    - Validates each entry against the `Data` model.
    - Replaces all <ref>...</ref> tags in content fields with appropriate HTML anchor tags.
    - Returns the transformed list of Data objects.
    """
    data = Path("data/mock.json").read_text()

    # Parse JSON and validate each item against the Data model
    list_of_data = [Data.model_validate(item) for item in json.loads(data)]

    # Add favicons to sources
    list_of_data = add_favicon_to_all_data(list_of_data)

    # Replace <ref> tags in each data item's content field
    list_of_data = resolve_all_references(list_of_data)
    
    return list_of_data

def resolve_all_references(data_list: list[Data]) -> list[Data]:
    """
    Replaces <ref>...</ref> tags with HTML anchor tags in the content field
    for each Data object in a list.

    Args:
        data_list: List of Data objects with potential <ref> tags in `content`.

    Returns:
        The modified list of Data objects with resolved references.
    """
    for data in data_list:
        data = resolve_references_in_data(data)
    return data_list

def resolve_references_in_data(data: Data) -> Data:
    # Extract all <ref>...</ref> IDs from the content
    cited_ids = set(re.findall(r"<ref>(.*?)</ref>", data.content))

    # Set the .cited flag and build replacement map
    source_replacement_elements = {}
    for s in data.sources:
        s.cited = s.id in cited_ids
        source_replacement_elements[s.id] = f'<a href="{s.source}">{s.title}</a>'

    # Replace <ref>ID</ref> with <a>...</a>
    def repl(match):
        ref_id = match.group(1)
        return source_replacement_elements.get(ref_id, f"[missing ref: {ref_id}]")

    data.content = re.sub(r"<ref>(.*?)</ref>", repl, data.content)

    return data

def add_favicon_to_all_data(data_list: list[Data]) -> list[Data]:
    """
    Adds favicons to all sources in a list of Data objects.
    
    Args:
        data_list: List of Data objects to process.

    Returns:
        The modified list of Data objects with favicons added to sources.
    """
    return [add_favicon_to_data(data) for data in data_list]

def add_favicon_to_data(data: Data) -> Data:
    """
    Adds a favicon URL to each source in the Data object based on its domain.
    
    Args:
        data: A Data object containing sources with domains.

    Returns:
        The modified Data object with favicons added to sources.
    """
    for source in data.sources:
        domain = getattr(source, "source", None)
        if domain:
            source.favicon = f"https://www.google.com/s2/favicons?sz=64&domain={domain}"
    
    return data