
FROM python:3.9-slim

# Install system dependencies, including libgl1-mesa-glx and libglib2.0-0
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0


WORKDIR /app


COPY requirements.txt .


RUN pip install --no-cache-dir -r requirements.txt


COPY . .

EXPOSE 8766


CMD ["python", "app/server.py"]
