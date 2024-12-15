`cat /opt/tankDataViewer/scripts/deployment.env`

NODE_MAIN_PATH=$DEPLOYMENT_DIR/scripts/fetchAndStoreApexData.js

. $DEPLOYMENT_DIR/prod.env
node $NODE_MAIN_PATH
