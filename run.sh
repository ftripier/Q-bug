#!/usr/bin/env bash
docker run -it --entrypoint /bin/bash -p 8765:8765/tcp -p 8765:8765/udp -p 8001:8001/tcp qbugserver