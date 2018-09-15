'''Script to estimate volume from 2D images'''
import argparse
import cv2

import image_scale as IS

def main(images):
    '''Main entry point for script.'''
    # load first input image
    image = cv2.imread(images[0])

    # TODO: Process image
    scale = IS.get_image_scale(image)

    # TODO: Delete when no needed
    cv2.imshow("image", image)
    cv2.waitKey(0)


if __name__ == '__main__':
    # store arguments in list args.image
    parser = argparse.ArgumentParser()
    parser.add_argument('image', nargs='*', help = "path to an image file")
    args = parser.parse_args()
    
    main(args.image)

