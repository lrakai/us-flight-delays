#!/usr/bin/env bash

on_time_data=../../data/OnewayT_ONTIME2017.csv
airports_geojson=../../data/airports.json

node airports.js $on_time_data > $airports_geojson