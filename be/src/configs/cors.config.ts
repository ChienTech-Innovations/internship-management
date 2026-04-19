import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://internship-management-app-rouge.vercel.app',
  'https://api.duychien.shop',
  'https://duychien.shop',
  'https://app.duychien.shop',
  'https://backend.backend.svc.cluster.local:3000',
  'http://backend.backend.svc.cluster.local:3001',
  'https://backend.backend.svc.cluster.local:3001',
  'http://backend.backend.svc.cluster.local:3002',
  'https://backend.backend.svc.cluster.local:3002',
  'http://backend.backend.svc.cluster.local:3003',
  'https://backend.backend.svc.cluster.local:3003',
];

export const CORS_CONFIG: CorsOptions = {
  origin: CORS_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Request-Id',
    'traceparent',
    'tracestate',
    'baggage',
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  credentials: true,
};
