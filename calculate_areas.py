import os
import pandas as pd
import cv2
from pdf2image import convert_from_path
import argparse

def convert_pdf_to_images(pdf_path, output_folder):
    images = convert_from_path(pdf_path)
    os.makedirs(output_folder, exist_ok=True)
    for i, image in enumerate(images):
        image_path = os.path.join(output_folder, f"page_{i+1}.jpg")
        image.save(image_path, "JPEG")

def calculate_area(image_path):
    image = cv2.imread(image_path)
    height, width, _ = image.shape
    
    # Define the coordinates of the squares representing ads
    ad_squares = [(0, 0, width // 2, height // 2),  # Top-left square
                  (width // 2, 0, width, height // 2),  # Top-right square
                  (0, height // 2, width // 2, height),  # Bottom-left square
                  (width // 2, height // 2, width, height)]  # Bottom-right square
    
    ad_area = 0
    for square in ad_squares:
        x1, y1, x2, y2 = square
        ad_area += (x2 - x1) * (y2 - y1)
    
    topta_area = width * height - ad_area
    
    return ad_area, topta_area

def process_images(image_folder):
    image_files = [f for f in os.listdir(image_folder) if os.path.isfile(os.path.join(image_folder, f))]
    data = []
    for image_file in image_files:
        image_path = os.path.join(image_folder, image_file)
        area = calculate_area(image_path)
        data.append({'image': image_file, 'area': area})
    return data

def save_to_excel(data, output_file):
    df = pd.DataFrame(data)
    df.to_excel(output_file, index=False)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Calculate areas from PDF images')
    parser.add_argument('pdf_path', type=str, help='Path to the input PDF file')
    args = parser.parse_args()

    pdf_path = args.pdf_path
    output_folder = 'input/output'

    convert_pdf_to_images(pdf_path, output_folder)