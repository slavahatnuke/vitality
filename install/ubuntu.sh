#!/bin/sh

#install nodejs
(sudo dpkg --list | grep nodejs >> /dev/null && echo "[ok] nodejs" ) || (sudo apt-get update -y && sudo apt-get -y install python-software-properties python g++ make && sudo add-apt-repository -y ppa:chris-lea/node.js && sudo apt-get update -y && sudo apt-get -y install nodejs)

#install vitality
which vitality >> /dev/null && echo "[ok] vitality"                  || ( sudo npm install -g vitality )