import http from 'k6/http';
import { check } from 'k6';

export let options = {
  scenarios: {
    steady_10k_test: {
      executor: 'ramping-arrival-rate',

      startRate: 20,          // start with 20 req/sec
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 200,

      stages: [
        { target: 50, duration: '30s' },   // 50 rps
        { target: 100, duration: '30s' },  // 100 rps
        { target: 150, duration: '30s' },  // 150 rps
      ],
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.05'],        // <5% failures
    http_req_duration: ['p(95)<1500'],     // 95% under 1.5s
  },
};

export default function () {
  let res = http.get(
    'https://recruit-teal-ten.vercel.app/recruitment/embedded-systems',
    {
      redirects: 5, // follow redirects (important for Vercel)
    }
  );

  check(res, {
    'status is 200 or 3xx': (r) => r.status >= 200 && r.status < 400,
  });
}
