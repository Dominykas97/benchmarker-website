#/bin/sh
POD_NAME=$(oc get pods | grep express-back-end | grep Running | awk '{print $1}')
echo Found pod $POD_NAME
chmod -R g+w .
oc rsync --progress --watch ./ $POD_NAME:/opt/app-root/src
