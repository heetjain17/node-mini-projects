# File Structure

1. log-analyzer.js (Entry point / CLI controller)

- Read CLI arguments
- Validate the file
- Create the file stream
- Read the file line by line
- Pass each line to the parser
- Send parsed data to the analyzer

2. parser.js (Log parser)

- extract useful data form each line and return in a structured json format

3. analyzer.js (Statistics Engine)

- update all the statistics

4. formatter.js (Report Generator)

- object -> human readable format

# Improvements

## Features

1. take multiple input files
2. output format
   -- json, -- csv, --table
3. time based analysis
4. error detailed analysis
5. suspicious traffic detection
6. latency support optional if includes
7. realtime streaming of logs
8. interactive tui
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
