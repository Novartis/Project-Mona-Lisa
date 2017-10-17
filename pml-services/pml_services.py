# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

from __future__ import print_function
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from random import randint
import base64
from pml_database import PMLDatabase
from pml_storage import PMLStorage

import sys
pml_ml_path = '/path/to/ml/repo/TODO'
sys.path.insert(0, pml_ml_path)
from pml_image import PMLImage
from pml_net import PMLNet
from pml_predictor import PMLPredictor


#########################
### Project Mona Lisa ###
#########################

##############################
### Flask backend services ###
##############################

app = Flask(__name__)
CORS(app)

###################
### Keras Model ###
###################
data_dir = '/path/to/dir/with/data'
model = PMLNet(data_dir).load_model()

# config variables for the database and storage in AWS:
db_name_prompt = 'TODO'
db_name_collect = 'TODO'
storage_name_prompt = 'TODO'
storage_name_collect = 'TODO'


@app.route('/v1/training/shapes/prompt', methods=['GET'])
def get_prompt_all_modes():
    """ Get route for training images of all modes.

    Returns:
        HTTP response: (application/json) containing:
            {
                "imgData" : "<base64 encoded string>",
                "label" : "<label for the image>",
            }
    """
    return get_prompt()


@app.route('/v1/training/shapes/prompt/<modename>', methods=['GET'])
def get_prompt(modename='all'):
    """ Get route for training images of a certain mode.

    Args:
        modename (str): the training mode. For example:
            basic, original ...
    Returns:
        HTTP response: (application/json) containing:
            {
                "img_data" : "<base64 encoded string>",
                "label" : "<label for the image>",
            }
    """
    try:
        item = PMLDatabase(db_name_prompt, modename).get_prompt_item()
        filename = item['filename']

        img_data = PMLStorage(storage_name_prompt)\
            .get_item_from_storage(filename)

        item_json = jsonify(img_data=img_data, label=item['label'])
        return item_json  # includes status code 200
    except Exception as e:
        response = make_response('An error occurred: ' + str(e))
        response.status_code = 400
        return response


@app.route('/v1/training/shapes/sketch', methods=['POST'])
def post_training_sketch():
    """ Post method for hand-drawn images for training.

        Args (from the POST Request):
            img (str): base64 encoded image data.
            label (str): given label for the image.
            username (str): Novartis 5-2-1 of the user.
            is_mobile (str): 'true' if using mobile,
                otherwise 'false'.

        Returns:
            HTTP response: String saying "Image Successfully uploaded."
                with status code 200, otherwise an error will be thrown
                and status code 400 will be returned with the error.
    """
    try:
        # arguments:
        json_args = request.get_json(force=True)
        img = json_args['img']
        label = json_args['label']
        username = json_args['username']
        is_mobile = json_args['is_mobile']

        # posting item in database
        newID = PMLDatabase(db_name_collect).get_new_id()
        item = {
            'id': newID,
            'label': label,
            'username': username,
            'is_mobile': is_mobile,
        }

        PMLDatabase(db_name_collect).post_item_in_db(item)

        # posting item in storage
        # strip the prefix off the image data:
        img = img.lstrip('data:image/png;base64')
        img = base64.b64decode(img)
        PMLStorage(storage_name_collect)\
            .post_item_in_storage(newID, img)

        response = make_response('Image successfully uploaded.')
        response.status_code = 200
        return response
    except Exception as e:
        response = make_response(
            'An error has occurred: '+str(e) + ".")
        response.status_code = 400
        return response


@app.route('/v1/leaderboard', methods=['GET'])
def get_leaderboard():
    """ Get method for the ML-PRJ training leaderboard.

        Returns:
            HTTP response: (application/json) object formatted like:
            {
                "<exampleUserName1>": {
                    "count":<countValue>
                },
                "<exampleUserName2>": {
                     "count":<countValue>
                },
            }
            with status code 200, otherwise status code 400 is
            returned along with the error.
    """
    try:
        primary_key = 'username'
        leaderboard = PMLDatabase(db_name_collect)\
            .get_attr_count_map(primary_key)
        response_json = jsonify(leaderboard)
        return response_json  # automatically includes status code 200.
    except Exception as e:
        response = make_response('An error occurred: ' + str(e))
        response.status_code = 400
        return response


@app.route('/v1/training/modes', methods=['GET'])
def get_modes():
    """ Get method for the ML-PRJ training modes.

        Returns:
            HTTP response: (application/json) object formatted like:
            {
                "<exampleModeName1>": {
                    "count":<countValue>
                },
                "<exampleModeName2>": {
                     "count":<countValue>
                },
            }
            with status code 200, otherwise status code 400 is
            returned along with the error.
    """
    try:
        primary_key = 'modename'
        modes = PMLDatabase(db_name_prompt)\
            .get_attr_count_map(primary_key)
        response_json = jsonify(modes)
        return response_json  # automatically includes status code 200.
    except Exception as e:
        response = make_response('An error occurred: ' + str(e))
        response.status_code = 400
        return response


@app.route('/v1/prompt/add', methods=['POST'])
def add_prompt():
    """ Post method adding custom training images.

        Args (from the POST Request):
            img (str): base64 encoded image data
            label (str): given label for the image
            mode (str): modename to categorize the image
            username (str): Novartis 5-2-1 of the user
            is_mobile (str): 'true' if using mobile,
                otherwise 'false'

        Returns:
            HTTP response: String saying "Image Successfully uploaded."
                with status code 200, otherwise an error will be thrown
                and status code 400 will be returned with the error.
    """
    try:
        json_args = request.get_json(force=True)
        img = json_args['img']
        label = json_args['label']
        mode = json_args['mode']
        username = json_args['username']
        filename = label + '.svg'

        newID = str(randint(0, 10**12))
        item = {
            'id': newID,
            'label': label,
            'filename': filename,
            'mode': mode,
            'modename': mode,
            'username': username,
            'is_custom': 'true',
        }

        # check if filename exists in the database
        key = "filename"
        database = PMLDatabase(db_name_prompt)
        filenames = database.get_attr_count_map(key)

        if filename in filenames:
            raise ValueError('The filename: %s is already in use' % (filename))
        # filename does not exist, post in database
        database.post_item_in_db(item)
        # posting item in storage
        # strip the prefix off the image data:
        img = img.lstrip('data:image/svg+xml;base64,')
        img = base64.b64decode(img)
        PMLStorage(storage_name_prompt)\
            .post_item_in_storage(label, img, 'svg')

        response = make_response('Image successfully uploaded.')
        response.status_code = 200
        return response
    except Exception as e:
        response = make_response('An error has occurred: '+str(e) + ".")
        response.status_code = 400
        return response


@app.route('/v1/diagram/predict', methods=['POST'])
def post_predicted_img():
    """ Post method for getting a predicted image from a png

    Args (from the GET Request):
        img (str): base64 encoded image data.

    Returns:
        HTTP response: (application/json) containing:
            {
                "img_data" : "<base64 encoded string>",
                "label" : "<label for the image>",
            }
    """
    try:
        json_args = request.get_json(force=True)
        img = json_args['img']

        # strip the prefix off the image data:
        img = img.lstrip('data:image/png;base64')
        # save the img as a temporary file
        tmp_img_path = 'tmp_img.png'
        with open(tmp_img_path, 'wb') as f:
            f.write(base64.b64decode(img))

        # create the image file object
        pml_img_obj = PMLImage(tmp_img_path, tmp_img_path)
        pml_img_obj.process_img_for_predict()

        # get a numpy array from the png
        processed_img_array = pml_img_obj.img_obj_to_array()
        # now feed the img into the conv net. and
        # get the prediction label
        # model is a global variable defined near the top of the file.
        pml_predictor = PMLPredictor(data_dir, model)
        pred_label = pml_predictor.predict(processed_img_array)

        # get the cooresponding svg img:
        # meta-data from the database:
        item = PMLDatabase(db_name_prompt)\
            .get_predict_item(pred_label)
        filename = item['filename']
        # getting the svg from storage:
        img_data = PMLStorage(storage_name_prompt)\
            .get_item_from_storage(filename)

        # send the data as a response (application/ json)
        item_json = jsonify(
            img_data=img_data,
            label=pred_label
        )
        return item_json  # includes status code 200

    except Exception as e:
        response = make_response('An error has occurred: '+str(e) + ".")
        response.status_code = 400
        return response

# use for local testing:
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
