import os
import requests

def download_yolo_model(model_name='yolov8n.pt', save_path='models/'):
    # Create models directory if it doesn't exist
    os.makedirs(save_path, exist_ok=True)
    
    # Full URL for the model
    url = f'https://github.com/ultralytics/assets/releases/download/v0.0.0/{model_name}'
    
    # Full path where model will be saved
    full_path = os.path.join(save_path, model_name)
    
    try:
        # Send a GET request to download the model
        response = requests.get(url, stream=True)
        
        # Check if the request was successful
        if response.status_code == 200:
            # Open the file in write-binary mode
            with open(full_path, 'wb') as file:
                # Iterate over the response data in chunks
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
            
            print(f"Model {model_name} downloaded successfully to {full_path}")
            return full_path
        else:
            print(f"Failed to download the model. Status code: {response.status_code}")
            return None
    
    except Exception as e:
        print(f"An error occurred while downloading the model: {e}")
        return None

# Run the download
if __name__ == "__main__":
    download_yolo_model()