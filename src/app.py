
from flask import Flask, render_template, redirect, url_for, request, jsonify
import random
import json
import numpy as np
import cv2
import math
import os
import tensorflow as tf

from storage import Storage
# this file holds the structure for the custom ResidualUnit layer in my CNN architecture
from machine_learning.ResidualUnit import ResidualUnit

my_tf_saved_model = tf.keras.models.load_model('./machine_learning/my_doodle_model2.4.1.h5', custom_objects={'ResidualUnit': ResidualUnit})


app = Flask(__name__)
app.secret_key = os.urandom(20)

storage = Storage('storage.json')

def get_random_word():
    # get random category from categories text file and pass to template
    with open("categories.txt", "r") as f:
        content_list = f.readlines()
    word = random.choice(content_list)
    return word


@app.route('/')
def index():
    # get random word on website load
    word = get_random_word()
    data = {
        'word': word,
        'message': f'Can you draw a {word}?'
    }
    storage.write(data)

    return render_template('index.html')


@app.route('/new-word')
def new_word():
    data = storage.read()

    word = get_random_word()
    message = f'Can you draw a {word}?'
    data = {
        'word': word,
        'message': message
    }

    storage.write(data)

    return render_template('cards.html', word=word, message=message)

@app.route('/cards')
def cards():
    data = storage.read()
    word = data['word']
    message = data['message']

    return render_template('cards.html', word=word, message=message)

@app.route('/post-pixel-data', methods=['GET', 'POST'])
def get_post_pixel_data():
    ##### PROCESS IMAGE

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
    resized_image = cv2.resize(image, dsize=(28, 28), interpolation=cv2.INTER_NEAREST)

    # create numpy array of shape (1, 28, 28) for model
    model_input = np.array(resized_image, dtype=np.uint8).reshape((-1, 28, 28))

    class_names = None
    # these class names' order are compatible with the model
    with open('categories.txt') as f:
        class_names = f.readlines()

    class_predictions = my_tf_saved_model.predict(model_input)
    # get top 5 predict indices
    predict_indices = np.argsort(class_predictions, axis=1)[:, -5:]
    top_prediction_idx = np.argmax(class_predictions, axis=-1)
    top_prediction = class_names[top_prediction_idx[0]]
    predict_classes = [class_names[i] for i in predict_indices[0]]


    ##### UPDATE MESSAGE

    # get data in storage file
    data = storage.read()

    word = data['word']
    message = ''

    # remove spaces and newlines for comparison
    predict_classes = [c.rstrip() for c in predict_classes]
    word = word.rstrip()

    status = 'failure'
    if word in predict_classes:
        status = 'success'     
    else:
        message = f'Hmm, your {word} looks like a {top_prediction}. Try again!'

    data = {
        'word': word,
        'message': message
    }
    # put updated data in storage file
    storage.write(data)

    # return status to javascript
    # 'success' if user got word right
    return status
    


@app.route('/get-label-data', methods=['GET', 'POST'])
def get_label_data():
    with open('label_data.json', 'r') as j_file:
        label_data = json.load(j_file)

    # get current word and send the label data for that word to the frontend
    data = storage.read()
    word = data['word'].rstrip()

    # flatten label data to send back to javascript
    flat_label_data = []
    for row in label_data[word]:
        for e in row:
            flat_label_data.append(e)

    
    return jsonify(flat_label_data)



if __name__ == "__main__":
    app.run(host='127.0.0.1', port=3000)