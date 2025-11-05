FROM debian:trixie
WORKDIR /app
COPY ./start.sh ./
RUN apt-get update -y && apt-get upgrade -y && apt-get install mysql-server -y
# That command will be the first command to be executed in our container
ENTRYPOINT ["/start.sh" ]
