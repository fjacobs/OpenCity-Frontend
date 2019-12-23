#!/bin/bash

yarn compile &
yarn bundle &

cd /static
:
python3 -m http.server 9000
