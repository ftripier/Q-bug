import sys

import asyncio
import datetime
import websockets

SERVER_PORT = None

if len(sys.argv) >= 2:
    try:
        SERVER_PORT = int(sys.argv[1])
    except ValueError:
        raise Exception(f"Invalid port number passed in {sys.argv[1]}")
else:
    raise Exception("Must pass in a port number for the websocket server")

CLIENTS = set()

# the database he he
STATE = {'value': ''}

def register(websocket):
    CLIENTS.add(websocket)

def unregister(websocket):
    CLIENTS.remove(websocket)

async def notify_all_clients(message):
    if CLIENTS:
        await asyncio.wait([client.send(message) for client in CLIENTS])

async def sync(websocket, path):
    register(websocket)
    try:
        await websocket.send(STATE['value'])
        async for message in websocket:
            STATE['value'] = message
            print(f"Received message \n{message}", flush=True)
            await notify_all_clients(STATE['value'])
    finally:
        unregister(websocket)

print(f"Serving messages on port {SERVER_PORT}", flush=True)
start_server = websockets.serve(sync, '0.0.0.0', SERVER_PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()