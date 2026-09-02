# Semantic Intent Search and Recommendation Engine for CraftLink
import os
import re
import math
from typing import List, Dict, Any, Optional, Tuple

class SearchAndRecommendationEngine:
    def __init__(self):
        # Craft and Regional intent lexicon for Indian Handicrafts
        self.craft_keywords = {
            'blue pottery': ['blue pottery', 'pottery', 'ceramic', 'vase', 'glazed', 'jaipur vase'],
            'pashmina': ['pashmina', 'cashmere', 'shawl', 'wrap', 'sozni', 'kashmiri', 'kashmir'],
            'dhokra': ['dhokra', 'dokra', 'bell metal', 'brass', 'bronze', 'tribal', 'bastar', 'figurine'],
            'rogan': ['rogan', 'castor oil', 'tree of life', 'kutch', 'silk canvas', 'nirona'],
            'banarasi': ['banarasi', 'banaras', 'varanasi', 'saree', 'katan', 'zari', 'brocade', 'silk saree', 'wedding'],
            'channapatna': ['channapatna', 'wooden toy', 'lacquer', 'woodcraft', 'kids toy', 'montessori', 'non-toxic', 'toy train'],
            'bankura': ['bankura', 'terracotta', 'terracotta horse', 'clay', 'temple horse', 'panchmura', 'bengal'],
            'phulkari': ['phulkari', 'bagh', 'punjab', 'dupatta', 'embroidery', 'silk thread', 'scarf'],
            'bidriware': ['bidriware', 'bidri', 'silver inlay', 'coaster', 'zinc alloy', 'bidar'],
            'kolhapuri': ['kolhapuri', 'chappal', 'mojari', 'leather sandals', 'footwear', 'tanned leather'],
            'tanjore': ['tanjore', 'thanjavur', 'gold foil', '22k gold', 'krishna', 'devotional painting'],
            'madhubani': ['madhubani', 'mithila', 'kohbar', 'natural dye', 'handmade paper', 'folk painting']
        }

        self.region_keywords = {
            'rajasthan': ['rajasthan', 'jaipur', 'shekhawati', 'jodhpur', 'udaipur'],
            'kashmir': ['kashmir', 'jammu', 'srinagar', 'changthangi'],
            'chhattisgarh': ['chhattisgarh', 'bastar', 'kondagaon'],
            'gujarat': ['gujarat', 'kutch', 'nirona', 'ahmedabad'],
            'uttar pradesh': ['uttar pradesh', 'varanasi', 'kashi', 'banaras', 'lucknow'],
            'karnataka': ['karnataka', 'channapatna', 'bidar', 'ramanagara', 'bangalore'],
            'west bengal': ['west bengal', 'bankura', 'bengal', 'bishnupur', 'kolkata'],
            'punjab': ['punjab', 'patiala', 'nabha', 'amritsar'],
            'maharashtra': ['maharashtra', 'kolhapur', 'mumbai', 'pune'],
            'tamil nadu': ['tamil nadu', 'thanjavur', 'tanjore', 'chennai'],
            'bihar': ['bihar', 'madhubani', 'mithila', 'patna']
        }

        self.category_keywords = {
            'Home Decor': ['home decor', 'decoration', 'decorative', 'vase', 'centerpiece', 'tabletop', 'living room'],
            'Apparel & Accessories': ['apparel', 'shawl', 'wrap', 'clothing', 'fashion', 'winter'],
            'Metal Crafts & Sculptures': ['metal', 'brass', 'bronze', 'sculpture', 'statue', 'figurine'],
            'Wall Decor & Paintings': ['wall decor', 'painting', 'wall hanging', 'art', 'canvas', 'poster'],
            'Traditional Textiles': ['textile', 'saree', 'fabric', 'handloom', 'brocade', 'silk'],
            'Wooden Crafts & Toys': ['toy', 'wooden', 'wood', 'kids', 'toddler', 'montessori', 'train'],
            'Terracotta & Pottery': ['terracotta', 'pottery', 'clay', 'earthen', 'horse', 'pot'],
            'Hand Embroidery & Textiles': ['embroidery', 'dupatta', 'phulkari', 'needlework', 'thread'],
            'Traditional Footwear': ['footwear', 'shoes', 'chappal', 'sandals', 'mojari'],
            'Devotional & Fine Art': ['devotional', 'pooja', 'temple', 'gold foil', 'tanjore', 'sacred']
        }

    def parse_buyer_intent(self, query: str) -> Dict[str, Any]:
        """Extracts semantic intents (craft, region, category, material, style) from natural language."""
        q_lower = query.lower()

        detected_craft = None
        for craft, terms in self.craft_keywords.items():
            if any(term in q_lower for term in terms):
                detected_craft = craft
                break

        detected_region = None
        for region, terms in self.region_keywords.items():
            if any(term in q_lower for term in terms):
                detected_region = region.title()
                break

        detected_category = None
        for cat, terms in self.category_keywords.items():
            if any(term in q_lower for term in terms):
                detected_category = cat
                break

        # Check for quality/intent keywords
        is_gift = any(w in q_lower for w in ['gift', 'present', 'wedding', 'housewarming', 'souvenir'])
        is_eco = any(w in q_lower for w in ['eco', 'natural', 'organic', 'sustainable', 'non-toxic'])
        is_traditional = any(w in q_lower for w in ['traditional', 'handmade', 'handcrafted', 'heritage', 'vintage', 'folk'])

        summary_parts = []
        if is_traditional:
            summary_parts.append('Traditional Handcrafted')
        if is_eco:
            summary_parts.append('Eco-Friendly / Natural')
        if detected_craft:
            summary_parts.append(f'{detected_craft.title()} Craft')
        if detected_region:
            summary_parts.append(f'from {detected_region}')
        if detected_category:
            summary_parts.append(f'for {detected_category}')
        if is_gift:
            summary_parts.append('ideal for Gifting')

        interpreted = ' '.join(summary_parts) if summary_parts else f'Artisanal products matching "{query}"'

        return {
            'interpreted_intent': interpreted,
            'detected_craft': detected_craft,
            'detected_region': detected_region,
            'detected_category': detected_category,
            'is_gift': is_gift,
            'is_eco': is_eco,
            'is_traditional': is_traditional
        }

    def semantic_search(
        self,
        query: str,
        products: List[Dict[str, Any]],
        limit: int = 12
    ) -> Tuple[List[Dict[str, Any]], Dict[str, List[str]], Dict[str, Any]]:
        """Performs hybrid semantic and metadata ranking with match explanations."""
        intent = self.parse_buyer_intent(query)
        q_tokens = set(re.findall(r'\w+', query.lower()))

        scored_products = []
        match_reasons = {}

        for p in products:
            score = 0.0
            reasons = []

            # Build searchable text blob for product
            p_text = f"{p['title']} {p['description']} {p['category']} {p['craft_type']} {p['material']} {p['region']} {p['state']} {' '.join(p.get('tags', []))} {' '.join(p.get('buyer_segments', []))}".lower()
            p_tokens = set(re.findall(r'\w+', p_text))

            # Token overlap score
            overlap = q_tokens.intersection(p_tokens)
            if overlap:
                score += len(overlap) * 1.5

            # Regional intent match
            if intent['detected_region'] and (intent['detected_region'].lower() in p['state'].lower() or intent['detected_region'].lower() in p['region'].lower()):
                score += 5.0
                reasons.append(f"Authentic craft from {p['state']}")

            # Craft type intent match
            if intent['detected_craft'] and intent['detected_craft'] in p['craft_type'].lower():
                score += 6.0
                reasons.append(f"Direct match for traditional {p['craft_type']}")

            # Category intent match
            if intent['detected_category'] and intent['detected_category'].lower() == p['category'].lower():
                score += 3.5
                reasons.append(f"Matches category: {p['category']}")

            # Handmade / Traditional match
            if intent['is_traditional'] and any(t in ['handmade', 'traditional', 'artisanal', 'handwoven', 'handcrafted'] for t in p.get('tags', [])):
                score += 2.0
                reasons.append("100% Handcrafted by master artisans")

            # Eco-friendly match
            if intent['is_eco'] and any(m in p['material'].lower() for m in ['natural', 'vegetable', 'wood', 'clay', 'quartz', 'cotton', 'silk', 'organic']):
                score += 3.0
                reasons.append(f"Made from sustainable materials: {p['material']}")

            # Gift segment match
            if intent['is_gift'] and any('gift' in seg.lower() for seg in p.get('buyer_segments', [])):
                score += 2.5
                reasons.append("Curated for gifting & boutique decor")

            # Craft story relevance
            if p.get('craft_story'):
                score += 0.5

            # If no specific reasons generated, add default craft highlight
            if not reasons:
                reasons.append(f"Handcrafted {p['craft_type']} from {p['region']}, {p['state']}")
                reasons.append(f"Crafted with authentic {p['material']}")

            scored_products.append((score, p))
            match_reasons[p['id']] = reasons[:4]

        # Sort products by score descending
        scored_products.sort(key=lambda x: x[0], reverse=True)
        top_products = [item[1] for item in scored_products[:limit]]

        return top_products, match_reasons, intent

    def get_recommendations(
        self,
        target_product: Dict[str, Any],
        all_products: List[Dict[str, Any]],
        limit: int = 4
    ) -> List[Dict[str, Any]]:
        """Calculates similar crafts based on craft type, category, region, and buyer segments."""
        scored = []
        target_id = target_product['id']
        target_cat = target_product.get('category', '')
        target_craft = target_product.get('craft_type', '')
        target_state = target_product.get('state', '')
        target_segments = set(target_product.get('buyer_segments', []))
        target_tags = set(target_product.get('tags', []))

        for p in all_products:
            if p['id'] == target_id:
                continue

            sim_score = 0.0
            if p.get('category') == target_cat:
                sim_score += 3.0
            if p.get('craft_type') == target_craft:
                sim_score += 4.0
            if p.get('state') == target_state:
                sim_score += 2.0

            shared_segments = target_segments.intersection(set(p.get('buyer_segments', [])))
            sim_score += len(shared_segments) * 1.5

            shared_tags = target_tags.intersection(set(p.get('tags', [])))
            sim_score += len(shared_tags) * 0.8

            scored.append((sim_score, p))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:limit]]

search_engine = SearchAndRecommendationEngine()
