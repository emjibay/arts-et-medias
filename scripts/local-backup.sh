#!/usr/bin/env bash

# Originally created by Antoine Beauvais-Lacasse

usage() {
    echo "Usage: $0 -d <Backup File> [-f]" 1>&2;
    exit 1;
}

extraOpts=""
FORCE=0;

while getopts "fd:" o; do
    case "${o}" in
        d)
            BACKUP_FILE=${OPTARG};
        ;;
        f)
            FORCE=1;
        ;;
        *)
            usage;
        ;;
    esac
done
shift $((OPTIND - 1))

if [ -z ${BACKUP_FILE+x} ]; then
    usage;
fi

if [ -f ${BACKUP_FILE} ] && [ ${FORCE} -eq 0 ]; then
    echo "Not overwriting existing file '${BACKUP_FILE}' (pass -f to force)";
    exit 1;
fi

DB_HOST="127.0.0.1"
DB_NAME="arts-et-medias"

mongodump -h ${DB_HOST}:27017 -d ${DB_NAME} --gzip --archive=${BACKUP_FILE}
