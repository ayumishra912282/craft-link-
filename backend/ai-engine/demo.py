"""
Run the entire pipeline on one image and print the result.

Usage:
    python demo.py sample.jpg
"""

import json
import mimetypes
import sys

from ai_service import analyze_product_image, validate_attributes, generate_catalog, build_search_text
from embedding_service import generate_embedding


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python demo.py <path_to_image>")
        sys.exit(1)

    image_path = sys.argv[1]

    with open(image_path, "rb") as f:
        image_bytes = f.read()

    mime_type = mimetypes.guess_type(image_path)[0] or "image/jpeg"

    print("Step 1/4: Analyzing image...")
    attributes = analyze_product_image(image_bytes, mime_type)
    attributes = validate_attributes(attributes)
    print(json.dumps(attributes.model_dump(), indent=2))

    print("\nStep 2/4: Generating catalog...")
    listing = generate_catalog(attributes)
    print(json.dumps(listing.model_dump(), indent=2))

    print("\nStep 3/4: Building search text...")
    search_text = build_search_text(attributes, listing)
    print(search_text)

    print("\nStep 4/4: Generating embedding...")
    embedding = generate_embedding(search_text)
    print(f"Embedding vector length: {len(embedding)}")

    result = {
        "attributes": attributes.model_dump(),
        "listing": listing.model_dump(),
        "search_text": search_text,
        "embedding_length": len(embedding),
    }

    print("\n=== FINAL JSON ===")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
