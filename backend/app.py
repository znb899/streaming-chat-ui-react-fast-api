from flask import Flask, Response
from flask_cors import CORS
from time import sleep

app = Flask(__name__)

def dummy_text_generator():
    text = 'This is a sample text to test the app but could be any stream of text'
    for t in text.split():
        yield t + ' '
        sleep(3)

@app.route('/api/completion', methods=['POST'])
def stream():
    return Response(dummy_text_generator())

if __name__ == '__main__':
    app.run(port=3000)  
