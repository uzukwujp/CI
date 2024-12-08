
import {metrics} from '@opentelemetry/api';
import {Request, Response, NextFunction} from "express"
import os from 'os';


export const setup_metrics = (req: Request, res: Response, next: NextFunction) => {

      const start = Date.now();

      const meter = metrics.getMeter('post-service')

      const totalRequests = meter.createCounter('http.server.request_count', {
            description: 'Total number of HTTP requests'
      });

      const routeRequests = meter.createCounter('http.server.request_count.by_route', {
            description: 'Number of HTTP requests by route'
      });

      const latencyHistogram = meter.createHistogram('http.server.duration', {
            description: 'Duration of HTTP requests',
            unit: 'ms',
      });

      const totalErrors = meter.createCounter('http.server.error_count', {
            description: 'Total number of HTTP errors'
      });

      const routeErrors = meter.createCounter('http.server.error_count.by_route', {
            description: 'Number of HTTP errors by route'
      });

      const cpuUsage = meter.createObservableGauge('system.cpu_usage', {
            description: 'CPU usage'
      });

      const memoryUsage = meter.createObservableGauge('system.memory_usage', {
            description: 'Memory usage'
      });

    setInterval(() => {
      const cpuUsagePercent = os.loadavg()[0] / os.cpus().length * 100;
      cpuUsage.addCallback((observableResult) => {
        observableResult.observe(cpuUsagePercent);
      });
    
      const memUsagePercent = (os.totalmem() - os.freemem()) / os.totalmem() * 100;
      memoryUsage.addCallback((observableResult) => {
        observableResult.observe(memUsagePercent);
      });
    }, 10000);
    
    totalRequests.add(1);
    routeRequests.add(1, { route: req.path });
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      latencyHistogram.record(duration, { route: req.path });
    
      if (res.statusCode >= 400) {
          totalErrors.add(1);
          routeErrors.add(1, { route: req.path });
        }
      })
      
    next()  
};

