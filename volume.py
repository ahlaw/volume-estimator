'''Script to estimate volume from 2D images'''
import argparse
import math

import cv2
import numpy as np

def main(images):
    '''Main entry point for script.'''
    # load first input image
    image = cv2.imread(images[0])

    # TODO: Process image
    # 23.81mm is the size of a quarter

    imgray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    imgray = cv2.GaussianBlur(imgray, (7, 7), 0)

    '''
    edged = cv2.Canny(imgray, 55, 100)
    edged = cv2.dilate(edged, None, iterations=1)
    edged = cv2.erode(edged, None, iterations=1)
    '''
   
    ret, thresh = cv2.threshold(imgray, 55, 255, cv2.THRESH_BINARY)

    _, contours, hierarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_NONE)
    largest_contours = sorted(contours, key=cv2.contourArea)[-2:]

    cv2.drawContours(imgray, largest_contours, -1, (0, 255, 0), 3)
    
    # Find pixel/mm scale
    quarter_diameter = 23.88
    coin_contour = np.vstack(largest_contours[1]).squeeze()
    x_values = [x for x, y in coin_contour]
    coin_contour_diameter = max(x_values) - min(x_values)
    scale = quarter_diameter / coin_contour_diameter 

    object_contour = np.vstack(largest_contours[0]).squeeze()
    object_contour = object_contour[object_contour[:, 1].argsort()]
    object_slices = {}
    for x, y in object_contour:
        if y not in object_slices:
            object_slices[y] = []
        object_slices[y].append(x)
    slice_areas = []
    for key in object_slices:
        radius = (max(object_slices[key]) - min(object_slices[key])) * scale / 2
        area = math.pi * radius ** 2
        slice_areas.append(area)

    return sum(slice_areas) * scale

if __name__ == '__main__':
    # store arguments in list args.image
    parser = argparse.ArgumentParser()
    parser.add_argument('image', nargs='*', help = "path to an image file")
    args = parser.parse_args()
    
    main(args.image)

