import websockets

async def debug(port_number, pyquil_program):
    async with websockets.connect(f"ws://localhost:{port_number}") as websocket:
        await websocket.send(pyquil_program)
