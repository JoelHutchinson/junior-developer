import pytest
from fastapi.testclient import TestClient
from main import app, process_data, resolve_references, enrich_data, enrich_sources, extract_domain, generate_favicon_url, is_source_cited, count_cited_sources, process_content
from models import Data, Source, EnrichedData, EnrichedSource
from pathlib import Path

client = TestClient(app)

@pytest.fixture
def sample_data():
    return Data(
        category="test_category",
        sources=[
            Source(id="ref1", title="Test Source 1", source="https://example.com"),
            Source(id="ref2", title="Test Source 2", source="https://test.org")
        ],
        content="This is test content with <ref>ref1</ref> and <ref>ref2</ref> references."
    )

@pytest.fixture
def sample_enriched_data():
    return EnrichedData(
        id="test_id",
        category="test_category",
        content="This is test content with <sup><a href='#reference-ref1'>[1]</a></sup> references.",
        sources=[
            EnrichedSource(
                id="ref1",
                title="Test Source 1",
                source="https://example.com",
                favicon_url="https://www.google.com/s2/favicons?sz=16&domain=example.com",
                is_cited=True
            )
        ]
    )

def test_get_data_endpoint():
    """Test the main data endpoint returns valid response"""
    response = client.get("/data")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:  # If there's data in the mock file
        assert "id" in data[0]
        assert "category" in data[0]
        assert "content" in data[0]
        assert "sources" in data[0]

def test_process_data(sample_data):
    """Test data processing pipeline"""
    result = process_data(sample_data)
    assert isinstance(result, EnrichedData)
    assert result.id is not None
    assert result.category == "test_category"
    assert "<sup>" in result.content  # Should have processed references

def test_resolve_references(sample_enriched_data):
    """Test reference resolution"""
    # Test with content that has ref tags
    test_content = "Content with <ref>ref1</ref> reference."
    sample_enriched_data.content = test_content
    result = resolve_references(sample_enriched_data)
    assert "<sup>" in result.content
    assert "<a href=" in result.content

def test_enrich_data(sample_data):
    """Test data enrichment"""
    result = enrich_data(sample_data)
    assert isinstance(result, EnrichedData)
    assert result.id is not None
    assert len(result.sources) == 2
    assert all(hasattr(source, 'favicon_url') for source in result.sources)
    assert all(hasattr(source, 'is_cited') for source in result.sources)

def test_enrich_sources():
    """Test source enrichment"""
    sources = [
        Source(id="ref1", title="Test Source", source="https://example.com")
    ]
    content = "This content mentions Test Source"
    result = enrich_sources(sources, content)
    assert len(result) == 1
    assert result[0].favicon_url == "https://www.google.com/s2/favicons?sz=16&domain=example.com"
    assert result[0].is_cited == True

def test_extract_domain():
    """Test domain extraction from URLs"""
    assert extract_domain("https://example.com/path") == "example.com"
    assert extract_domain("http://test.org") == "test.org"
    assert extract_domain("invalid-url") == ""

def test_generate_favicon_url():
    """Test favicon URL generation"""
    url = generate_favicon_url("example.com")
    assert url == "https://www.google.com/s2/favicons?sz=16&domain=example.com"

def test_is_source_cited():
    """Test source citation detection"""
    source = Source(id="ref1", title="Test Source", source="https://example.com")
    content_with_citation = "This mentions Test Source"
    content_without_citation = "This doesn't mention the source"
    
    assert is_source_cited(source, content_with_citation) == True
    assert is_source_cited(source, content_without_citation) == False

def test_count_cited_sources():
    """Test cited sources counting"""
    sources = [
        EnrichedSource(id="ref1", title="Source 1", source="https://example.com", favicon_url="", is_cited=True),
        EnrichedSource(id="ref2", title="Source 2", source="https://test.org", favicon_url="", is_cited=False)
    ]
    assert count_cited_sources(sources) == 1

def test_process_content():
    """Test content processing"""
    content = "Line 1\nLine 2\nLine 3"
    result = process_content(content)
    assert "<br />" in result
    assert result.count("<br />") == 2

def test_api_response_structure():
    """Test API response has correct structure"""
    response = client.get("/data")
    assert response.status_code == 200
    data = response.json()
    
    if data:
        item = data[0]
        required_fields = ["id", "category", "content", "sources"]
        for field in required_fields:
            assert field in item
        
        # Check sources structure
        if item["sources"]:
            source = item["sources"][0]
            source_fields = ["id", "title", "source", "favicon_url", "is_cited"]
            for field in source_fields:
                assert field in source 