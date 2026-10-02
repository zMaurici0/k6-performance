import http from 'k6/http';
import { check, sleep} from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  
    { duration: '1m', target: 10 },  
    { duration: '30s', target: 0 },  
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],     
    http_req_duration: ['p(95)<500'],  
  },
};

const url = 'http://localhost:3000/usuarios';

const params = {
    headers:{
        'content-type': 'application/json'
    }
}

export default function () {
    const body = JSON.stringify({
        "nome": "Fulano da Silva",
        "email": `beltrano${Date.now()}-${__VU}-${__ITER}@qa.com.br`,
        "password": "teste",
        "administrador": "true"
    })
    
    const res = http.post(url, body, params);

    check(res, {
        'status should be 201': (r) => r.status === 201,
    })

    sleep(1);
}
