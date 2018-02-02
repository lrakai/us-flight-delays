#!/usr/bin/env bash

raw_data=OnewayT_ONTIME2017.csv
temp_data=temp-`date +%d-%m-%y-%H-%M-%S`.csv
cleansed_data=data_by_state.csv
average_data=state_avg_on_time.csv

header=`head -2 $raw_data`

echo -en "\nSTATE\n" > $temp_data
tail --lines=+3 $raw_data | head --lines=-1 | awk -F \: '{print substr($1,length($1)-1,2)}' >> $temp_data
paste -d ',' $temp_data $raw_data > $cleansed_data

head -2 $cleansed_data | tail -1 > $temp_data
tail --lines=+3 $cleansed_data | head --lines=-1 | sort -t ',' -k 1 >> $temp_data
mv $temp_data $cleansed_data

tail --lines=+3 $cleansed_data | head --lines=-1 | awk -F ',' '{
    sum[$1]+=$5
    count[$1]+=1
   }
   END {
     for (key in sum) printf("%s,%s\n", key, sum[key]/count[key])
   }' \
   | sort +0n -t ',' -k 2 > $average_data