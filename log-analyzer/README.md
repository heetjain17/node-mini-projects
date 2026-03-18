# File Structure

1. log-analyzer.js (Entry point / CLI controller)

- read CLI arguments
- validate the inputs
- create the file stream
- read the file line by line
- pass each line to the parser
- pass the data into analyzer
- get results from analyzer
- pass the results along with options to the generate report

2. parser.js (Log parser)

- extract useful data form each line and return in a structured json format

3. analyzer.js (Statistics Engine)

- update all the statistics
- return analyzed data

4. formatter.js (Report Generator)

- generate report based options pased

# Improvements

## Features

- take multiple input files
  ~~- output format
  -- json, -- csv, --table~~
  ~~- time based analysis~~
- error detailed analysis
- suspicious traffic detection
- latency support optional if includes
- realtime streaming of logs
- interactive tui
  blessed, ink

## Performance

1. Avoid regex
2. Use maps instead of objects
3. avoid unnecesary object creation directly pass data onto next function
4. Avoid sorting entire dataseat instead use min-heap or streaming approach
5. Parallel processing
6. Incraese Stream buffer size
7. Avoid string conversions
8. Profile the code
9. Lazy report stream the ouput
10. Memory Footprint Optimization only track top IPs
