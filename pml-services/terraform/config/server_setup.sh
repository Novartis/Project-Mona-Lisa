#!/bin/bash

#
# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
#

sudo yum install httpd -y
sudo yum install mod_wsgi -y
sudo yum install mod_ssl -y


sudo cp /home.ec2/ec2-user/pml/"${vhost_filename}" /path/to/config/direc/

sudo cp /path/to/pml/boto.cfg path/to/etc/

sudo chmod 777 /path/to/boto.cfg


echo "server_setup.sh is done." >> /path/to/tf_log
