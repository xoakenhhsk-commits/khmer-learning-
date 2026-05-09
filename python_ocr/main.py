import sys
import json
import base64
from PIL import Image
from io import BytesIO
import pytesseract

# Ensure stdout uses utf-8 encoding for Khmer characters
sys.stdout.reconfigure(encoding='utf-8')

def extract_text_from_base64(base64_string):
    try:
        # Decode base64 image
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data))
        
        # NOTE: User MUST have tesseract installed on their Windows machine
        # and the 'khm' (Khmer) language data pack installed.
        # Download from: https://github.com/UB-Mannheim/tesseract/wiki
        
        # Perform OCR specifically for Khmer language
        text = pytesseract.image_to_string(image, lang='khm')
        
        # Process the text - rough splitting by lines to simulate extracting words/meanings
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        results = []
        for line in lines:
            if not line: continue
            
            # Simple heuristic: if it contains '=', it might be Grammar rule. If '-', it's vocab.
            if '=' in line:
                parts = line.split('=')
                results.append({
                    "type": "grammar",
                    "title": parts[0].strip(),
                    "content": parts[1].strip() if len(parts) > 1 else ""
                })
            else:
                parts = line.split('-')
                khmer_word = parts[0].strip()
                meaning = parts[1].strip() if len(parts) > 1 else "Chưa có nghĩa"
                
                # Mock phonetic generator for demo (in real life, use a dictionary lookup or NLP)
                mock_phonetic = khmer_word.replace(" ", "-") # Placeholder
                
                if khmer_word:
                    results.append({
                        "type": "vocab",
                        "khmerWord": khmer_word,
                        "meaningVi": meaning,
                        "phoneticVi": mock_phonetic
                    })
        
        print(json.dumps({"success": True, "data": results}, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        base64_img = sys.argv[1]
        extract_text_from_base64(base64_img)
    else:
        print(json.dumps({"success": False, "error": "No image data provided"}))
