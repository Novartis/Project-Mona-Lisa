# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

from __future__ import print_function
import boto3
from boto3.dynamodb.conditions import Key
from random import randint
import os
import base64


class PMLStorage:
    """ Project Mona Lisa Storage class.
    """

    def __init__(self, storage_name):
        self.storage_name = storage_name

    def get_bucket(self):
        """
            Returns:
                (obj): The boto3 AWS S3 bucket object.
        """
        s3 = boto3.resource('s3', region_name='TODO')
        return s3.Bucket(self.storage_name)

    def get_item_from_storage(self, item_key):
        """ Get method for a image data in ML-PRJ image storage.

            Args:
                bucket_name (str): name for the storage.
                item_key (str): key or filename for the item in storage.

            Returns:
                item (obj)
        """
        # get the image data in the S3 bucket
        img_obj = self.get_bucket().Object(item_key)
        return str(img_obj.get()['Body'].read())

    def post_item_in_storage(self, key, body, type='png'):
        """ Posting collected image data in storage.

            Args:
                key (str): The unique key.
                body (obj): the bulk data to be stored.
                type (str): file suffix. The default is 'png'.

            Returns:
                bool: True if successful, otherwise, an error will
                be thrown.
        """
        self.get_bucket().put_object(
            Key=key+str('.')+type,
            Body=body,
            ServerSideEncryption='AES256',
            ContentType='img/'+type,
        )
        return True

    def download_imgs(self, load_fns, save_dir):
        """ Downloads all files in <load_fns> from storage to
            the directory <save_dir>.

            Args:
                load_fns (list(str)): A list of strings of the filenames
                    of the files to be downloaded.
                save_dir (str): A string of the source directory to
                    save the files. Formatted as:
                    /full/path/to/dir  ...  without a '/' character at
                    the end of the <save_dir>.

            Returns:
                bool: True if successful, otherwise, an error will
                be thrown.
        """
        print('downloading images from s3 . . .')
        bucket = self.get_bucket()
        pre_existing_fns = os.listdir(save_dir)
        count = 0
        for filename in load_fns:
            count += 1
            print(count)
            if filename in pre_existing_fns:
                continue
            bucket.download_file(filename, save_dir + '/' + filename)
        return True

    def get_all_filenames(self):
        """ Gets all filenames in storage.

            Returns:
                list(str): A list of all of the filenames
                    in the bucket, as a list of strings.
        """
        iterobjs = self.get_bucket().objects.all()
        filenames = [obj.key for obj in iterobjs]
        return filenames

    def remove_items(self, filenames):
        """ Removes, from storage, all files from <filenames>.

            Args:
                filenames list(str): List of filenames, where
                each filename is a string, of the filename contained
                in the bucket.

            Returns:
                bool: True if successful, otherwise an error is thrown.
        """
        bucket = self.get_bucket()
        fn_objects = [{'Key': fn} for fn in filenames]
        bucket.delete_objects(
            Delete={
                'Objects': fn_objects
            }
        )
        return True
