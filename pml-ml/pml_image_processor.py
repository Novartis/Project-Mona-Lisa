# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

from __future__ import print_function
import os
import sys

from scipy import misc
import numpy as np
from pml_image import PMLImage


class PMLImageProcessor:
    """ Project Mona Lisa (PML) Image Processor class processes
        training images from the collected data. Each process in
        PMLImageProcessor processes all images from the source
        directory and saves the processed images in the destination
        directory.
    """

    def __init__(self, source_dir, destination_dir):
        """
            Args:
                source_dir (str): the source directory where all of
                    the images to be processed are stored.
                destination_dir (str): the destination directory where
                    all of the images to be processed will be stored
                    after any given PMLImageProcessor process is taken
                    effect.
        """
        self.source_dir = source_dir
        self.destination_dir = destination_dir

    def process_imgs(self, p_type):
        """ Helper function to processes all images from the source
            directory, with a process specified by <p_type>. The user
            should not use this function directly, but instead use one of: grey_imgs(), crop_imgs() or resize_imgs().

            Args:
                p_type (str): can be one of:
                    grey, crop, resize.

            Returns:
                (bool) True if successful, otherwise an error is
                thrown.
        """
        print('processing images from:\n%s\nto\n%s . . .' % (
            self.source_dir, self.destination_dir))
        source_filenames = os.listdir(self.source_dir)

        # filter out only the png files on the directory
        source_filenames = filter(
            lambda x: x.split('.')[-1] == 'png',
            source_filenames)

        success_count = 0
        for filename in source_filenames:
            source_path = '%s/%s' % (self.source_dir, filename)
            destination_path = '%s/%s' % (self.destination_dir, filename)

            # check if the file already exists in the destination
            if os.path.isfile('%s/%s' % (
                    destination_path, filename)):
                continue

            # the process function returns a boolean:
            is_successful = self.get_process_func(
                p_type,
                source_path,
                destination_path)
            success_count += int(is_successful)

            # print the status of the process to the user:
            status_message =\
                '%d images successfully processed out of %d'\
                % (success_count, len(source_filenames))
            self.print_status(status_message)
        print('\nprocessing images done.')
        return True

    def get_process_func(self, p_type, source_path, destination_path):
        ''' Helper function for the process_imgs() method.

            Args:
                p_type (str): p_type specified in process_imgs()
                source_path (str): the source path of the single image
                    file to be processed.
                destination_path (str): the destination path of the
                    single image file to be processed.

            Returns:
                the output of the process_function() specified by
                <p_type>
        '''
        pml_image = PMLImage(source_path, destination_path)
        p_types_dict = {
            'grey': pml_image.grey_img,
            'crop': pml_image.crop_img,
            'resize': pml_image.resize_img
        }
        return p_types_dict[p_type]()

    def grey_imgs(self):
        """ This method will process all images in the source
        directory as specified in the grey_img() method in the
        PMLImage class and save them in the destination directory with
        the same filename.
        """
        return self.process_imgs('grey')

    def crop_imgs(self):
        """ This method will process all images in the source
        directory as specified in the crop_img() method in the
        PMLImage class and save them in the destination directory with
        the same filename.
        """
        return self.process_imgs('crop')

    def resize_imgs(self):
        """ This method will process all images in the source
        directory as specified in the resize_img() method in the
        PMLImage class and save them in the destination directory with
        the same filename.
        """
        return self.process_imgs('resize')

    def print_status(self, message):
        """ Method to print the <message> over the prevously printed
            line.
        """
        sys.stdout.write('\r%s' % (message))
        sys.stdout.flush()
