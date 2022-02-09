from flask import Flask, render_template, redirect, url_for, request
import random

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cards')
def cards():
    cat_file = open("categories.txt", "r")
    content_list = cat_file.readlines()
    word = random.choice(content_list)

    message = f'Can you draw {word}?'

    return render_template('cards.html', word=word, message=message)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000)