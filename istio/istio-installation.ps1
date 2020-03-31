# Step 1: Create istio-system namespace 
kubectl create namespace istio-system --save-config

# Step 2: Create Kiali and Grafana secrets, make sure the username and passphrase are encoded correctly, eg. check echo -n "kiali" | base64
kubectl apply -f kiali-secrets.yml
kubectl apply -f grafana-secrets.yml

# Create istio.aks.yml, which has the configurations, and install istio by this configuration
istioctl manifest apply -f istio.aks.yml

# Add a namespace label to instruct Istio to automatically inject Envoy sidecar proxies
kubectl label namespace default istio-injection=enabled

# Add SSL to the istio gateway, but firstly make sure having the key and crt files for the wildcrad 
kubectl create -n istio-system secret tls istio-ingressgateway-certs --key _.lifebooster.ca.key --cert _.lifebooster.ca.crt


