`cat scripts/deployment.env`

# Copy all sources
cp -r . $DEPLOYMENT_DIR
cd $DEPLOYMENT_DIR/scripts
npm install

mkdir -p $BACKUP_DIR
chown -R ryan $BACKUP_DIR

mkdir -p $LOG_DIR
chown -R ryan $LOG_DIR

# Update crontab
## Remove existing to avoid duplication
crontab -l | grep -v $MAIN_SCRIPT_PATH | crontab -
crontab -l | grep -v $BACKUP_SCRIPT_PATH | crontab -

echo $DEPLOYMENT_DIR
echo $MAIN_SCRIPT_PATH
echo $BACKUP_SCRIPT_PATH

## Add
crontab -l > tankDataViewerCron
cat <<EOL >> tankDataViewerCron
* * * * * /bin/sh ${MAIN_SCRIPT_PATH} >> ${LOG_DIR}/poller.txt 2>&1
0 0 * * * /bin/sh ${BACKUP_SCRIPT_PATH} >> ${LOG_DIR}/backup-log.txt 2>&1
EOL
crontab -u ryan tankDataViewerCron
rm tankDataViewerCron


