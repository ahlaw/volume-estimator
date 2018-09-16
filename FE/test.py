import argparse

def main(str):
    print(str)

if __name__ == '__main__':
    # store arguments in list args.image
    parser = argparse.ArgumentParser()
    parser.add_argument('string', nargs='*', help = "path to an image file")
    args = parser.parse_args()
    
    main(args.string)