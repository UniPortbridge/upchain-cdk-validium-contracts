#!/bin/bash
source ./deploy/address_params.sh
touch deployment/deploy_parameters.json.temp
sed "s/GLOBAL_PARAM_sequencer/$GLOBAL_PARAM_sequencer/g" deployment/deploy_parameters.json.deploy > deployment/deploy_parameters.json.temp
sed -i "s/GLOBAL_PARAM_aggregator/$GLOBAL_PARAM_aggregator/g" deployment/deploy_parameters.json.temp
sed "s/GLOBAL_PARAM_deployer/$GLOBAL_PARAM_deployer/g" deployment/deploy_parameters.json.temp > deployment/deploy_parameters.json
rm deployment/deploy_parameters.json.temp
