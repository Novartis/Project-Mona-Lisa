# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

from __future__ import print_function

from pml_net import PMLNet
import keras
#import numpy as np


class PMLTrainer(PMLNet):
    """ PMLTrainer is a subclass of PMLNet. This class is used
        for training the collected images after all of the data is
        downloaded.
    """

    def __init__(self, data_dir, model, batch_size=128, epochs=12):
        """
        """
        PMLNet.__init__(self, data_dir)
        self.model = model
        self.batch_size = batch_size
        self.epochs = epochs

    def train_model(self):
        """ Trains on the data in <self.data_dir> from the
            <self.model> model.
        """

        (x_train, y_train), (x_test, y_test) = self.load_data()

        (x_train, y_train), (x_test, y_test) =\
            self.preprocess_load_data(
                x_train, y_train, x_test, y_test)

        self.model.compile(loss=keras.losses.categorical_crossentropy,
                           optimizer=keras.optimizers.Adadelta(),
                           metrics=['accuracy'])

        self.model.fit(x_train, y_train,
                       batch_size=self.batch_size,
                       epochs=self.epochs,
                       verbose=1,
                       validation_data=(x_test, y_test))

        score = self.model.evaluate(x_test, y_test, verbose=0)
        print('Test loss: ', score[0])
        print('Test accuracy: ', score[1])

        return self.model


if __name__ == '__main__':
    data_dir = 'TODO'

    net = PMLNet(data_dir)

    # load a saved model:
    # model = net.load_model()
    # or
    # start with a new model:
    model = net.create_model()

    # train and save the model:
    trainer = PMLTrainer(data_dir, model)
    train_model = trainer.train_model()
    trainer.save_model(train_model)
