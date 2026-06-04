import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME")

try:
    connection = pymysql.connect(
        host="aqa.home.pl",
        port=3306,
        user="00480360_katamarany_rezerwacja",
        password="ytu%%fy!@i8rTTg8$$"
    )

    print("Connected")

except Exception as e:
    print(f"Błąd: {e}")

print("DB_USER:", DB_USER)
print("DB_HOST:", DB_HOST)
print("DB_PORT:", DB_PORT)
print("DB_NAME:", DB_NAME)
print("DB_PASSWORD:", DB_PASSWORD)