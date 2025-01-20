`cat /opt/tankDataViewer/scripts/deployment.env`

# Copy all sources
echo "Copying resources"
cp -r . $DEPLOYMENT_DIR
cd $DEPLOYMENT_DIR/scripts
echo "npm install"
npm install

echo "Making backup and log directories"
mkdir -p $BACKUP_DIR
chown -R ryan $BACKUP_DIR

mkdir -p $LOG_DIR
chown -R ryan $LOG_DIR

# Update crontab
## Remove existing to avoid duplication
echo "Updating cron"
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

echo "Deployment finished: `date`" >> ${LOG_DIR}/deployment-log.txt 2>&1
