<<<<<<< HEAD
from flask import Flask, render_template, redirect, url_for, request, session
=======
from flask import Flask, render_template, redirect, url_for, request
>>>>>>> 991e8faedbd6d07713d6b15d1f9b424465cd45b7
import random
import json
import numpy as np
import cv2
import math
<<<<<<< HEAD
import os
import tensorflow as tf

# this file holds the structure for the custom ResidualUnit layer in my CNN architecture
from machine_learning.ResidualUnit import ResidualUnit

my_tf_saved_model = tf.keras.models.load_model('./machine_learning/my_doodle_model2.4.1.h5', custom_objects={'ResidualUnit': ResidualUnit})


app = Flask(__name__)
app.secret_key = os.urandom(20)


# helper functions

def get_random_word():
    # get random category from categories text file and pass to template
    with open("categories.txt", "r") as f:
        content_list = f.readlines()
    word = random.choice(content_list)
    return word

def write_storage(data):
    with open('storage.json', 'w') as j_file:
        json.dump(data, j_file)

def read_storage():
    with open('storage.json', 'r') as j_file:
        data = json.load(j_file)
    return data
=======


app = Flask(__name__)
>>>>>>> 991e8faedbd6d07713d6b15d1f9b424465cd45b7


@app.route('/')
def index():
<<<<<<< HEAD
    # get random word on website load
    word = get_random_word()
    data = {
        'word': word,
        'message': f'Can you draw a {word}?'
    }
    write_storage(data)

    return render_template('index.html')


@app.route('/new-word')
def new_word():
    data = read_storage()

    word = get_random_word()
    message = f'Can you draw a {word}?'
    data = {
        'word': word,
        'message': message
    }

    write_storage(data)

    return render_template('cards.html', word=word, message=message)

@app.route('/cards')
def cards():
    data = read_storage()
    word = data['word']
    message = data['message']
=======
    return render_template('index.html')

@app.route('/cards')
def cards():
    # get random category from categories text file and pass to template
    cat_file = open("categories.txt", "r")
    content_list = cat_file.readlines()
    word = random.choice(content_list)

    # message to be displayed as what ROBOT is saying
    message = f'Can you draw {word}?'
>>>>>>> 991e8faedbd6d07713d6b15d1f9b424465cd45b7

    return render_template('cards.html', word=word, message=message)

@app.route('/post-pixel-data', methods=['GET', 'POST'])
def get_post_pixel_data():
<<<<<<< HEAD
    ##### PROCESS IMAGE

=======
>>>>>>> 991e8faedbd6d07713d6b15d1f9b424465cd45b7
    # get image pixel data from post request
    data = request.form.to_dict(flat=False)
    image = data['data[]']

    # change to numpy array
    image = np.array(image, dtype=np.uint8)
<<<<<<< HEAD
    # reshape flattened image to a square
    side_len = int(math.sqrt(image.shape[0]))

    # image = np.resize(image, (side_len, side_len))
    image.resize((side_len, side_len))
=======

    # reshape flattened image to a square
    side_len = int(math.sqrt(image.shape[0]))
    image = np.resize(image, (side_len, side_len))
>>>>>>> 991e8faedbd6d07713d6b15d1f9b424465cd45b7

    # now resize it to 28x28 which the machine learning model accepts
    # using openCV for the resizing
    resized_image = cv2.resize(image, dsize=(28, 28), interpolation=cv2.INTER_CUBIC)

<<<<<<< HEAD
    model_input = np.array(resized_image, dtype=np.uint8).reshape((-1, 28, 28))

    # debugging: this is what the model is accepting as input
    for i in range(28):
        for j in range(28):
            if model_input[0, i, j] < 10:
                print(model_input[0, i, j], end="")
                print("   ", end="")
            elif model_input[0, i, j] < 100:
                print(model_input[0, i, j], end="")
                print("  ", end="")
            else:
                print(model_input[0, i, j], end="")
                print(" ", end="")
        print('')

    class_names = None
    # these class names' order are compatible with the model
    with open('class_names.txt') as f:
        class_names = f.readlines()

    class_predictions = my_tf_saved_model.predict(model_input)
    # get top 5 predict indices
    predict_indices = np.argsort(class_predictions, axis=1)[:, -5:]
    predict_classes = [class_names[i] for i in predict_indices[0]]
    print(predict_classes)

    ##### UPDATE MESSAGE

    # get data in storage file
    data = read_storage()

    word = data['word']
    message = ''

    # remove spaces and newlines for comparison
    predict_classes = [c.rstrip() for c in predict_classes]
    word = word.rstrip()

    if word in predict_classes:
        message = 'Nice, you got it right!'
    else:
        message = f'Hmm, your {word} looks like a {predict_classes}. Try again!'

    data = {
        'word': word,
        'message': message
    }
    # put updated data in storage file
    write_storage(data)

    return ' '
=======
    print(resized_image)

    return {'data': data}
>>>>>>> 991e8faedbd6d07713d6b15d1f9b424465cd45b7



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000)