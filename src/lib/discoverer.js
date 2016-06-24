import _ from 'lodash';
import Bluebird from 'bluebird';
import Etcd from 'node-etcd';

import { Discoverer } from 'symvasi-runtime';

export class EtcdDiscoverer extends Discoverer {
    constructor(serviceName, endpointFactory, etcdUrl) {
        super(serviceName, endpointFactory);

        this.etcdClient = Bluebird.promisifyAll(new Etcd(etcdUrl));
    }

    async loadEndpointsAsync() {
        let response = await this.etcdClient.getAsync(`/symvasi/endpoints/${this.serviceName}`);

        return _.map(response.node.nodes, (node) => {
            let encodedData = new Buffer(node.value);

            return this.endpointFactory.load(encodedData);
        });
    }
}