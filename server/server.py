import sys
import asyncio
import datetime
import websockets
import logging

def init_logger():
    logger = logging.getLogger()

    h = logging.StreamHandler(sys.stdout)
    h.flush = sys.stdout.flush
    logger.addHandler(h)

    return logger

logger = init_logger()

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
            logger.info(f"Received message \n{message}")
            await notify_all_clients(STATE['value'])
    finally:
        unregister(websocket)

logger.info(f"Serving messages on port {SERVER_PORT}")
start_server = websockets.serve(sync, '0.0.0.0', SERVER_PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()