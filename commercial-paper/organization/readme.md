# UPGRADE CONTRACT

1. Invoke old version
`docker exec cliMagnetoCorp peer chaincode invoke -n papercontract -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel`

2. Install new version
`docker exec cliMagnetoCorp peer chaincode install -n papercontract -v ${VERSION_NUMBER} -p /opt/gopath/src/github.com/contract -l node`

3. Upgrade to new version
`docker exec cliMagnetoCorp peer chaincode upgrade -n papercontract -v ${VERSION_NUMBER} -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"`