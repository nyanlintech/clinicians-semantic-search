from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from sqlalchemy import text, and_
from app.models.therapist import Therapist
from app.services.processor import TherapistProcessor
import numpy as np
from typing import List, Optional
import re

class SearchService:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.processor = TherapistProcessor()

    def generate_embedding(self, text: str) -> list:
        """Generate embedding for a given text using the transformer model."""
        embedding = self.model.encode(text)
        return embedding.tolist()  # Convert numpy array to list

    def calculate_multi_criteria_score(self, therapist: Therapist, criteria: List[str]) -> tuple[float, int]:
        """
        Calculate how well a therapist matches multiple criteria.
        Returns (score, matched_criteria_count)
        """
        if not criteria:
            return 0.0, 0
        
        # Create a comprehensive profile text for the therapist
        profile_text = self._create_therapist_profile_text(therapist)
        therapist_embedding = self.generate_embedding(profile_text)
        
        total_score = 0.0
        matched_criteria = 0
        criterion_scores = []
        
        for criterion in criteria:
            criterion_embedding = self.generate_embedding(criterion)
            similarity = self._cosine_similarity(therapist_embedding, criterion_embedding)
            criterion_scores.append(similarity)
            
            # Consider a criterion "matched" if similarity is above threshold
            if similarity > 0.6:  # Adjustable threshold
                matched_criteria += 1
                total_score += similarity
            else:
                # Still add some score even if below threshold
                total_score += similarity * 0.3
        
        # Calculate final score with bonus for matching more criteria
        if len(criteria) > 1:
            # Bonus for matching multiple criteria
            match_ratio = matched_criteria / len(criteria)
            bonus_multiplier = 1 + (match_ratio * 0.5)  # Up to 50% bonus
            final_score = (total_score / len(criteria)) * bonus_multiplier
        else:
            final_score = total_score / len(criteria)
        
        return final_score, matched_criteria

    def _create_therapist_profile_text(self, therapist: Therapist) -> str:
        """Create a comprehensive profile text for semantic matching."""
        parts = []
        
        # Basic info
        if therapist.title:
            parts.append(f"I am a {therapist.title}")
        if therapist.credentials:
            parts.append(f"with credentials {therapist.credentials}")
        
        # Specialties and issues
        if therapist.specialities:
            specialties_text = []
            for spec in therapist.specialities:
                if isinstance(spec, dict):
                    name = spec.get('name', '')
                    desc = spec.get('description', '')
                    specialties_text.append(f"{name} {desc}".strip())
                else:
                    specialties_text.append(str(spec))
            if specialties_text:
                parts.append(f"I specialize in {' '.join(specialties_text)}")
        
        if therapist.other_issues:
            parts.append(f"I work with issues including {' '.join(therapist.other_issues)}")
        
        # Approaches and techniques
        if therapist.approaches:
            approaches_text = []
            for approach in therapist.approaches:
                if isinstance(approach, dict):
                    name = approach.get('name', '')
                    desc = approach.get('description', '')
                    approaches_text.append(f"{name} {desc}".strip())
                else:
                    approaches_text.append(str(approach))
            if approaches_text:
                parts.append(f"My therapeutic approaches include {' '.join(approaches_text)}")
        
        if therapist.other_techniques:
            parts.append(f"I use techniques such as {' '.join(therapist.other_techniques)}")
        
        # Services and demographics
        if therapist.services:
            parts.append(f"I provide services including {' '.join(therapist.services)}")
        
        if therapist.languages:
            parts.append(f"I speak {therapist.languages}")
        
        # Professional details
        if therapist.intro:
            parts.append(therapist.intro)
        
        if therapist.ideal_client:
            parts.append(f"I work best with {therapist.ideal_client}")
        
        return '. '.join(parts) + '.'

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        vec1_np = np.array(vec1)
        vec2_np = np.array(vec2)
        
        dot_product = np.dot(vec1_np, vec2_np)
        norm_vec1 = np.linalg.norm(vec1_np)
        norm_vec2 = np.linalg.norm(vec2_np)
        
        if norm_vec1 == 0 or norm_vec2 == 0:
            return 0.0
        
        return dot_product / (norm_vec1 * norm_vec2)

    def parse_criteria_from_query(self, query: str) -> List[str]:
        """Parse multiple criteria from a query string."""
        # Split by common connectors
        criteria = []
        
        # Split by AND (case insensitive)
        parts = re.split(r'\s+and\s+', query.lower(), flags=re.IGNORECASE)
        
        for part in parts:
            # Clean up each part
            part = part.strip()
            # Remove common prefixes
            part = re.sub(r'^(a\s+therapist\s+)?(who\s+)?(that\s+)?', '', part)
            if part and len(part) > 2:
                criteria.append(part)
        
        # If we didn't get multiple criteria, return the original query
        if len(criteria) <= 1:
            criteria = [query.strip()]
        
        print(f"Parsed criteria from '{query}': {criteria}")
        return criteria

    def transform_therapist_data(self, therapist: Therapist) -> dict:
        """Transform therapist data to match the API response format."""
        data = {
            'id': therapist.id,
            'name': therapist.name,
            'full_name': therapist.full_name,
            'pronouns': therapist.pronouns,
            'title': therapist.title,
            'credentials': therapist.credentials,
            'status': therapist.status,
            'intro': therapist.intro,
            'ideal_client': therapist.ideal_client,
            'rate_min': therapist.rate_min,
            'rate_max': therapist.rate_max,
            'free_consultation': therapist.free_consultation,
            'practicing_since': therapist.practicing_since,
            'languages': therapist.languages,
            'services': therapist.services,
            'insurance': therapist.insurance,
            'other_techniques': therapist.other_techniques,
            'other_issues': therapist.other_issues,
            'url': therapist.url
        }

        # Transform approaches
        if therapist.approaches:
            data['approaches'] = [approach for approach in therapist.approaches]
        else:
            data['approaches'] = None

        # Transform specialities
        if therapist.specialities:
            data['specialities'] = [speciality for speciality in therapist.specialities]
        else:
            data['specialities'] = None

        return data

    def search_therapists(
        self, 
        db: Session, 
        query: str, 
        limit: int = 300,
        insurance: Optional[List[str]] = None,
        titles: Optional[List[str]] = None
    ) -> list[dict]:
        """Search for therapists using multi-criteria semantic similarity with optional filtering."""
        print(f"Search query: {query}")
        print(f"Filters - Insurance: {insurance}, Titles: {titles}")
        
        # Parse multiple criteria from the query
        criteria = self.parse_criteria_from_query(query)
        
        # Start with base query
        base_query = db.query(Therapist)

        # Apply filters if provided
        if insurance:
            base_query = base_query.filter(Therapist.insurance.overlap(insurance))
        if titles:
            base_query = base_query.filter(Therapist.title.in_(titles))

        # Get all therapists matching the filters
        all_therapists = base_query.all()
        print(f"Found {len(all_therapists)} therapists after filtering")
        
        if len(criteria) > 1:
            print(f"Using multi-criteria scoring for {len(criteria)} criteria: {criteria}")
            
            # Score each therapist based on how well they match all criteria
            scored_therapists = []
            
            for therapist in all_therapists:
                score, matched_count = self.calculate_multi_criteria_score(therapist, criteria)
                scored_therapists.append((therapist, score, matched_count))
            
            # Sort by score (highest first), then by matched criteria count
            scored_therapists.sort(key=lambda x: (x[1], x[2]), reverse=True)
            
            # Take top results
            results = [therapist for therapist, score, matched_count in scored_therapists[:limit]]
            
            # Print top scores for debugging
            print("Top 5 results:")
            for i, (therapist, score, matched_count) in enumerate(scored_therapists[:5]):
                print(f"{i+1}. {therapist.name}: score={score:.4f}, matched={matched_count}/{len(criteria)}")
        
        else:
            # Single criterion - use original vector search
            print("Using single criterion vector search")
            query_embedding = self.generate_embedding(query)
            
            results = base_query.order_by(
                text("embedding::vector <=> cast(:query_embedding as vector)")
            ).params(query_embedding=query_embedding).limit(limit).all()
        
        print(f"Returning {len(results)} results")

        # Transform the results to match the API response format
        transformed_results = [self.transform_therapist_data(therapist) for therapist in results]
        
        return transformed_results

    def update_therapist_embedding(self, db: Session, therapist: Therapist) -> None:
        """Update the embedding for a therapist's profile."""
        # Combine relevant fields for embedding with more context
        profile_parts = []
        
        # Basic information
        if therapist.title:
            profile_parts.append(f"I am a {therapist.title}.")
        if therapist.credentials:
            profile_parts.append(f"My credentials include {therapist.credentials}.")
        if therapist.status:
            profile_parts.append(f"Current status: {therapist.status}.")
        
        # Professional description
        if therapist.intro:
            profile_parts.append(therapist.intro)
        if therapist.ideal_client:
            profile_parts.append(f"I work best with clients who {therapist.ideal_client}.")
        
        # Approaches and techniques
        if therapist.approaches:
            approaches_text = " ".join([f"{a.get('name', '')} {a.get('description', '')}" for a in therapist.approaches])
            profile_parts.append(f"My therapeutic approaches include: {approaches_text}")
        
        # Specialties and services
        if therapist.specialities:
            specialties_text = " ".join([f"{s.get('name', '')} {s.get('description', '')}" for s in therapist.specialities])
            profile_parts.append(f"I specialize in: {specialties_text}")
        
        if therapist.services:
            services_text = ", ".join(therapist.services)
            profile_parts.append(f"I offer services such as: {services_text}")
        
        if therapist.other_techniques:
            techniques_text = ", ".join(therapist.other_techniques)
            profile_parts.append(f"I use techniques including: {techniques_text}")
        
        if therapist.other_issues:
            issues_text = ", ".join(therapist.other_issues)
            profile_parts.append(f"I work with issues related to: {issues_text}")
        
        # Additional information
        if therapist.languages:
            profile_parts.append(f"I speak {therapist.languages}.")
        if therapist.practicing_since:
            profile_parts.append(f"I have been practicing since {therapist.practicing_since}.")
        if therapist.free_consultation:
            profile_parts.append("I offer a free initial consultation.")
        
        # Combine all parts into a single text
        profile_text = " ".join(profile_parts)
        
        # Print the combined text for reference
        print("\n=== Therapist Profile Text ===")
        print(f"Name: {therapist.name}")
        print(f"Title: {therapist.title}")
        print("\nCombined Text:")
        print("-" * 50)
        print(profile_text)
        print("-" * 50)
        print(f"Text length: {len(profile_text)} characters")
        print("=" * 50 + "\n")
        
        # Generate and update embedding
        embedding = self.generate_embedding(profile_text)
        therapist.embedding = embedding
        db.commit()
