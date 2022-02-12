from flask import Flask, render_template, redirect, url_for, request
import random
import json
import numpy as np
import cv2
import math


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cards')
def cards():
    # get random category from categories text file and pass to template
    cat_file = open("categories.txt", "r")
    content_list = cat_file.readlines()
    word = random.choice(content_list)

    # message to be displayed as what ROBOT is saying
    message = f'Can you draw {word}?'

    return render_template('cards.html', word=word, message=message)

@app.route('/post-pixel-data', methods=['GET', 'POST'])
def get_post_pixel_data():
    # get image pixel data from post request
    data = request.form.to_dict(flat=False)
    image = data['data[]']

    # change to numpy array
    image = np.array(image, dtype=np.uint8)

    # reshape flattened image to a square
    side_len = int(math.sqrt(image.shape[0]))
    image = np.resize(image, (side_len, side_len))

    # now resize it to 28x28 which the machine learning model accepts
    # using openCV for the resizing
    resized_image = cv2.resize(image, dsize=(28, 28), interpolation=cv2.INTER_CUBIC)

    print(resized_image)

    return {'data': data}



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000)