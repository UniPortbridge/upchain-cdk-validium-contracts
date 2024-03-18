#!/bin/bash
source ./address_params.sh
source ./contract_params.sh
cp ../deployment/genesis.json ./

sed -i "s/GLOBAL_PARAM_cdkValidiumAddress/$GLOBAL_PARAM_cdkValidiumAddress/g" ./genesis.json
sed -i "s/GLOBAL_PARAM_maticTokenAddress/$GLOBAL_PARAM_maticTokenAddress/g" ./genesis.json
sed -i "s/GLOBAL_PARAM_polygonZkEVMGlobalExitRootAddress/$GLOBAL_PARAM_polygonZkEVMGlobalExitRootAddress/g" ./genesis.json
sed -i "s/GLOBAL_PARAM_cdkDataCommitteeContract/$GLOBAL_PARAM_cdkDataCommitteeContract/g" ./genesis.json
sed -i "s/GLOBAL_PARAM_genBlockNumber/$GLOBAL_PARAM_genBlockNumber/g" ./genesis.json

cp ./node.config.toml.deploy ./node.config.toml
sed -i "s/GLOBAL_PARAM_aggregator/$GLOBAL_PARAM_aggregator/g" ./node.config.toml
sed -i "s/GLOBAL_PARAM_sequencer/$GLOBAL_PARAM_sequencer/g" ./node.config.toml
sed -i "s/GLOBAL_PARAM_cdkValidiumAddress/$GLOBAL_PARAM_cdkValidiumAddress/g" ./node.config.toml
sed -i "s/GLOBAL_PARAM_polygonZkEVMBridgeAddress/$GLOBAL_PARAM_polygonZkEVMBridgeAddress/g" ./node.config.toml
sed -i "s/GLOBAL_PARAM_L2_polygonZkEVMBridgeAddress/$GLOBAL_PARAM_L2_polygonZkEVMBridgeAddress/g" ./node.config.toml
sed -i "s/GLOBAL_PARAM_polygonZkEVMGlobalExitRootAddress/$GLOBAL_PARAM_polygonZkEVMGlobalExitRootAddress/g" ./node.config.toml
sed -i "s/GLOBAL_PARAM_maticTokenAddress/$GLOBAL_PARAM_maticTokenAddress/g" ./node.config.toml

cp ./docker-compose.yml.deploy ./docker-compose.yml
sed -i "s/GLOBAL_PARAM_aggregator/$GLOBAL_PARAM_aggregator/g" ./docker-compose.yml
sed -i "s/GLOBAL_PARAM_sequencer/$GLOBAL_PARAM_sequencer/g" ./docker-compose.yml
sed -i "s/GLOBAL_PARAM_cdkValidiumAddress/$GLOBAL_PARAM_cdkValidiumAddress/g" ./docker-compose.yml
sed -i "s/GLOBAL_PARAM_polygonZkEVMBridgeAddress/$GLOBAL_PARAM_polygonZkEVMBridgeAddress/g" ./docker-compose.yml
sed -i "s/GLOBAL_PARAM_L2_polygonZkEVMBridgeAddress/$GLOBAL_PARAM_L2_polygonZkEVMBridgeAddress/g" ./docker-compose.yml
sed -i "s/GLOBAL_PARAM_polygonZkEVMGlobalExitRootAddress/$GLOBAL_PARAM_polygonZkEVMGlobalExitRootAddress/g" ./docker-compose.yml
sed -i "s/GLOBAL_PARAM_maticTokenAddress/$GLOBAL_PARAM_maticTokenAddress/g" ./docker-compose.yml
