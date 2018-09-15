'''Script to estimate volume from 2D images'''
import argparse
import cv2

def main(images):
    '''Main entry point for script.'''
    # load first input image
    image = cv2.imread(images[0])

    # TODO: Process image
    # 23.81mm is the size of a quarter

    imgray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
   
    ret, thresh = cv2.threshold(imgray, 55, 255, cv2.THRESH_BINARY)

    _, contours, hierarchy = cv2.findContours(thresh,1,2)
    
    largest_contours = sorted(contours, key=cv2.contourArea)[-2:]

    cv2.drawContours(imgray, largest_contours, -1, (0, 255, 0), 3)
    
    # Warning: sketchy logic
    quarter_size = 23.81
    coin_diameter = largest_contours[1].flat[-2] - largest_contours[1].flat[0]
    scale = coin_diameter / quarter_size
    print(scale)

    # TODO: Delete when no needed
    '''
    cv2.imshow("image", imgray)
    while True:
        key = cv2.waitKey(0)
        if key == 27:
            break
    cv2.waitKey(0)
    '''

if __name__ == '__main__':
    # store arguments in list args.image
    parser = argparse.ArgumentParser()
    parser.add_argument('image', nargs='*', help = "path to an image file")
    args = parser.parse_args()
    
    main(args.image)

