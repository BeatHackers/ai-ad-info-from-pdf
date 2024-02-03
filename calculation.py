import cv2
import sys
def calculate_area_percentage(image_path):
    # Load the image
    image = cv2.imread(image_path)

    # Display the image to the user
    cv2.imshow("Image", image)
    cv2.waitKey(0)

    # Get user input for selecting squares
    selected_squares = []
    while True:
        # Get user input for selecting a square
        print("Select a square by clicking and dragging the mouse. Press 'q' to quit.")
        square = cv2.selectROI("Image", image, fromCenter=False, showCrosshair=True)
        if square == (0, 0, 0, 0):
            break
        selected_squares.append(square)

    # Calculate the sum of areas of selected squares
    sum_of_areas = sum([w * h for x, y, w, h in selected_squares])

    # Calculate the area of the image
    image_area = image.shape[0] * image.shape[1]

    # Calculate the percentage of the ratio
    percentage = (sum_of_areas / image_area) * 100

    # Return the percentage
    return percentage

if __name__ == "__main__":
    # Get the image address from the command line
    if len(sys.argv) < 2:
        print("Please provide the image address as a command line argument.")
        sys.exit(1)
    image_address = sys.argv[1]

    # Call the function with the image address
    percentage = calculate_area_percentage(image_address)

    # Print the result
    print(f"The percentage of the ratio of sum of areas of selected squares to the image area is: {percentage}%")
