# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

from __future__ import print_function

import numpy as np
from scipy import misc


class PMLImage:
    """ Project Mona Lisa (PML) Image class processes a single
        training image from the collected data. Each process in
        PMLImage processes one image from the source path and saves
        the processed image in the destination directory path.
    """

    def __init__(self, source_path, destination_path):
        """
            Args:
                source_path (str): the source path where the image to be
                    processed is stored.
                destination_dir (str): the destination path where the
                    image to be processed will be stored after any given
                    PMLImage process is taken effect.
        """
        self.source_path = source_path
        self.destination_path = destination_path
        self.resize_dim = 128

    def process_img_for_predict(self):
        """ Method that pipelines the PMLImage grey_image(),
            crop_img(), and resize_img() methods and, for each,
            operates on the single image in the source path. In order
            for this method to work, the source path and destination
            path have to be equal.

            Returns:
                (bool) True if successful, otherwise an error is
                thrown.

        """
        assert self.source_path == self.destination_path
        greyed_img = self.grey_img()
        cropped_img = self.crop_img()
        resized_img = self.resize_img()
        return True

    def img_obj_to_array(self):
        """
            Returns: the saved image in the source directory as a numpy
                array.
        """
        return misc.imread(self.source_path)

    def grey_img(self):
        """ Converts the RGB png images file in the source path into
            a grey-scale image and saves the result in the destination
            directory.

            Returns:
                (bool) True if successful, otherwise an error is
                thrown.
        """
        # read the image as a numpy array
        img = misc.imread(self.source_path)
        lx, ly, _ = img.shape
        identity = np.identity(ly)

        # just get the saturation value in the third index of the
        # third dimension, and then create a 2 dimensional numpy array.
        greyed_img = np.dot(img[:, :, 3], identity)

        # save the numpy array as a grey-scale png image.
        misc.toimage(greyed_img, cmin=0.0, cmax=255.0)\
            .save(self.destination_path)
        return True

    def crop_img(self):
        """ Crops the source 2D png image into a square shape,
            where the new sides of the square is the side of
            the shortest side in the original image.

            Returns:
                (bool) True if successful, otherwise an error is
                thrown.
        """
        img = misc.imread(self.source_path)
        lx, ly = img.shape
        # the shortest side:
        coord_min = min(lx, ly)

        # cropping the images into a centered square, and the cropped
        # image will have side length of the shortest side (coord_min)
        crop_x = (lx - coord_min) / 2
        crop_y = (ly - coord_min) / 2

        new_x_coord_start = crop_x
        new_x_coord_end = crop_x + coord_min
        new_y_coord_start = crop_y
        new_y_coord_end = crop_y + coord_min

        crop_img = img[new_x_coord_start: new_x_coord_end,
                       new_y_coord_start: new_y_coord_end]

        # save the array as an image
        misc.imsave(self.destination_path, crop_img)
        return True

    def resize_img(self):
        """ Resizes the 2D source image into a square shape of
            <self.resize_dim> by <self.resize_dim>. This will magnify
            or shrink the image as needed to fit the new dimensions.

            Returns:
                (bool) True if successfil, otherwise an error is
                thrown.
        """
        img = misc.imread(self.source_path)
        size = (self.resize_dim, self.resize_dim)
        resized_img = misc.imresize(img, size)
        misc.imsave(self.destination_path, resized_img)
        return True

    def synthesize_img(self, n_per_img):
        """
        """
        datagen = ImageDataGenerator(
            rotation_range=40,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=False,
            fill_mode='nearest')

        img = misc.imread(self.source_path)

        filename = self.source_path.split('/')[-1]
        save_prefix = filename.split('.')[0]
        # the .flow() command below generates batches of randomly transformed images
        # and saves the results to the directory
        i = 0
        for batch in datagen.flow(
                x,
                batch_size=1,
                save_to_dir=source_dir,
                save_prefix='%s.%d' % (save_prefix, i),
                save_format='png'):
            i += 1
            if i > 20:
                break  # otherwise the generator would loop indefinitely
