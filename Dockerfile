FROM node

ENV HOST="ovz1.j20568624.me78p.vps.myjino.ru"

ENV HOST_PORT="80"

ADD . /home/app

expose 4000/tcp
expose 4000/udp

expose 8300/tcp
expose 8300/udp

user root

workdir /home/app

run npm i

run npm run pack

workdir /home/app/server

run npm i

entrypoint npm run start

