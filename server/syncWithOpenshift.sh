#/bin/sh
POD_NAME=$(oc get pods | grep benchmarker-website | grep Running | awk '{print $1}')
echo Found pod $POD_NAME
chmod -R g+w .
oc rsync --progress --watch ./src $POD_NAME:/opt/app-root/src
