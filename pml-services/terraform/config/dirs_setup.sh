#!/bin/bash

# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

sudo ln -s /path/to/pml /path/to/flask_application
sudo chmod 777 /path/to/flask_application

sudo groupadd www-data
sudo usermod -a -G www-data ec2-user
sudo usermod -a -G www-data apache

sudo chown -R ec2-user:www-data /path/to/pml
sudo chmod g+rwx /path/to/pml
sudo chmod o+rx /path/to/home
sudo chmod o+rx /home

sudo chown -R root:www-data /path/to/www
sudo chmod g+rwx,o+rx /path/to/www
sudo chmod o+rx /path/to/var


echo "dirs_setup.sh is done." >> /path/to/tf_log
