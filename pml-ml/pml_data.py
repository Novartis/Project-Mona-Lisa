# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

from __future__ import print_function
import os
from subprocess import Popen, PIPE
from shutil import rmtree
from time import sleep

import sys
pml_services_path = 'path/to/this/repo/TODO'
sys.path.insert(0, pml_services_path)
from pml_database import PMLDatabase
from pml_storage import PMLStorage
from pml_image_processor import PMLImageProcessor
from pml_image import PMLImage

import json
import numpy as np
from random import shuffle
from scipy import misc


class PMLData:
    """ Project Mona Lisa (PML) Data class is the high-level interface
        with the training data from the PML machine-learning assisted
        diagramming application. The main purpose of this class is to
        handle loading and preprocessing of data to be trained by the
        machine learning layer.
    """

    def __init__(self, mode, data_dir):
        """
            Args:
                mode (str): training mode.
                data_dir (str): absolute path of the directory where
                    all of the downloaded data will be stored.
        """
        # specified by user:
        self.mode = mode
        self.data_dir = data_dir
        self.resize_dim = 128

        # directories that are only temporarily used until the
        # preprocesing pipeline is complete:
        self.save_dir_original = '%s/original' % (self.data_dir)
        self.save_dir_greyed = '%s/greyed' % (self.data_dir)
        self.save_dir_cropped = '%s/cropped' % (self.data_dir)

        # directories that are kept after the preprocessing is
        # complete:
        self.save_dir_imgs = '%s/imgs' % (self.data_dir)
        self.save_path_labels = '%s/labels.json' % (self.data_dir)

        # parameters to be updated by the PML system admins:
        self.db_collect_name = 'TODO'
        self.db_prompt_name = 'TODO'
        self.storage_collect_name = 'TODO'
        self.storage_prompt_name = 'TODO'

    def setup_dirs(self):
        """ Helper function for download_train_data(). Creates all of
            the directories that are needed for the preprocessing
            pipeline if they do not already exist.

            Returns:
                (bool) True if successful, othewise an error is
                thrown.
        """
        dirs = [self.data_dir,
                self.save_dir_original,
                self.save_dir_greyed,
                self.save_dir_cropped,
                self.save_dir_imgs]

        for directory in dirs:
            if not os.path.exists(directory):
                # make the directory
                # TODO: try to use python instead of bash commands.
                Popen(['mkdir', directory])

        return True

    def download_train_data(self):
        """ Downloads the training images in <self.save_dir_original>

            Returns:
                bool: True if the images were sucessfully downloaded,
                    otherwise False.
        """
        print('downloading training images . . .')
        self.setup_dirs()

        # get the filenames of all images from the database.
        filenames, labels = PMLDatabase(
            self.db_collect_name,
            self.mode)\
            .get_all_items()

        # put the labels in the filenames
        new_filenames = []
        new_labels = []
        # skip_labels = ['kiwi', 'questionmark', 'iphone', 'wifi']
        for i_fn in range(len(filenames)):
            ###################################
            # if labels[i_fn] in skip_labels:
                # continue
            ###################################
            new_filenames.append(filenames[i_fn])
            new_labels.append(labels[i_fn])

        filenames = new_filenames
        labels = new_labels

        # save the labels in a json file:
        labels_dict = {}
        for i in range(len(filenames)):
            labels_dict[filenames[i].split('.')[0]] = labels[i]
        with open(self.save_path_labels, 'w') as fp:
            json.dump(labels_dict, fp)

        # download the image data and store it in
        # self.save_dir_original
        is_downloaded = PMLStorage(self.storage_collect_name)\
            .download_imgs(filenames, self.save_dir_original)

        print('to grey, crop, resize . . .')
        # grey, crop, and resize images:
        # resize from 3 color channels and saturation
        #  to only one saturation value from 0 to 255
        img_proc = PMLImageProcessor(
            data.save_dir_original,
            data.save_dir_greyed)
        img_proc.grey_imgs()
        # crop into a square shape
        img_proc = PMLImageProcessor(
            data.save_dir_greyed,
            data.save_dir_cropped)
        img_proc.crop_imgs()
        # resize the square to resize_dim x resize_dim
        #   as specified in PMLImageProcessor
        img_proc = PMLImageProcessor(
            data.save_dir_cropped,
            data.save_dir_imgs)
        img_proc.resize_imgs()

        # the resized_imgs directory is the final
        # directory where the images are located.
        # not remove the original, greyed, and cropped dirs
        remove_dirs = [
            self.save_dir_original,
            self.save_dir_greyed,
            self.save_dir_cropped
        ]
        for path in remove_dirs:
            rmtree(path)

        return True

    def load_data(self):
        """ Loads the data from data_dir into a shuffled numpy array
            and splits the image data and labels into 80% traing data
            and 20% test data.

            Returns:
                (tuple of numpy arrays): formatted as:
                (x_train, y_train), (x_test, y_test), where each
                array in the tuple of name starting with 'x' is
                formatted as:
                numpy array of images of shape:
                (<num_images>, 128, 128),
                and arrays of name starting with 'y' is formatted as:
                numpy arrar of ints of shape:
                (<num_images>,)
        """
        img_fns = os.listdir(self.save_dir_imgs)
        # random.shuffle mutates the list
        shuffle(img_fns)
        len_img_fns = len(img_fns)
        data_shape = (len_img_fns, self.resize_dim, self.resize_dim)
        x_array = np.empty(data_shape)

        for i_fn in range(len_img_fns):
            source_path = '%s/%s' % (self.save_dir_imgs, img_fns[i_fn])
            x_array[i_fn] = misc.imread(source_path)

        # load the label data
        labels_dict = {}
        with open(self.save_path_labels) as json_data:
            labels_dict = json.load(json_data)

        # iterate throught the filenames for the labels
        # in the same order as above for the images
        y_labels = [labels_dict[filename] for filename in img_fns]

        y_labels = np.array(y_labels)

        # not partition 80/20 into train and test:
        i_partition = int(x_array.shape[0] * 0.8)
        x_train, x_test = x_array[:i_partition], x_array[i_partition:]
        y_train, y_test = y_labels[:i_partition], y_labels[i_partition:]

        return (x_train, y_train), (x_test, y_test)

    def sync_collect_db_and_storage(self):
        """ This method currently returns how many items are out of
            sync from the database and storage respectively, in a
            print statement.

            Method to syncronize the meta-data in the database and
            the images in the storage. If an item is in the database
            but the cooresponding item is not in the storage,
            then that item is removed from the database. Likewise,
            if an item is in the storage but the cooresponding item is
            not in the database, then that item is removed from the storage.

            Returns:
                bool: True if successful, otherwise an error is thrown.
        """
        db_collect = PMLDatabase(self.db_collect_name)
        db_filenames = db_collect.get_all_items()[0]

        storage_collect = PMLStorage(self.storage_collect_name)
        storage_filenames = storage_collect.get_all_filenames()

        # get filenames that are in the db but not in storage
        db_extras = [fn for fn in db_filenames if fn not in storage_filenames]
        db_key = 'id'
        # strip off the ".png" at the end of the filenames
        ids = [value[:-4] for value in db_extras]
        # db_collect.remove_items(db_key, db_extras)

        # get filenames that are in storage but not in the db
        storage_extras = [fn for fn in storage_filenames if fn not in db_filenames]
        # storage_collect.remove_items(storage_extras)

        print('length of db extras = %d' % (len(db_extras)))
        print('length of storage extras = %d' % (len(storage_extras)))

        return True

if __name__ == '__main__':
    data_dir = 'TODO'
    mode = 'all'
    data = PMLData(mode, data_dir)

    ###
    # Start of pipeline:
    ###

    ###
    # need to activate virtual env from pml-services
    ###

    # data.sync_collect_db_and_storage()
    data.download_train_data()
