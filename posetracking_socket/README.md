# AsyncHandDetector

## Overzicht
`AsyncHandDetector` is een proof of concept die demonstreert hoe asynchrone programmering kan worden gebruikt om handdetectie in real-time video streams efficiënt te verwerken. Dit project maakt gebruik van de `cvzone` en mediapipe HandTrackingModule en OpenCV om videobeelden te verwerken en handbewegingen te detecteren.

## Kenmerken
- **Asynchrone Video Verwerking:** Maakt gebruik van asyncio om de videoverwerking non-blocking en efficiënt te maken.
- **Ruisreductie:** Implementeert een bilateraal filter om de beeldruis te verminderen voor nauwkeurigere handdetectie.
- **Real-time Hand Tracking:** Detecteert en tekent handposities in real-time vanaf een webcam.

## Vereisten
- Python 3.7+ en lager dan 3.10
- OpenCV
- cvzone
- asyncio
- mediapipe

Om alle benodigde bibliotheken te installeren, run je:
```bash
pip install opencv-python-headless cvzone mediapipe websockets numpy
```

## Gebruik
Om de AsyncHandDetector te starten, kloon eerst de repository en navigeer naar de map van het project. Voer vervolgens het volgende commando uit in je terminal:

```bash
python async_hand_detector.py
```
Druk op q om de detector te stoppen.

## Projectstructuur

```bash
hand_pose_detector/
│
├── app/
│   ├── __init__.py
│   ├── detector.py          # HandPoseDetector class
│   ├── server.py            # WebSocketServer class
│   ├── config.py            # Configuration settings
│   └── utils.py             # Utility functions
│
├── logs/                    # Log files
│   └── .gitkeep
│
├── tests/
│   ├── __init__.py
│   ├── test_detector.py     # Unit tests for HandPoseDetector
│   └── test_server.py       # Unit tests for WebSocketServer
│
├── Dockerfile
├── requirements.txt
├── deployment.yaml          # Kubernetes deployment file
└── README.md
```

## Kubernetes Deployment
Om je applicatie in een Kubernetes cluster te draaien, gebruik je het volgende deployment.yaml bestand:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hand-pose-detector
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hand-pose-detector
  template:
    metadata:
      labels:
        app: hand-pose-detector
    spec:
      containers:
      - name: hand-pose-detector
        image: your-docker-image  # Vervang 'your-docker-image' met de naam van je Docker image
        ports:
        - containerPort: 8765
        volumeMounts:
        - name: log-volume
          mountPath: /app/logs
      volumes:
      - name: log-volume
        hostPath:
          path: /path/on/host/logs  # Vervang dit pad met het gewenste pad op je host
          type: DirectoryOrCreate
```

## Aanpassen en Toepassen van de Deployment

1. Vervang your-docker-image met de naam van je Docker image (bijv. hand-pose-detector:latest).
2. Vervang /path/on/host/logs met het pad op je host waar je de logbestanden wilt opslaan (bijv. /var/log/hand-pose-detector).

Pas de deployment toe met:

```bash
kubectl apply -f deployment.yaml
```

## Belangrijke Opmerkingen

* Hardware Vereisten: Voor optimale prestaties wordt een moderne CPU of GPU aanbevolen vanwege de intensieve aard van videoverwerking en handtracking.

* Gebruiksscenario's: Dit project is bedoeld als proof of concept en kan worden gebruikt als basis voor meer geavanceerde toepassingen zoals interactieve installaties, augmented reality toepassingen en educatieve doeleinden.

## Bijdragen
Dit project is open voor bijdragen. Als je een feature wilt toevoegen of een bug wilt corrigeren, stuur dan een pull request of open een issue.


## Licentie
Dit project is vrijgegeven onder de MIT licentie. Zie het LICENSE bestand voor meer informatie.

