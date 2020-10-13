#!/bin/sh

git lfs install

for i in png bmp gif jpg jpeg tiff tga ico ttf otf woff woff2 wav ogg mpeg mpg mp3 mp4 avi mov a lib so zip; do
  git lfs track "*.$i"
done
