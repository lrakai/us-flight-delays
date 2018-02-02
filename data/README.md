# data

Data is from the US Department of Transportation Bureau of Transportation Statistics. The raw data in `OnewayT_ONTIME2017.csv` is the percent of flights that arrive on time for each tracked airport in 2017 up and including Nov. 2017.

The data has been converted to a GeoJSON file with aggregated statistics per state. The average percentage of flights that arrive for all of a state's aiports is used as the state on-time percentage. This unweighted averaging approach can skew results towards airports that operate less flights.