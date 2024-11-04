DATE=`date '+%Y-%m-%d'`
BACKUP_PATH="/home/ryan/tank_data_poller/backups/backup-${DATE}.sql"
export PGPASSWORD=docker

echo "Starting dump for ${DATE}"
pg_dump -U postgres -h localhost -d tank_data > $BACKUP_PATH
echo "Ended dump for ${DATE}"
