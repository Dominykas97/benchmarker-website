**To deploy Express backend on Openshift, run locally:**
```
cd server && npx nodeshift --deploy.port=5000 --expose && cd -

```

**To deploy React frontend on Openshift, run locally:**
```
cd client && npx nodeshift --deploy.port=3000 --expose && cd -

```

**To sync React files with Openshift:**
```
cd Client; ./syncWithOpenshift.sh

```
