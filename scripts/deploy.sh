# Copy all sources to /etc/tankDataViewer
cp -r . /opt/tankDataViewer

# Update crontab
MAIN_SCRIPT_PATH=/etc/tankDataViewer/scripts/main.sh
BACKUP_SCRIPT_PATH=/etc/tankDataViewer/scripts/backup.sh
## Remove existing to avoid duplication
crontab -l | grep -v '${MAIN_SCRIPT_PATH}' | crontab -
crontab -l | grep -v '${BACKUP_SCRIPT_PATH}' | crontab -

## Add
crontab -l > tankDataViewerCron
cat <<EOL >> tankDataViewerCron
* * * * * ${MAIN_SCRIPT_PATH} >> /home/ryan/tank_data_poller/logs/poller.txt 2>&1
0 0 * * * ${BACKUP_SCRIPT_PATH} >> /home/ryan/tank_data_poller/logs/backup-log.txt 2>&1
EOL
crontab -u ryan tankDataViewerCron
rm tankDataViewerCron


