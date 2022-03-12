import json

class Storage:
    def __init__(self, filename):
        self.filename = filename

    def write(self, data):
        with open(self.filename, 'w') as j_file:
            json.dump(data, j_file)

    def read(self):
        with open(self.filename, 'r') as j_file:
            data = json.load(j_file)
        return data