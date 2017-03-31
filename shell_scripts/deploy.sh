#!/bin/bash

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cp $script_dir/../index.html /var/www/html
cp $script_dir/../help.html /var/www/html
cp -r $script_dir/../js /var/www/html
cp -r $script_dir/../css /var/www/html
cp -r $script_dir/../marker_icons /var/www/html
cp -r $script_dir/../pytools/garnish /home/burgerboy
chown -R burgerboy:burgerboy /home/burgerboy/garnish
