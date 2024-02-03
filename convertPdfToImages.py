import os
from pdf2image import convert_from_path
import sys

# Path to the input PDF file
input_pdf = sys.argv[1]

# Output folder to store the images
output_folder = "input/output"

# Create the output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Convert each page of the PDF to an image and save it in the output folder
pages = convert_from_path(input_pdf)
for i, page in enumerate(pages):
    image_path = os.path.join(output_folder, f"page_{i+1}.jpg")
    page.save(image_path, "JPEG")
