---
title: "Setting Up Prometheus and Grafana for Infrastructure Monitoring"
pubDate: 2026-06-18
description: "Complete guide to deploying Prometheus and Grafana for monitoring your servers and applications"
category: "Monitoring"
tags: ["prometheus", "grafana", "monitoring", "linux", "observability"]
author: "Ahmed"
---

Prometheus and Grafana are the gold standard for open-source monitoring. This guide walks you through setting up a complete monitoring stack.

## Architecture Overview

```
┌─────────────┐
│  Grafana    │ (Visualization)
└──────┬──────┘
       │
┌──────┴──────┐
│ Prometheus  │ (Metrics Collection & Storage)
└──────┬──────┘
       │
┌──────┴──────────────────┐
│ Node Exporter           │ (Linux Metrics)
│ Windows Exporter        │ (Windows Metrics)
│ Application Exporters   │ (Custom Metrics)
└─────────────────────────┘
```

## Prerequisites

- Ubuntu 22.04 LTS (or any Linux distro)
- Docker and Docker Compose installed
- Basic understanding of YAML configuration

## Installation with Docker Compose

### 1. Create Project Directory

```bash
mkdir -p ~/monitoring-stack/{prometheus,grafana}
cd ~/monitoring-stack
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
    ports:
      - "9090:9090"
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    ports:
      - "3000:3000"
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
```

### 3. Configure Prometheus

Create `prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'linux-servers'
    static_configs:
      - targets: 
        - '192.168.1.10:9100'
        - '192.168.1.11:9100'

  - job_name: 'windows-servers'
    static_configs:
      - targets:
        - '192.168.1.20:9182'
```

### 4. Start the Stack

```bash
docker-compose up -d
```

## Installing Exporters

### Node Exporter (Linux)

```bash
# Install on monitored servers
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
tar xvf node_exporter-1.7.0.linux-amd64.tar.gz
sudo cp node_exporter-1.7.0.linux-amd64/node_exporter /usr/local/bin/

# Create systemd service
sudo tee /etc/systemd/system/node_exporter.service > /dev/null <<EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
Type=simple
User=nobody
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now node_exporter
```

### Windows Exporter

```powershell
# Download and install
Invoke-WebRequest -Uri "https://github.com/prometheus-community/windows_exporter/releases/download/v0.25.0/windows_exporter-0.25.0-amd64.msi" -OutFile "windows_exporter.msi"
Start-Process msiexec.exe -ArgumentList '/i windows_exporter.msi /quiet' -Wait

# Service starts automatically on port 9182
```

## Configuring Grafana

### 1. Access Grafana

Open `http://your-server:3000` and log in:
- Username: `admin`
- Password: `admin123` (change this immediately!)

### 2. Add Prometheus Data Source

1. Go to **Configuration > Data Sources**
2. Click **Add data source**
3. Select **Prometheus**
4. URL: `http://prometheus:9090`
5. Click **Save & Test**

### 3. Import Dashboards

**Node Exporter Full Dashboard (ID: 1860)**:

1. Go to **Dashboards > Import**
2. Enter ID: `1860`
3. Select Prometheus as data source
4. Click **Import**

**Windows Exporter Dashboard (ID: 14694)**:

1. Import ID: `14694`
2. Select Prometheus data source

## Creating Alerts

### 1. Define Alert Rules

Create `prometheus/alerts.yml`:

```yaml
groups:
  - name: infrastructure
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is above 80% for 5 minutes"

      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 10
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space on {{ $labels.instance }}"
```

### 2. Update Prometheus Config

Add to `prometheus.yml`:

```yaml
rule_files:
  - "alerts.yml"
```

### 3. Restart Prometheus

```bash
docker-compose restart prometheus
```

## Useful PromQL Queries

```promql
# CPU usage percentage
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage percentage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk usage percentage
100 - ((node_filesystem_avail_bytes{mountpoint="/"} * 100) / node_filesystem_size_bytes{mountpoint="/"})

# Network traffic (bytes per second)
rate(node_network_receive_bytes_total[5m])

# System uptime
node_time_seconds - node_boot_time_seconds
```

## Next Steps

- Set up Alertmanager for notifications (email, Slack, PagerDuty)
- Add Blackbox Exporter for HTTP/TCP probes
- Configure Thanos for long-term storage
- Implement service discovery for dynamic environments

Happy monitoring!
