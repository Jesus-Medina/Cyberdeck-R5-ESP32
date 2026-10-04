#!/usr/bin/env python3
"""Bridge de telemetría PC -> ESP32 para el Cyberdeck R5.

Uso:
    python cyberdeck_bridge.py --port /dev/ttyUSB0
    python cyberdeck_bridge.py --port COM5
"""

import argparse
import time
import socket

import psutil
import serial


def battery_percent():
    batt = psutil.sensors_battery()
    return -1 if batt is None else int(batt.percent)


def local_ip():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except OSError:
        return "0.0.0.0"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", required=True)
    parser.add_argument("--baud", type=int, default=115200)
    parser.add_argument("--interval", type=float, default=2.0)
    args = parser.parse_args()

    with serial.Serial(args.port, args.baud, timeout=0.2) as ser:
        time.sleep(2)
        ser.write(b"PING\n")

        while True:
            cpu = int(psutil.cpu_percent(interval=None))
            ram = int(psutil.virtual_memory().percent)
            bat = battery_percent()
            ip = local_ip()

            ser.write(f"SYS CPU={cpu} RAM={ram} BAT={bat}\n".encode())
            ser.write(f"NET IP={ip}\n".encode())

            while ser.in_waiting:
                line = ser.readline().decode(errors="replace").strip()
                if line:
                    print("ESP32:", line)

            time.sleep(args.interval)


if __name__ == "__main__":
    main()
