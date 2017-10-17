# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

from __future__ import print_function

import keras
from keras.models import Sequential
from keras.models import model_from_json
from keras.layers import Conv2D, MaxPooling2D, Activation
from keras.layers import Dropout, Flatten, Dense
from keras.layers import Conv2D, MaxPooling2D
from keras.layers.normalization import BatchNormalization

from pml_data import PMLData
import numpy as np
import json


class PMLNet:
    """ Project Mona Lisa (PML) Net class is the high-level interface
        for the deep learning layer for the PML machine-learning
        assisted diagramming application. The main purpose of this
        class is to handle the pipeline between loading data and
        building the deep learning architecture for training and
        predicting images. PMLTrainer and PMLPredictor are subclasses
        of PMLNet, to be specifically used for training and predicting.
    """

    def __init__(self, data_dir):
        """
            Args:
                data_dir (str): absolute path of the directory where
                    all of the downloaded data will be stored.
        """
        self.data_dir = data_dir
        self.model_json_fn = 'model.json'
        self.model_weights_fn = 'model.h5'

    def load_data(self):
        """ Uses PMLData's load_data() method to load data from the
            data directory.
        """
        pml_data = PMLData('all', self.data_dir)
        (x_train, y_train), (x_test, y_test) = pml_data.load_data()
        return (x_train, y_train), (x_test, y_test)

    def preprocess_load_data(self, x_train, y_train, x_test, y_test):
        """ Method to preprocess the data after it has been loaded,
            so the training images and labels are appropriately
            formatted to be fed into the deep learning model.

            Args:
                x_train (numpy array).
                y_train (numpy array).
                x_test (numpy array).
                y_test (numpy array).
        """

        x_train = x_train.reshape(
            x_train.shape[0], x_train.shape[1], x_train.shape[2], 1)
        x_test = x_test.reshape(
            x_test.shape[0], x_test.shape[1], x_test.shape[2], 1)

        y_train = self.labels_to_ints(y_train)
        y_test = self.labels_to_ints(y_test)

        x_train = x_train.astype('float32')
        x_test = x_test.astype('float32')

        x_train /= 255.
        x_test /= 255.

        n_classes = len(set(y_train))

        y_train = keras.utils.to_categorical(y_train, n_classes)
        y_test = keras.utils.to_categorical(y_test, n_classes)

        return (x_train, y_train), (x_test, y_test)

    def get_input_shape(self):
        """
        """
        return (128, 128, 1)

    def get_n_classes(self):
        """
        """
        return 17

    def conv_section(self, model, kernel_size, n_filters, input_shape=None, max_pool=True):
        """
        """
        if input_shape == None:
            model.add(Conv2D(n_filters, kernel_size))
        else:
            model.add(Conv2D(n_filters, kernel_size,
                             input_shape=input_shape))
        model.add(Activation('relu'))
        if max_pool:
            model.add(MaxPooling2D(pool_size=(2, 2)))
        return model

    def create_model(self):
        """
        """
        input_shape = self.get_input_shape()
        n_classes = self.get_n_classes()
        model = Sequential()
        # 4 conv. sections:
        model = self.conv_section(model, (3, 3), 32, input_shape=(128, 128, 1))
        model = self.conv_section(model, (3, 3), 32)
        model = self.conv_section(model, (3, 3), 64)
        model = self.conv_section(model, (3, 3), 64, max_pool=False)
        model = self.conv_section(model, (3, 3), 128, max_pool=False)
        # 3 fully connected layers:
        model.add(Flatten())
        model.add(Dropout(0.25))
        model.add(Dense(128))  # fully connected 1D layer
        model.add(Activation('relu'))
        model.add(Dropout(0.5))
        model.add(Dense(n_classes))
        model.add(Activation('softmax'))
        return model

    def labels_to_ints(self, y_array):
        """ Converts the array of strings to an array of integers,
            and saves the result as a json file, mapping strings
            to integers.
        """
        y_list = list(set([elem for elem in y_array]))
        y_list.sort()  # mutates

        # map the string labels to ints
        label_to_int_dict = {}
        int_labels = range(len(y_list))
        for i_label in int_labels:
            label_to_int_dict[y_list[i_label]] = i_label

        # save the mapping from labels to ints
        # to be used for predicting later:
        self.save_labels(label_to_int_dict)

        # create the new array with ints instead of strings
        y_int_array = []
        for label in y_array:
            y_int_array.append(label_to_int_dict[label])

        return np.array(y_int_array)

    def save_model(self, model):
        """
        """
        save_dir_model = self.data_dir
        json_path = '%s/%s' % (save_dir_model, self.model_json_fn)
        weights_path = '%s/%s' % (save_dir_model, self.model_weights_fn)
        # serialize model to JSON
        model_json = model.to_json()
        with open(json_path, 'w') as json_file:
            json_file.write(model_json)

        # serialize weights to HDF5
        model.save_weights(weights_path)
        print('saved model and weights to disk at %s and %s' % (
            json_path, weights_path))
        return True

    def load_model(self, load_dir_model=''):
        """ Loads the Keras model and returns the result as the
            Keras model object.
        """
        if load_dir_model == '':
            load_dir_model = self.data_dir
        json_path = '%s/%s' % (load_dir_model, self.model_json_fn)
        weights_path = '%s/%s' % (
            load_dir_model, self.model_weights_fn)

        json_file = open(json_path)
        model_json = json_file.read()
        json_file.close()
        model = model_from_json(model_json)

        # load weights into new model
        model.load_weights(weights_path)
        print('model loaded from disk')
        return model

    def save_labels(self, label_to_int_dict):
        """ TODO: save the dictionary mapping the (17) string labels
            to the integers that are produced by numpy.
        """
        # TODO: this is currently being done manually.
        return NotImplemented

    def int_label_to_str_label(self, pred_int, load_path_labels=''):
        """
        """
        # need to save labels to int json
        # or other way around
        # todo: make serparate fn and path for labels_dict json

        labels_path = '%s/labels_to_ints.json' % (self.data_dir)
        with open(labels_path) as json_data:
            labels_dict = json.load(json_data)
        ints_to_labels_dict = {}
        for label in labels_dict.keys():
            ints_to_labels_dict[str(labels_dict[label])] = label
        pred_str = ints_to_labels_dict[str(pred_int)]
        return pred_str

    def synthesize_train_imgs(self, n_per_img=20):
        """
        """
        pml_img = PMLImage()
