# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

from __future__ import print_function

from pml_net import PMLNet
#import keras
#import numpy as np


class PMLPredictor(PMLNet):
    """ PMLPredictor is a subclass of PMLNet. This class is used
        for predicting the label of an image after a model is saved
        from training.
    """

    def __init__(self, data_dir, model):
        """
        """
        PMLNet.__init__(self, data_dir)
        self.model = model

    def predict(self, img_array):
        """ Predicts the string label from an image as a numpy array,
            given the <self.model> model.
        """
        # reshape the image from (height, width) to:
        # (1,height, width, 1)
        img_array = img_array.reshape(
            1, img_array.shape[0], img_array.shape[1], 1)

        pred_arr = self.model.predict(img_array, batch_size=1)
        pred_int = pred_arr.argmax()

        pred_str = self.int_label_to_str_label(pred_int)

        return pred_str
