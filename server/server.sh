#!/usr/bin/env bash
python server/server.py $DEBUG_SERVER_PORT & python -m http.server $UI_SERVER_PORT --directory build