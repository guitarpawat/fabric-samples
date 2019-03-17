#!/bin/bash

# This batch file is for upgrade contract in the network
# Run this by
# ./update.sh ${new_version}

new_version=$1

echo update new_version ${new_version}
docker exec cliMagnetoCorp peer chaincode invoke -n papercontract -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel
docker exec cliMagnetoCorp peer chaincode install -n papercontract -v ${new_version} -p /opt/gopath/src/github.com/contract -l node
docker exec cliMagnetoCorp peer chaincode upgrade -n papercontract -v ${new_version} -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"
