import asyncio
from send_random_logs import send_waf_logs

async def main():
    while True:
        await send_waf_logs()
        await asyncio.sleep(1)  # 1 log/sec

if __name__ == "__main__":
    asyncio.run(main())