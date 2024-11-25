WD=/home/ryan/tank_data_poller
ENV_FILE=${WD}/prod.env
MAIN_JS_FILE=${WD}/scripts/fetchAndStoreApexData.js

. ${ENV_FILE}
node ${MAIN_JS_FILE}
