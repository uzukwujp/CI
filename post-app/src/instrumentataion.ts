
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import {SEMRESATTRS_SERVICE_NAME,SEMRESATTRS_SERVICE_VERSION} from '@opentelemetry/semantic-conventions';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { metrics } from '@opentelemetry/api';


export const startInstrumentation =  () => {

  // configure metrics reader provider
  const metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({}),
    exportIntervalMillis: 20000,
  })
  

  // configure metrics provider
  const postServiceMeterProvider = new MeterProvider({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'post-service',
      [SEMRESATTRS_SERVICE_VERSION]: '1.0.0'  
    }),
    readers: [metricReader]
  })
  

  // sets metrics provider globally in the app
  metrics.setGlobalMeterProvider(postServiceMeterProvider);



  // configure trace sdk
  const sdk = new NodeSDK({

    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'post-service',
      [SEMRESATTRS_SERVICE_VERSION]: '1.0.0',
    }),
    traceExporter: new OTLPTraceExporter({})
    
  });

  sdk.start()

};


