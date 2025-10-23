## DB Setup steps 
CREATE DATABASE cms_db;

CREATE USER cms_user WITH PASSWORD 'cms_pass';

GRANT ALL PRIVILEGES ON DATABASE cms_db TO cms_user;

\c cms_db

GRANT ALL ON SCHEMA public TO cms_user;

\dt --> view all tables


## Local execution of modules 

In terminal  #1 start cms app 

cd CMS-Node-App/cms 

npm run dev 


In terminal #2 start node app and specify the port and name of node app (running on localhost and commands running in powershell )

cd CMS-Node-App/node-app 

$env:PORT=4001; $env:NODE_ID='node-1'; & 'C:\Program Files\nodejs\npm.cmd' run dev

In terminal #3 start node app and specify the port and name of node app (running on localhost and commands running in powershell )

cd CMS-Node-App/node-app 

$env:PORT=4002; $env:NODE_ID='node-2'; & 'C:\Program Files\nodejs\npm.cmd' run dev


Endpoints to check the following : 

health of CMS --> https://localhost:3000/health 

View all nodes 

## Quick Endpoints Reference

Use the following endpoints to quickly test and exercise the CMS and Node Apps. All examples assume the CMS runs on http://localhost:3000 and Node Apps run on http://localhost:4001 and http://localhost:4002.

### CMS (Central Management Server)

- Health check

	GET /health

	Example:
	```powershell
	curl http://localhost:3000/health
	```

- List all nodes

	GET /api/nodes

	Example:
	```powershell
	curl http://localhost:3000/api/nodes
	```

- Get node by id

	GET /api/nodes/:nodeId

	Example:
	```powershell
	curl http://localhost:3000/api/nodes/node-1
	```

- Register a node

	POST /api/nodes/register
	Content-Type: application/json

	Body: { "nodeId": "node-1", "ip": "localhost", "port": 4001 }

	Example:
	```powershell
	curl -X POST http://localhost:3000/api/nodes/register -H "Content-Type: application/json" -d '{"nodeId":"node-1","ip":"localhost","port":4001}'
	```

- Disconnect a node (mark disconnected)

	POST /api/nodes/disconnect/:nodeId

	Example:
	```powershell
	curl -X POST http://localhost:3000/api/nodes/disconnect/node-1
	```

- Upload a file (CMS will forward to all connected nodes)

	POST /api/uploads
	Content-Type: multipart/form-data

	Form field: file (the file to distribute)

	Example:
	```powershell
	curl -X POST http://localhost:3000/api/uploads -F "file=@test.txt"
	```

- Get upload logs

	GET /api/uploads/logs

	Example:
	```powershell
	curl http://localhost:3000/api/uploads/logs
	```

### Node App (each node)

- Direct upload endpoint (used by CMS to push files to node)

	POST /upload
	Content-Type: multipart/form-data

	The CMS sends the file plus optional fields nodeId, nodeIp, nodePort so the node saves into the folder structure.

	Example (direct to node):
	```powershell
	curl -X POST http://localhost:4001/upload -F "file=@C:\path\to\test.txt"
	```

### Notes on folder structure

When uploading from CMS, files are saved under `/uploads/<ip>/<port>/<node-id>/<filename>` both on the CMS side (copy) and on the Node App side (received file).

Example file location on Windows when ip=localhost, port=4001, nodeId=node-1:

```
cms/uploads/localhost/4001/node-1/test.txt
node-app/uploads/localhost/4001/node-1/test.txt
```

Use the commands above to verify health, registration, upload distribution, and logs.