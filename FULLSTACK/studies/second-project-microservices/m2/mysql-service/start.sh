#!/bin/bash

# Excellent idea to first start without connection to configure the database
mysqld_safe --skip-networking &

until mysqladmin ping --silent;
do
	echo "waiting mysql-server starts"
	sleep 1
done

echo "CREATE DATABASE IF NOT EXISTS products;" > /tmp/init.sql
echo "CREATE USER IF NOT EXISTS 'micro_user'@'localhost' IDENTIFIED BY 'micro_pass';" >> /tmp/init.sql
echo "GRANT ALL PRIVILEGES ON 'products' TO 'micro_user'@'localhost';" >> /tmp/init.sql
echo "FLUSH PRIVILEGES;" >> /tmp/init.sql

mysql -u root < /tmp/init.sql

rm -f /tmp/init.sql

mysqladmin shutdown

# Wait the process shutdown completely
wait "$pid"

exec mysqld_safe
