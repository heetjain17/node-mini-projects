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

- raw files -> human readable format
