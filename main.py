import sys
import json

def main(ip_address):
    # Beispielhafte Verarbeitung der IP-Adresse
    data = {
        'ip': ip_address,
        'status': 'success',
        'details': ['detail1', 'detail2', 'detail3']
    }

    # JSON-Antwort zurückgeben
    print(json.dumps(data))

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: main.py <ip_address>")
        sys.exit(1)

    ip_address = sys.argv[1]
    main(ip_address)
