#!/bin/bash

#
# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
#

sudo yum install git -y

export http_proxy="${http_proxy}"
export HTTP_PROXY="${HTTP_PROXY}"
export https_proxy="${https_proxy}"
export HTTPS_PROXY="${HTTPS_PROXY}"

git clone https://"${bitbucket_username}":"${bitbucket_password}"TODO /path/to/pml

cd /path/to/pml
git fetch
git checkout "${git_branch}"

sudo pip install virtualenv --proxy=TODO
virtualenv /path/to/pml
source /path/to/pml/bin/activate

pip install -r /path/to/pml/requirements.txt

deactivate

echo "git_setup.sh is done." >> /path/to/tf_log
