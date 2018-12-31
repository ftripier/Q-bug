FROM python:3.7.2-stretch

ARG server_port=8765
ENV DEBUG_SERVER_PORT=$server_port

EXPOSE ${server_port}/tcp
EXPOSE ${server_port}/udp

WORKDIR /src
COPY . .

RUN pip install --user pipenv
RUN easy_install pipenv
RUN pipenv install

ENTRYPOINT [ "pipenv", "run", "start" ]
