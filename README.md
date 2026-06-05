# NexaCore — Production Microservices on Kubernetes

> A production-grade microservices application built to demonstrate real-world DevOps engineering across containerization, Kubernetes deployment, secrets management, GitOps and observability.

**Live URL:** http://nexacore.20.87.113.204.nip.io

**Blog Series:** [Shipped to Production on Hashnode](https://jasonawaitoma.hashnode.dev)

**LinkedIn:** [Jason Awaitoma](https://www.linkedin.com/in/jason-awaitoma-a9752013b)

> Want to deploy this yourself? Jump to [Getting Started](#getting-started)

---

## Overview

NexaCore is a full-stack microservices application consisting of 8 services — 7 Node.js/Express backend services and a React frontend — deployed on Azure Kubernetes Service. The project was built across 4 phases, each introducing a new layer of production infrastructure on top of the previous one.

This is not a tutorial project. Every decision made here reflects what you would find in a real production environment: proper secrets management, autoscaling, GitOps deployment pipelines and full observability.

---

## Architecture

```
                         Internet
                            │
                            ▼
                  ┌─────────────────┐
                  │  NGINX Ingress  │
                  │  Controller     │
                  │  20.87.113.204  │
                  └────────┬────────┘
                           │
              ┌────────────▼────────────┐
              │      nexacore namespace  │
              │                         │
    ┌─────────▼──────────────────────┐  │
    │       frontend-service         │  │
    │       (nginx, port 80)         │  │
    │       React SPA                │  │
    └─────────┬──────────────────────┘  │
              │ /api/* proxy            │
    ┌─────────▼──────────────────────┐  │
    │         Backend Services        │  │
    │                                 │  │
    │  auth-service      :3001        │  │
    │  user-service      :3002        │  │
    │  billing-service   :3003        │  │
    │  payments-service  :3004        │  │
    │  notifications     :3005        │  │
    │  analytics-service :3006        │  │
    │  admin-service     :3007        │  │
    └─────────┬──────────────────────┘  │
              │                         │
    ┌─────────▼──────────────────────┐  │
    │    Azure PostgreSQL             │  │
    │    nexacore-db                  │  │
    │    7 separate databases         │  │
    └─────────────────────────────────┘  │
                                         │
    ┌────────────────────────────────┐   │
    │    Azure Key Vault             │   │
    │    nexacore-kv                 │   │
    │    CSI Driver + Workload       │   │
    │    Identity                    │   │
    └────────────────────────────────┘   │
                                         │
    ┌────────────────────────────────┐   │
    │    monitoring namespace        │   │
    │                                │   │
    │    Prometheus + Grafana        │   │
    │    Alertmanager                │   │
    │    Node Exporter               │   │
    └────────────────────────────────┘   │
              │                          │
    ┌─────────▼──────────────────────┐  │
    │    ArgoCD                      │  │
    │    argocd namespace            │  │
    │    GitOps sync from GitHub     │  │
    └────────────────────────────────┘  │
              └──────────────────────────┘

    AKS Cluster: 2 nodes (Standard_B2s_v2)
    Region: South Africa North
```

---

## Tech Stack

### Cloud & Infrastructure
| Tool | Purpose |
|---|---|
| Azure Kubernetes Service (AKS) | Managed Kubernetes cluster |
| Azure Container Registry (ACR) | Private Docker image registry |
| Azure PostgreSQL Flexible Server | Managed database (PostgreSQL 16) |
| Azure Key Vault | Encrypted secrets management |
| Azure Managed Identity | Workload Identity for pod authentication |

### Containerization
| Tool | Purpose |
|---|---|
| Docker | Multi-stage image builds |
| node:alpine3.22 | Base image for all backend services |
| nginx:stable-alpine | Runtime image for frontend service |

### Kubernetes & Deployment
| Tool | Purpose |
|---|---|
| Kubernetes 1.34.6 | Container orchestration |
| Helm | Kubernetes package manager and templating |
| ArgoCD | GitOps continuous deployment |
| NGINX Ingress Controller | Single entry point for all traffic |
| Secrets Store CSI Driver | Azure Key Vault integration |
| Horizontal Pod Autoscaler | Automatic pod scaling |

### Observability
| Tool | Purpose |
|---|---|
| Prometheus | Metrics collection and alerting |
| Grafana | Metrics visualization and dashboards |
| Alertmanager | Alert routing and notification |
| kube-state-metrics | Kubernetes object metrics |
| Node Exporter | Node level metrics |

### Application
| Tool | Purpose |
|---|---|
| Node.js + Express | Backend microservices |
| React.js | Frontend single page application |
| Sequelize | PostgreSQL ORM |
| JWT | Authentication tokens |
| Stripe | Payment processing |
| Nodemailer | Email notifications |

---

## Services

| Service | Port | Database | Responsibilities |
|---|---|---|---|
| auth-service | 3001 | nexacore_auth | Authentication, JWT generation and verification |
| user-service | 3002 | nexacore_users | User profiles and account management |
| billing-service | 3003 | nexacore_billing | Subscription plans and invoice management |
| payments-service | 3004 | nexacore_payments | Stripe payment processing and webhooks |
| notifications-service | 3005 | nexacore_notifications | Email and in-app notifications via SMTP |
| analytics-service | 3006 | nexacore_analytics | Events, metrics and reporting |
| admin-service | 3007 | nexacore_admin | Admin dashboard, audit logs and system config |
| frontend-service | 80 | None | React SPA served by nginx with API proxying |

---

## Project Structure

```
NexaCore/
├── auth-service/               # Node.js/Express authentication service
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── user-service/               # User management service
├── billing-service/            # Billing and subscription service
├── payments-service/           # Stripe payment service
├── notifications-service/      # Email notification service
├── analytics-service/          # Analytics and reporting service
├── admin-service/              # Admin management service
├── frontend-service/           # React frontend with nginx
│   ├── Dockerfile
│   ├── nginx.conf              # Reverse proxy config for API routing
│   └── src/
└── k8s/                        # All Kubernetes configuration
    ├── helm/                   # Helm chart for all services
    │   ├── Chart.yaml
    │   ├── templates/
    │   │   ├── deployment.yaml
    │   │   ├── service.yaml
    │   │   ├── hpa.yaml
    │   │   └── ingress.yaml
    │   ├── values.yaml         # Production values
    │   ├── values.dev.yaml     # Development overrides
    │   └── values.staging.yaml # Staging overrides
    ├── argocd/                 # ArgoCD application manifests
    │   ├── application.yaml
    │   ├── application-staging.yaml
    │   └── application-dev.yaml
    ├── monitoring/             # Prometheus and Grafana config
    │   ├── alert-rules.yaml
    │   └── nexacore-dashboard.yaml
    ├── secret-sync/            # CSI Driver secret sync pod
    ├── rbac.yaml               # ServiceAccount, Role, RoleBinding
    ├── configmap.yaml          # Non-sensitive configuration
    └── secret-provider-class.yaml  # Azure Key Vault CSI config
```

---

## Phase Breakdown

### Phase 1: Containerization
**Goal:** Package all 8 microservices into production-grade Docker images and push to Azure Container Registry.

**What was done:**
- Wrote multi-stage Dockerfiles for all 8 services
- Applied production best practices: non-root users, health checks, pinned base images, npm ci
- Pushed all images to ACR with native AKS integration

**Key decision:** Multi-stage builds reduced backend image sizes from 400-500MB to 68-71MB compressed. Frontend came in at 26.9MB using nginx:stable-alpine as the runtime.

**Read more:** [How I Containerized 8 Microservices with Production-Grade Dockerfiles](https://jasonawaitoma.hashnode.dev/how-i-containerized-8-microservices-with-production-grade-dockerfiles)

---

### Phase 2: Kubernetes Deployment
**Goal:** Deploy all services to AKS with proper networking, database connectivity and ingress.

**What was done:**
- Provisioned a 2-node AKS cluster on Azure
- Configured namespaces, RBAC, ServiceAccounts and RoleBindings
- Wrote Kubernetes Deployment and Service manifests for all 8 services with resource limits, readiness and liveness probes
- Provisioned Azure PostgreSQL with 7 separate databases
- Deployed NGINX Ingress Controller as the single public entry point
- Configured nginx reverse proxy inside the frontend container to proxy API requests to backend services using relative paths

**Key decision:** Instead of baking backend URLs into the React build as environment variables, nginx proxies all /api/* requests internally. The React app uses relative paths and works in any environment without rebuilding the image.

**Read more:** [Three Things That Broke Before NexaCore Went Live on Kubernetes](https://jasonawaitoma.hashnode.dev/three-things-that-broke-before-nexacore-went-live-on-kubernetes)

---

### Phase 3: Production Features
**Goal:** Introduce autoscaling, proper secrets management, Helm templating and GitOps.

**What was done:**
- Configured HPA for all 8 services with CPU (50%) and memory (70%) thresholds based on measured idle resource consumption
- Integrated Azure Key Vault with Workload Identity and the Secrets Store CSI Driver, replacing manually managed Kubernetes Secrets entirely
- Converted all 16 raw Kubernetes manifests into a single Helm chart with 4 template files and multi-environment values files
- Deployed ArgoCD for GitOps — GitHub is the single source of truth for all cluster state

**Key decision:** A dedicated secret-sync pod (2 replicas) handles CSI volume mounting rather than adding volume mounts to every application deployment. This keeps application deployments clean and centralises secret sync management.

**Read more:** [Why Raw Kubernetes Manifests Are Not Enough for Production and What We Did About It](https://jasonawaitoma.hashnode.dev/why-raw-kubernetes-manifests-are-not-enough-for-production)

---

### Phase 4: Observability
**Goal:** Full visibility into cluster and application health through metrics, dashboards and alerting.

**What was done:**
- Deployed kube-prometheus-stack via Helm (Prometheus, Grafana, Alertmanager, Node Exporter, kube-state-metrics)
- Created custom PrometheusRule with 4 alerting rules for NexaCore services
- Built a custom Grafana dashboard as code via ConfigMap covering CPU usage, memory usage, pod readiness, restart counts and network bandwidth per service

**Read more:** [Making Nexacore Observable: Prometheus, Grafana and Alerting on AKS](https://jasonawaitoma.hashnode.dev/making-nexacore-observable-prometheus-grafana-and-alerting-on-aks)

---

## Key Architecture Decisions

**1. Azure over AWS for cost efficiency**
AKS control plane is free compared to EKS at ~$0.10/hour. For a portfolio project running across 30+ days, this saves over $70/month.

**2. Nginx reverse proxy in the frontend container**
The frontend nginx config proxies all /api/* requests to backend services internally. React uses relative paths with no hardcoded URLs. This means the same Docker image works in any environment without rebuilding.

**3. Azure Key Vault with Workload Identity**
Secrets never touch the Git repository and are never stored as plain Kubernetes Secrets. Pods authenticate to Key Vault using cryptographic tokens issued by the AKS OIDC issuer with no credentials stored anywhere. A dedicated secret-sync pod keeps the Kubernetes Secret synced from Key Vault continuously.

**4. Helm range loops over individual templates**
One deployment template generates all 8 deployments through a range loop. Conditionals handle service-specific differences like Stripe secrets for payments-service and SMTP secrets for notifications-service. Changing a global setting requires editing one file, not eight.

**5. ArgoCD with selfHeal and prune enabled**
selfHeal: true means any manual cluster changes are automatically reverted to match Git. prune: true means resources deleted from the Helm chart are also deleted from the cluster. Git is always the source of truth with no exceptions.

**6. Separate databases per service**
Each of the 7 backend services has its own PostgreSQL database on a shared server. This enforces service isolation at the data layer — services cannot accidentally access each other's data.

---

## Infrastructure Details

| Resource | Value |
|---|---|
| AKS Cluster | nexacore-aks |
| Node Count | 2 x Standard_B2s_v2 |
| Kubernetes Version | 1.34.6 |
| Region | South Africa North |
| Container Registry | nexacoreregistry.azurecr.io |
| Database Server | nexacore-db.postgres.database.azure.com |
| PostgreSQL Version | 16 |
| Key Vault | nexacore-kv.vault.azure.net |
| Ingress IP | 20.87.113.204 |
| Public URL | http://nexacore.20.87.113.204.nip.io |

---

## Alerting Rules

Four custom PrometheusRules monitor NexaCore services:

| Alert | Condition | Severity |
|---|---|---|
| NexacorePodHighMemory | Pod memory exceeds 80% of limit for 5 minutes | Warning |
| NexacorePodHighCPU | Pod CPU exceeds 80% of limit for 5 minutes | Warning |
| NexacorePodRestartingTooMuch | Pod restarts more than 3 times in 15 minutes | Critical |
| NexacorePodNotReady | Pod not ready for more than 5 minutes | Critical |

---

## Getting Started

### Prerequisites

- Azure account with an active subscription
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed and logged in
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- [Helm](https://helm.sh/docs/intro/install/) installed
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

### Deploy NexaCore

**1. Clone the repository**
```bash
git clone https://github.com/3lack3ox/NexaCore-Microservice-Project
cd NexaCore-Microservice-Project
```

**2. Provision Azure infrastructure**
```bash
# Create resource group
az group create --name nexacore-rg --location southafricanorth

# Create ACR
az acr create --resource-group nexacore-rg --name nexacoreregistry --sku Basic

# Create AKS cluster
az aks create \
  --resource-group nexacore-rg \
  --name nexacore-aks \
  --node-count 2 \
  --node-vm-size Standard_B2s_v2 \
  --generate-ssh-keys \
  --attach-acr nexacoreregistry \
  --enable-oidc-issuer \
  --enable-workload-identity

# Configure kubectl
az aks get-credentials --resource-group nexacore-rg --name nexacore-aks
```

**3. Build and push images**
```bash
# Build all 8 images
docker build -t auth-service ./auth-service
# ... repeat for all services

# Tag and push to ACR
docker tag auth-service nexacoreregistry.azurecr.io/auth-service:v1
docker push nexacoreregistry.azurecr.io/auth-service:v1
# ... repeat for all services
```

**4. Configure secrets**

Set up Azure Key Vault and add your secrets following the [Phase 3 blog post](https://jasonawaitoma.hashnode.dev/why-raw-kubernetes-manifests-are-not-enough-for-production) for detailed Key Vault and Workload Identity setup.

**5. Apply base configuration**
```bash
kubectl apply -f k8s/rbac.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret-provider-class.yaml
kubectl apply -f k8s/secret-sync/deployment.yaml
```

**6. Install NGINX Ingress Controller**
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.replicaCount=2 \
  --set controller.nodeSelector."kubernetes\.io/os"=linux
```

**7. Deploy with ArgoCD**
```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Apply the ArgoCD application
kubectl apply -f k8s/argocd/application.yaml
```

ArgoCD will automatically deploy all services from the Helm chart. Monitor the sync:
```bash
kubectl get application -n argocd
```

**8. Install observability stack**
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=your-password \
  --set prometheus.prometheusSpec.retention=7d

kubectl apply -f k8s/monitoring/alert-rules.yaml
kubectl apply -f k8s/monitoring/nexacore-dashboard.yaml
```

For detailed explanations of every step, refer to the [blog series](https://jasonawaitoma.hashnode.dev).

---

## About

This project was built by **Jason Awaitoma**, a DevOps Engineer based in Lagos, Nigeria.

- **LinkedIn:** [linkedin.com/in/jason-awaitoma-a9752013b](https://www.linkedin.com/in/jason-awaitoma-a9752013b)
- **Blog:** [jasonawaitoma.hashnode.dev](https://jasonawaitoma.hashnode.dev)
- **GitHub:** [github.com/3lack3ox](https://github.com/3lack3ox)