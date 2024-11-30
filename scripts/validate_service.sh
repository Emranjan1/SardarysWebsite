#!/bin/bash
# Check if the Node.js server is running
curl -f http://localhost:3000/
if [ $? -eq 0 ]; then
    echo "Server is running."
else
    echo "Server is not running."
    exit 1
fi
