import google.generativeai as genai

def verify_gemini_key(api_key):
    try:
        # Configure the library with your key
        genai.configure(api_key=api_key)
        
        # Attempt to list available models to verify connectivity
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                print(f"Success! Key is valid. Found model: {model.name}")
                return True
    except Exception as e:
        print(f"Error: {e}")
        return False

# Replace with your actual key
YOUR_KEY = "AIzaSyCMxza8GPAF7My4i-ewhsnnCs3lEPJakOc" 
verify_gemini_key(YOUR_KEY)
