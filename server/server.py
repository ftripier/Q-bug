import sys

import asyncio
import datetime
import random
import websockets

SERVER_PORT = None
if len(sys.argv) >= 2:
    try:
        SERVER_PORT = int(sys.argv[1])
    except ValueError:
        raise Exception(f"Invalid port number passed in {sys.argv[1]}")
else:
    raise Exception("Must pass in a port number for the websocket server")

async def time(websocket, path):
    print(f"Serving messages on port {SERVER_PORT}")
    while True:
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        await websocket.send(now)
        await asyncio.sleep(random.random() * 3)

start_server = websockets.serve(time, '0.0.0.0', SERVER_PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()