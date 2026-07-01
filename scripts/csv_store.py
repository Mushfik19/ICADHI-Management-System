from __future__ import annotations

import csv
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "public" / "data"


def read_csv(filename: str) -> list[dict[str, str]]:
    path = DATA_DIR / filename
    with path.open("r", encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def append_organizer(record: dict[str, str]) -> None:
    path = DATA_DIR / "organizers.csv"
    fieldnames = ["id", "name", "institution", "phone", "email", "password", "status"]
    existing = read_csv("organizers.csv")
    next_id = str(len(existing) + 1)
    payload = {"id": next_id, "status": "pending", **record}

    with path.open("a", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writerow(payload)


if __name__ == "__main__":
    print("registration_stats.csv:", read_csv("registration_stats.csv"))
    print("schedule.csv:", read_csv("schedule.csv"))
    print("organizers.csv:", read_csv("organizers.csv"))
