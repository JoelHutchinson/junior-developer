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
    
    # Replace <ref> tags in each data item's content field
    return resolve_all_references(list_of_data)


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
    """
    Replaces <ref>...</ref> tags in the `content` of a single Data object
    with corresponding <a href="...">...</a> HTML links based on `sources`.

    Args:
        data: A Data object whose content may include <ref>ID</ref> tags.

    Returns:
        The modified Data object with content where <ref> tags have been replaced
        by HTML links to the appropriate source.
    """
    # Map each source ID to an HTML anchor tag
    source_replacement_elements = {
        s.id: f'<a href="{s.source}">{s.title}</a>'
        for s in data.sources
    }

    # Regex replacement function for <ref>ID</ref>
    def repl(match):
        ref_id = match.group(1)
        return source_replacement_elements.get(ref_id, f"[missing ref: {ref_id}]")

    # Replace all <ref>...</ref> occurrences in the content
    data.content = re.sub(r"<ref>(.*?)</ref>", repl, data.content)

    return data