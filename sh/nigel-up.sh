#!/bin/bash

rsync -avz -e "ssh -i /Users/ublek/.ssh/nigelyons_rsa"  --delete public/ nigelyons@ssh.nigelyons.com:/home/nigelyons/nigelyons.com/
