# CraftLink AI Engine

Independent AI module for CraftLink (SIH 2026). Takes a product image and
produces structured attributes, a marketplace listing, translations, and a
search embedding. Designed to be called over HTTP by a separate FastAPI
backend — no shared code needed between the two.

⚠️ **Before your demo:** verify `MODEL_NAME` in `ai_service.py` and
`EMBEDDING_MODEL_NAME` in `embedding_service.py` against the current
Gemini API docs at https://ai.google.dev/gemini-api/docs/models — model
names change over time and this was written from a fixed snapshot of
knowledge, not a live check.

## File overview

- `schemas.py` — the data contract (`ProductAttributes`, `ProductListing`)
- `prompts.py` — all prompt text, kept separate from logic
- `ai_service.py` — the six pipeline functions, calls Gemini
- `validators.py` — business rule checks + generic retry helper
- `embedding_service.py` — isolated embedding function, the search-integration seam
- `app.py` — FastAPI routes (HTTP-only, no logic)
- `demo.py` — runs the full pipeline on one image from the command line
- `tests/test_schema.py` — offline schema/validator tests (no API calls)

## Install

```bash
cd ai-engine
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Set up your API key

```bash
cp .env.example .env
```

Edit `.env` and paste your key:

```
GEMINI_API_KEY=your_real_key_here
```

Get a key at https://aistudio.google.com/app/apikey

## Run the demo

Put a test image at `ai-engine/sample.jpg`, then:

```bash
python demo.py sample.jpg
```

This prints the attributes JSON, the listing JSON, the search text, and
the embedding length — the full pipeline in one command.

## Run the API server

```bash
uvicorn app:app --reload --port 8001
```

## Run tests

```bash
pytest tests/
```

These tests do NOT call the Gemini API — they only check that the schema
and business-rule validators behave correctly, so they're free to run
repeatedly.

## Sample response (`/products/analyze`)

```json
{
  "attributes": {
    "category": "Textile",
    "craft": "Madhubani",
    "material": "Cotton fabric with hand-painted pigment",
    "colors": ["red", "black", "yellow", "white"],
    "region": null,
    "visual_features": ["fish motifs", "geometric border"],
    "confidence": 0.6,
    "uncertain_fields": ["region", "material"]
  }
}
```

## Postman example

```
POST http://localhost:8001/products/analyze
Body: form-data
  Key: file   Type: File   Value: sample.jpg
```

## Integration example for the main FastAPI project

Your teammate's backend does not import anything from this folder. It
just calls this service over HTTP, e.g. using `httpx`:

```python
import httpx

async def get_ai_attributes(image_bytes: bytes, filename: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8001/products/analyze",
            files={"file": (filename, image_bytes, "image/jpeg")},
        )
        response.raise_for_status()
        return response.json()["attributes"]
```

They store the returned `attributes` in their own database, and call
`/products/generate-catalog` with it later when the artisan is ready to
publish.

## MVP vs future polish

| Feature | Status now | Future polish |
|---|---|---|
| Image analysis | Done | Calibrate confidence against measured accuracy |
| Catalog generation | Done | A/B test prompt variants |
| Translation | Done | Verify regional script rendering |
| Embedding | Done | Add a batch-embedding endpoint |
| Retry logic | 1 retry + backoff | Add jitter, configurable attempt count |
| Evaluation | Schema tests only | Score against a small labeled ground-truth set |

## What "evaluation framework" means here

`tests/test_schema.py` proves the data contract is enforced correctly.
For SIH judges, the honest claim is: "we validate schema correctness and
reject unsupported claims automatically — we have not yet measured
real-world attribute accuracy against ground truth, that's the next step."
That distinction (measured vs. unmeasured) is itself a credibility signal.
