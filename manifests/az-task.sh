az login -u zach.zhu@lifebooster.ca -p Unsw85474?

# Currently, need to enable preview to process ACR integration. 2020-01-31 
az extension update --name aks-preview

az aks update -n senz-aks-test -g rg-senz-aks-usce-dev --attach-acr senzakstest