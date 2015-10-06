# This script should be run with /bin/bash
# for starting quickanswer with forever

node_modules/forever/bin/forever start bin/www
node_modules/forever/bin/forever --fifo logs 0
