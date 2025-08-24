#!/usr/bin/env python
import requests
import json

# Login como test.eps según CLAUDE.md
login_data = {
    "user_type": "EPS",
    "username": "test.eps",
    "password": "simple123"
}

response = requests.post("http://localhost:8003/api/auth/login/", json=login_data)
if response.status_code == 200:
    tokens = response.json()
    print(f"Token de acceso: {tokens['access']}")
    print(f"\nGuardado en: auth_token.txt")
    with open("auth_token.txt", "w") as f:
        f.write(tokens['access'])
else:
    print(f"Error: {response.status_code}")
    print(response.text)