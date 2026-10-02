import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<0.01'],     
    http_req_duration: ['p(95)<500'],  
  },
};

const url = 'http://localhost:3000/usuarios';

const body = JSON.stringify({
    "nome": "Fulano da Silva",
    "email": `beltrano${Date.now()}@qa.com.br`,
    "password": "teste",
    "administrador": "true"
})

const params = {
    headers:{
        'content-type': 'application/json'
    }
}

export default function () {
    const res = http.post(url, body, params);

    check(res, {
        'status should be 201': (r) => r.status === 201,
    })
}
