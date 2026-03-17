import re

def clean_number(value_str):
    """
    Cleans raw text data (e.g., '250K', '5.2%', '1.2B') into a float.
    """
    if not value_str or value_str.strip() == "":
        return None
    
    # Remove %, commas, and other non-numeric symbols except dots and signs
    clean_val = re.sub(r'[^\d\.\-\+KMB]', '', value_str.upper())
    
    multiplier = 1
    if 'K' in clean_val:
        multiplier = 1000
    elif 'M' in clean_val:
        multiplier = 1000000
    elif 'B' in clean_val:
        multiplier = 1000000000
    
    # Remove letters
    clean_val = re.sub(r'[KMB]', '', clean_val)
    
    try:
        return float(clean_val) * multiplier
    except ValueError:
        return None

def calculate_sentiment(event_name, actual, forecast):
    """
    Determines if the actual number is better (1), worse (-1), or neutral (0) than forecast.
    Note: For some events like 'Unemployment Rate', a lower number is better.
    This is a simplified version; in a real app, we'd have a mapping of event types.
    """
    if actual is None or forecast is None:
        return 0
    
    # Check for 'Unemployment' or 'Claims' where lower is usually better
    lower_is_better_keywords = ['unemployment', 'claims', 'jobless', 'cpi', 'inflation'] # CPI/Inflation is tricky, but usually targets are lower
    
    # Very basic logic: if 'unemployment' in name, lower is better.
    # For now, let's assume higher is better unless specified.
    
    if any(kw in event_name.lower() for kw in lower_is_better_keywords):
        if actual < forecast: return 1
        if actual > forecast: return -1
    else:
        if actual > forecast: return 1
        if actual < forecast: return -1
        
    return 0
