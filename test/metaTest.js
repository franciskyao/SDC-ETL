import http from 'k6/http';
import { sleep } from 'k6';
export let options = {
  vus: 10,
  duration: '10s',
};
export default function () {
  for (let prodId = 1; prodId < 1000; prodId++) {
    http.get(`http://localhost:5000/reviews/meta?product_id=${prodId}`);
  }
  sleep(1);
}