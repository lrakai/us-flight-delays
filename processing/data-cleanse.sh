#!/usr/bin/env bash

data_dir=../data
raw_data=$data_dir/OnewayT_ONTIME2017.csv
temp_data=$data_dir/temp-`date +%d-%m-%y-%H-%M-%S`.csv
cleansed_data=$data_dir/data_by_state.csv
average_data=$data_dir/state_avg_on_time.csv

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
     data[$1]=data[$1]"{\"iata\":"$2", \"name\":"$3" "$4", \"on_time\": "$5"},"
   }
   END {
     for (state in sum) printf("{\"state\":\"%s\",\"on_time\":%s,\"airports\":[%s]},\n", state, sum[state]/count[state], substr(data[state],0,length(data[state])-1))
   }' \
   | sort +0n -t ',' -k 2 | sed '$ s/.$//' > $average_data