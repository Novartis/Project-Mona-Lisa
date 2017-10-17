# Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.


####################################
### Terraform script to generate ###
### the AWS EC2 for PRJ-ML       ###
####################################
# Check tf_log in ec2.
# When "terraforming complete." is at
# the bottom of the tf_log file, then
# the job is complete.

provider "aws" {
  region = "us-east-1"
}

######################
### template files ###
######################

data "template_file" "ssh_private_key" {
  template = "${file("${var.ssh_key_full_path}")}"
}

data "template_file" "init_ec2" {
  template = "${file("${path.module}/config/init-ec2.sh")}"
}

data "template_file" "git_setup" {
  template = "${file("${path.module}/config/git_setup.sh")}"

 vars {
   bitbucket_username = "${var.bitbucket_username}"
   bitbucket_password = "${var.bitbucket_password}"
   git_branch = "${var.git_branch}"
   http_proxy = "${var.http_proxy}"
   HTTP_PROXY = "${var.HTTP_PROXY}"
   https_proxy = "${var.https_proxy}"
   HTTPS_PROXY = "${var.HTTPS_PROXY}"
 }
}

data "template_file" "server_setup" {
 template = "${file("${path.module}/config/server_setup.sh")}"

 vars {
  vhost_filename = "${var.vhost_filename}"
 }
}

data "template_file" "dirs_setup" {
 template = "${file("${path.module}/config/dirs_setup.sh")}"
}

###########################
### configuring the ec2 ###
###########################

resource "aws_instance" "latest_centos" {
  ami = "${var.ami}"
  instance_type = "${var.instance_type}"
  key_name = "${var.key_name}"
  vpc_security_group_ids = "${var.vpc_security_group_ids}"
  subnet_id = "${var.subnet_id}"
  iam_instance_profile = "${var.iam_instance_profile}"

  tags = {
    Name = "${var.ec2_tag_name}"
  }

  user_data = "${data.template_file.init_ec2.rendered}"

  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = "${data.template_file.ssh_private_key.rendered}"
  }

  # setup the git repo and virtualenv
  provisioner "remote-exec" {
    inline = "${data.template_file.git_setup.rendered}"
  }

  # setup the server:
  # including apache and wsgi
  provisioner "remote-exec" {
    inline = "${data.template_file.server_setup.rendered}"
  }

  # setup the directories and permissions
  provisioner "remote-exec" {
    inline = "${data.template_file.dirs_setup.rendered}"
  }

  # restart apache
  provisioner "remote-exec" {
    inline = [
      "sudo service httpd restart",
      "echo 'restarting server is done.' >> /path/to/tf_log",
      "echo 'terraforming complete.' >> /path/to/tf_log"
    ]
  }

}


output "private_ip" {
  value = "${aws_instance.latest_centos.private_ip}"
}


###########################
### terraform variables ###
###########################
#
# Once the terraform developers fix their
# problems with variable files,
# these variables should go in:
# terraform.tfvars in this same directory

# you will likely have to change defaults for
# the variable below before the resource variables

# bitbucket variables
variable "bitbucket_username" {}
variable "bitbucket_password" {}
variable "ssh_key_full_path" {}
variable "git_branch" {
  default = "develop"
}

# the value currently can be either:
#     vhost.conf or vhost_ssl.conf
# if vhost_ssl.conf is specified,
# the the certificates need to be configured.
variable "vhost_filename" {
  default = "vhost.conf"
}

# proxy variables
variable "http_proxy" {
  default = "TODO"
}
variable "HTTP_PROXY" {
  default = "TODO"
}
variable "https_proxy" {
  default = "TODO"
}
variable "HTTPS_PROXY" {
  default = "TODO"
}

# variables for the "latest centos" aws resource
variable "ami" { default = "TODO" }
variable "instance_type" { default = "t2.micro" }
variable "key_name" { default = "TODO" }
variable "vpc_security_group_ids" {
  default = [ "TODO", "TODO" ]
}
variable "subnet_id" { default = "TODO" }
variable "iam_instance_profile" { default = "TODO" }
variable "ec2_tag_name" { default = "TODO" }


