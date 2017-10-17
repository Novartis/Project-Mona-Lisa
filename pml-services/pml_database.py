# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

from __future__ import print_function
import boto3
from boto3.dynamodb.conditions import Key
from random import randint, uniform
import os
import base64


class PMLDatabase:
    """ Project Mona Lisa Database class.
    """

    def __init__(self, db_name, modename='all'):
        """
            Args:
                db_name (str): name of the database.
                modename (str): the training mode. The default value
                is 'all'.
        """
        self.db_name = db_name
        self.modename = modename

    def get_table(self):
        """
            Returns:
                (obj): The boto3 AWS DynamoDB object.
        """
        dynamodb = boto3.resource('dynamodb', region_name='TODO')
        return dynamodb.Table(self.db_name)

    def get_prompt_item(self, p_bias=0.1):
        """ Get method for images in ML-PRJ prompt image Database.

            Args:
                p_bias (float): the probability of the method being
                    bias toward the training image with the least
                    amount of collected training data. The default
                    value is 0.1.

            Returns:
                dict: The item as a dictionary.
        """
        if (self.modename == 'all') and (uniform(0, 1) < p_bias):
            bias_label = self.get_bias_label()
            primary_key = 'label'
            primary_value = bias_label
            item = self.get_table()\
                .query(
                    IndexName=primary_key,
                    ProjectionExpression='filename, label',
                    KeyConditionExpression=Key(primary_key)
                .eq(primary_value),
            )['Items'][0]
            return item
        else:
            item = self.get_rand_item()
            return item

    def get_predict_item(self, label):
        """ Get method for a svg with the given label

            Args:
                label (str): name of the label

            Returns:
                (str): the svg as a string
        """
        item = self.get_table().query(
            IndexName='label',
            ProjectionExpression='filename',
            KeyConditionExpression=Key('label').eq(label),
        )['Items'][0]
        return item

    def get_bias_label(self):
        """ Helper function. Gets the item in the database
            with the lowest number of occurences.
        """
        collect_db = PMLDatabase(self.db_name)
        label_count_objs = collect_db.get_attr_count_map('label')
        label_to_counts = {}
        for key in label_count_objs.keys():
            label_to_counts[key] = label_count_objs[key]['count']

        return min(label_to_counts, key=label_to_counts.get)

    def post_item_in_db(self, item):
        """ Posting collected image meta-data in the database.

            Args:
                item (dict): dictionary with string keys and values.
                    One of the keys must match the primary key in the
                    database. The type of the matching value must
                    match what is in the database.

            Returns:
                response: True if successful, otherwise an error is thrown.
        """
        self.get_table().put_item(Item=item)
        return True

    def get_all_items(self):
        """
        """
        items = self.get_table().scan(
            ProjectionExpression='id, label',
        )['Items']

        filenames = []
        labels = []
        for item in items:
            filenames.append('%s.png' % (item['id']))
            labels.append(item['label'])
        return (filenames, labels)

    def get_attr_count_map(self, attr):
        """ Gets a dictionary mapping an attribute to the number of
            times each of it's specific values occurs in the database.
            For example, if the database contained the rows:
            [{'id': 1, 'filename':'file1'},
             {'id': 2, 'filename':'file2'},
             {'id': 3, 'filename':'file1'},]
            and <attr> is 'filename' then this method would return:
            {'file1': 2, 'file2': 1}

            Args:
                attr (str): the attribute.

            Returns:
                (dict): dictionary mapping all values of the given
                attribute to the number of times they occur in the
                database. For example:
                {'attr_val1': 1,'attr_val2': 7,'attr_val3': 13,}
        """
        scan = self.get_table().scan(
            ProjectionExpression=attr,
        )['Items']
        attrs = [scan[i][attr] for i in range(len(scan))]
        dict_map = dict(zip(attrs, map(attrs.count, attrs)))
        count_dict = {}
        for key in dict_map.keys():
            count_dict[key] = {"count": dict_map[key]}

        return count_dict

    def get_rand_item(self):
        """ Gets a random item from the
        """
        if self.modename == 'all':
            items = self.get_table().scan(
                ProjectionExpression='filename, label'
            )['Items']

        else:
            primary_key = 'modename'
            items = self.get_table()\
                .query(
                IndexName=primary_key,
                ProjectionExpression='filename, label',
                KeyConditionExpression=Key(primary_key).eq(self.modename),
            )['Items']

        rand_index = randint(0, len(items) - 1)

        return items[rand_index]

    def remove_items(self, key_name, values):
        """TODO: this method currently does not work, and
            items will have to be manually deleted from the database.
        """
        table = self.get_table()
        count = 0
        for value in values:
            #########################################
            # items are not being deleted:
            table.delete_item(Key={key_name: value})
            #########################################
            print('db item deleted')
            count += 1

        print(str(count) + ' items deleted from the database')
        return True

    def get_new_id(self):
        """ # todo: implement so collisions are avoided
        """
        return str(randint(0, 10**12))
