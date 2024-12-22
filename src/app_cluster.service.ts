import * as Cluster from 'cluster';
import * as OS from 'os';
import { Injectable } from '@nestjs/common';

const cluster: any = Cluster;
const os: any = OS;

@Injectable()
export class AppClusterService {
  static clusterize(callback: any): void {
    const numCPUs = os.cpus().length;
    if (cluster.isMaster) {
      console.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
