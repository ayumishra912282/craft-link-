# Gemini AI Service for Indian Artisan Vision & Catalog Copilot
import os
import json
import re
import base64
from typing import Dict, Any, Optional, List
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '').strip()

genai = None
vision_model = None
text_model = None

if GEMINI_API_KEY:
    try:
        import google.generativeai as genai_module
        genai = genai_module
        genai.configure(api_key=GEMINI_API_KEY)
        vision_model = genai.GenerativeModel('gemini-2.5-flash')
        text_model = genai.GenerativeModel('gemini-2.5-flash')
        print('[AI] Gemini 2.5 Flash initialized successfully!')
    except Exception as e:
        print(f'[AI] Gemini init warning: {e}. Fallback demo mode available.')

class GeminiService:
    def __init__(self):
        self.is_configured = bool(GEMINI_API_KEY and genai)

    def _clean_json_response(self, text: str) -> Dict[str, Any]:
        text = text.strip()
        if text.startswith('`json'):
            text = text[7:]
        elif text.startswith('`'):
            text = text[3:]
        if text.endswith('`'):
            text = text[:-3]
        text = text.strip()
        return json.loads(text)

    def analyze_craft_image(
        self,
        image_bytes: Optional[bytes] = None,
        image_base64: Optional[str] = None,
        craft_hint: Optional[str] = None
    ) -> Dict[str, Any]:
        """Analyzes a product photo using Gemini Vision to detect craft, materials, colors and region."""
        if self.is_configured and vision_model:
            try:
                pil_img = None
                if image_bytes:
                    pil_img = Image.open(BytesIO(image_bytes))
                elif image_base64:
                    if ',' in image_base64:
                        image_base64 = image_base64.split(',', 1)[1]
                    raw_data = base64.b64decode(image_base64)
                    pil_img = Image.open(BytesIO(raw_data))

                if pil_img:
                    prompt = (
                        "You are CraftLink\'s Expert Indian Handicraft & Artisan Vision AI.\n"
                        "Analyze this product image carefully. Identify the traditional Indian craft, materials, colors, region, and visual traits.\n"
                        f"Artisan Hint: {craft_hint or 'None provided'}\n"
                        "Respond ONLY with a valid JSON object with keys: product_type, craft, material, colors (list), region, state, category, style, keywords (list), visual_characteristics (list), confidence_score (float)."
                    )
                    response = vision_model.generate_content([prompt, pil_img])
                    result = self._clean_json_response(response.text)
                    result['is_demo_mode'] = False
                    return result
            except Exception as e:
                print(f"[AI Vision] Live Gemini call failed: {e}. Falling back to demo analyzer.")

        return self._demo_analyze_craft(craft_hint)

    def _demo_analyze_craft(self, hint: Optional[str] = None) -> Dict[str, Any]:
        """Deterministic high-fidelity analyzer for SIH demo presentations."""
        h = (hint or '').lower()
        if 'blue' in h or 'pottery' in h or 'vase' in h:
            return {
                "product_type": "Handcrafted Glazed Ceramic Floral Vase",
                "craft": "Blue Pottery",
                "material": "Crushed Quartz, Glass Frit & Natural Glaze",
                "colors": ["Cobalt Blue", "Turquoise", "White", "Golden Yellow"],
                "region": "Jaipur, Shekhawati",
                "state": "Rajasthan",
                "category": "Home Decor",
                "style": "Persian & Rajput Glazed Arabesque",
                "keywords": ["blue pottery", "jaipur craft", "handmade vase", "traditional ceramics", "home decor"],
                "visual_characteristics": [
                    "Cobalt blue floral arabesque patterns with fine brushwork",
                    "Smooth glassy turquoise glaze over quartz composite body",
                    "Flared rim and balanced ornamental neck"
                ],
                "confidence_score": 0.96,
                "is_demo_mode": True
            }
        elif 'shawl' in h or 'pashmina' in h or 'wool' in h or 'kashmir' in h:
            return {
                "product_type": "Hand-Embroidered Cashmere Wrap Shawl",
                "craft": "Pashmina Weaving & Sozni",
                "material": "Changthangi Cashmere Wool & Silk Floss",
                "colors": ["Warm Ivory", "Crimson Red", "Ochre Gold"],
                "region": "Kashmir Valley",
                "state": "Jammu & Kashmir",
                "category": "Apparel & Accessories",
                "style": "Traditional Badam & Jaal Needlework",
                "keywords": ["pashmina", "cashmere", "kashmir shawl", "sozni needlework", "handwoven wrap"],
                "visual_characteristics": [
                    "Featherweight ultra-fine hand-spun cashmere weave",
                    "Dense microscopic needle embroidery on borders",
                    "Soft natural off-white drape with rich jewel-toned motifs"
                ],
                "confidence_score": 0.98,
                "is_demo_mode": True
            }
        elif 'brass' in h or 'dhokra' in h or 'tribal' in h or 'metal' in h:
            return {
                "product_type": "Lost-Wax Cast Brass Tribal Musician",
                "craft": "Dhokra Bell Metal Casting",
                "material": "Recycled Brass, Bronze & Clay Cast",
                "colors": ["Antique Bronze", "Gold Patina", "Rustic Charcoal"],
                "region": "Bastar",
                "state": "Chhattisgarh",
                "category": "Metal Crafts & Sculptures",
                "style": "Tribal Folk Lost-Wax Figurine",
                "keywords": ["dhokra", "bell metal", "tribal art", "lost wax", "bastar craft"],
                "visual_characteristics": [
                    "Fine coiled beeswax thread texture preserved in molten brass",
                    "Elongated stylized rustic folk human silhouette",
                    "Antique oxidised bronze sheen"
                ],
                "confidence_score": 0.94,
                "is_demo_mode": True
            }
        elif 'silk' in h or 'saree' in h or 'banarasi' in h or 'zari' in h:
            return {
                "product_type": "Handloom Pure Katan Silk Zari Saree",
                "craft": "Banarasi Handloom Weaving",
                "material": "Mulberry Katan Silk & Real Gold Zari",
                "colors": ["Royal Crimson", "Gilded Gold", "Emerald Green"],
                "region": "Varanasi (Kashi)",
                "state": "Uttar Pradesh",
                "category": "Traditional Textiles",
                "style": "Mughal Kadwa Brocade & Floral Jaal",
                "keywords": ["banarasi saree", "katan silk", "zari brocade", "handloom", "bridal wear"],
                "visual_characteristics": [
                    "Intricate golden metallic zari motifs hand-woven into silk warp",
                    "Heavy lustrous drape with ornate Shikargah pallu",
                    "Rich textured heritage handloom selvage"
                ],
                "confidence_score": 0.97,
                "is_demo_mode": True
            }
        else:
            return {
                "product_type": "Handcrafted Artisan Heritage Piece",
                "craft": "Blue Pottery",
                "material": "Crushed Quartz, Glass Frit & Natural Mineral Pigments",
                "colors": ["Cobalt Blue", "Turquoise", "Pristine White", "Golden Yellow"],
                "region": "Jaipur",
                "state": "Rajasthan",
                "category": "Home Decor",
                "style": "Traditional Heritage Handcraft",
                "keywords": ["handmade", "artisanal craft", "heritage india", "home decor", "traditional craft"],
                "visual_characteristics": [
                    "Hand-painted traditional regional motifs",
                    "Authentic non-mechanised texture and artisanal glaze",
                    "Rich natural pigment balance"
                ],
                "confidence_score": 0.95,
                "is_demo_mode": True
            }

    def generate_catalog_listing(
        self,
        attributes: Dict[str, Any],
        artisan_name: str = "Master Artisan",
        craft_notes: Optional[str] = None,
        suggested_price: Optional[float] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        """Generates a complete, authentic product catalogue with title, story, tags, buyer segments and multilingual assistance."""
        if self.is_configured and text_model:
            try:
                prompt = (
                    "You are CraftLink\'s AI Catalog Copilot for Indian Artisans.\n"
                    "Generate a professional, culturally authentic product listing based on these attributes:\n"
                    f"{json.dumps(attributes, indent=2)}\n"
                    f"Artisan: {artisan_name}, Notes: {craft_notes or 'Authentic traditional craft'}\n"
                    "Respond ONLY with valid JSON with keys: title, title_hindi, description, description_hindi, short_description, category, craft_type, material, colors (list), region, state, suggested_price (float), tags (list), buyer_segments (list), craft_story, craft_story_hindi, keywords (list), seo_metadata (dict)."
                )
                response = text_model.generate_content(prompt)
                result = self._clean_json_response(response.text)
                result['is_demo_mode'] = False
                return result
            except Exception as e:
                print(f"[AI Copilot] Live Gemini call failed: {e}. Using deterministic copilot.")

        craft = attributes.get('craft', 'Blue Pottery')
        product_type = attributes.get('product_type', 'Handcrafted Artisan Piece')
        region = attributes.get('region', 'Jaipur')
        state = attributes.get('state', 'Rajasthan')
        material = attributes.get('material', 'Natural Quartz and Glaze')
        colors = attributes.get('colors', ['Cobalt Blue', 'Turquoise', 'White'])
        category = attributes.get('category', 'Home Decor')

        title = f"{region} Handcrafted {craft} {product_type}"
        short_desc = f"Authentic {craft} handcrafted by skilled artisans in {region}, {state} using traditional {material}."
        desc = (
            f"An exquisite {product_type} showcasing the celebrated traditions of {region}, {state}. "
            f"Skillfully shaped and detailed using {material} in captivating tones of {', '.join(colors[:3])}. "
            f"Every individual piece is handmade, celebrating centuries of artisanal heritage while making a striking statement in contemporary spaces."
        )
        craft_story = (
            f"The {craft} tradition of {region}, {state} is renowned worldwide for its distinct visual identity and non-mechanized heritage. "
            f"Passed down across generations of karigars, each creation honors ancestral craftsmanship and sustainable local materials."
        )

        title_hi = f"{region} ??????????? {craft} {product_type}"
        desc_hi = f"{region}, {state} ?? ???????? {craft} ??? ?? ????? ???? ??? ?? ???????? ?????????? ?? ?????? ????????? ??????? ?? ???????? ??????? ?? ????? ??? ???"
        story_hi = f"{region} ?? {craft} ?????? ?????? ?????? ?????? ?? ?????? ???????? ?? ?????? ?? ?????? ???"

        buyer_segments = [
            "Home Decor Buyers",
            "Interior Designers",
            "Boutique Retailers",
            "Gift Shoppers",
            "Cultural Art Enthusiasts"
        ]

        tags = [
            craft.lower(),
            f"{state.lower()} craft",
            "handmade",
            "artisanal",
            category.lower(),
            "indian heritage",
            "traditional art",
            "sustainable decor"
        ]

        return {
            "title": title,
            "title_hindi": title_hi,
            "description": desc,
            "description_hindi": desc_hi,
            "short_description": short_desc,
            "category": category,
            "craft_type": craft,
            "material": material,
            "colors": colors,
            "region": region,
            "state": state,
            "suggested_price": suggested_price or 1850.0,
            "tags": tags,
            "buyer_segments": buyer_segments,
            "craft_story": craft_story,
            "craft_story_hindi": story_hi,
            "keywords": tags[:5],
            "seo_metadata": {
                "meta_title": f"{title} | CraftLink",
                "meta_description": short_desc
            },
            "is_demo_mode": True
        }

gemini_service = GeminiService()
