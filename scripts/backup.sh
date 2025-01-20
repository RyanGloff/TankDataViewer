`cat /opt/tankDataViewer/scripts/deployment.env`

BACKUP_PATH=${BACKUP_DIR}/backup-${DATE}.sql
DATE=`date '+%Y-%m-%d'`
export PGPASSWORD=docker

echo "Starting dump for ${DATE}"
pg_dump -U postgres -h localhost -d tank_data > $BACKUP_PATH
echo "Ended dump for ${DATE}"
