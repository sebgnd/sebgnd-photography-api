import os
from PIL import Image
import mysql.connector
import sys

CATEGORIES_PATH = '..\..\categories'
SIZE = 'full_res'
DB = 'photography'

def insert_size_into_db(id, width, height, db):
    cursor = db.cursor()
    sql = 'UPDATE images SET width = %s, height = %s WHERE id = %s'
    val = (width, height, id)
    cursor.execute(sql, val)
    db.commit()

def get_size_from_image(image_path):
    im = Image.open(image_path)
    return im.size

def get_images_from_path(path):
    images = {}
    for entry in os.listdir(path):
        image = os.path.join(path, entry)
        imageId = entry.split('.')[0]
        if os.path.isfile(image):
            images[imageId] = image
    return images

def get_image_folders():
    folders = []
    for entry in os.listdir(CATEGORIES_PATH):
        folder = os.path.join(CATEGORIES_PATH, entry)
        if os.path.isdir(folder):
            size_folder = os.path.join(folder, SIZE)
            folders.append(size_folder)
    return folders

def main():
    if len(sys.argv) not in [3, 4]:
        print("Wrong command: py add_size.py 'host' 'user' ['password']")
        return

    host = sys.argv[1]
    user = sys.argv[2]
    password = '' if len(sys.argv) == 3 else sys.argv[3]

    try:
        db = mysql.connector.connect(
            host = host,
            user = user,
            password = password,
            database = DB
        )

        if db.is_connected():
            folders = get_image_folders()

            for folder in folders:
                images = get_images_from_path(folder)
                for imageId, path in images.items():
                    width, height = get_size_from_image(path)
                    insert_size_into_db(imageId, width, height, db)
    except Exception as e:
        print(e)



if __name__ == '__main__':
    main()
