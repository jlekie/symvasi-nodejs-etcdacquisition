import Bluebird from 'bluebird';
import Etcd from 'node-etcd';

import { Announcer } from 'symvasi-runtime';

export class EtcdAnnouncer extends Announcer {
    constructor(serviceName, endpoint, etcdUrl) {
        super(serviceName, endpoint);

        this.etcdClient = Bluebird.promisifyAll(new Etcd(etcdUrl));
    }

    async registerAsync() {
        let { etcdClient } = this;
        
        let { id, data } = this.endpoint.save();
        let decodedData = data.toString('utf8');
        
        await etcdClient.setAsync(`/symvasi/endpoints/${this.serviceName}/${id}`, decodedData, { ttl: 20 });
    }
}