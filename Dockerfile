FROM python:3.7.2-stretch

ARG websocket_server_port=8765
ARG ui_server_port=8001
ENV DEBUG_SERVER_PORT=$websocket_server_port
ENV UI_SERVER_PORT=$ui_server_port

EXPOSE ${websocket_server_port}/tcp
EXPOSE ${websocket_server_port}/udp

EXPOSE ${ui_server_port}/tcp

WORKDIR /src
COPY . .

RUN pip install --user pipenv
RUN easy_install pipenv
RUN pipenv install

# node
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

RUN npm install
RUN REACT_APP_DEBUG_SERVER_PORT=$DEBUG_SERVER_PORT npm run build

ENTRYPOINT [ "pipenv", "run", "start" ]
