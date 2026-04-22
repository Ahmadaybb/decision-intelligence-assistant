
import joblib
import re
from textblob import TextBlob

# Load config
config = joblib.load('data/model_config.joblib')
urgency_keywords = config['urgency_keywords']
feature_cols = config['feature_cols']

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip().lower()

def extract_features(text: str) -> dict:
    blob = TextBlob(text)
    words = text.split()
    caps_words = [w for w in words if w.isupper() and len(w) > 1]
    
    return {
        'text_length': len(text),
        'word_count': len(words),
        'exclamation_count': text.count('!'),
        'caps_ratio': len(caps_words) / len(words) if words else 0,
        'sentiment_score': blob.sentiment.polarity,
        'urgency_keyword_count': sum(1 for k in urgency_keywords if k in text.lower())
    }