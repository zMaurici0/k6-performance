# Testes de Performance com k6 — ServeRest

Testes de **smoke**, **load** e **stress** com [k6](https://k6.io) na API [ServeRest](https://serverest.dev), rodando localmente.

> **Resultado:** a API aguentou ~978 req/s (400 VUs) dentro do limite de 500 ms. Com 800 VUs, o limite foi ultrapassado, mas **sem nenhum erro**.

## O que foi testado

- **Endpoint:** `POST /usuarios` (cadastro de usuário com e-mail único)
- **Validação:** status `201`
- **Critério de aceite:** `p(95) < 500 ms` e menos de `1%` de falhas

| Teste | Objetivo | Perfil |
|-------|----------|--------|
| Smoke | Verificar se tudo funciona | 1 VU, 1 iteração |
| Load | Carga esperada | Até 10 VUs, com `sleep(1)` |
| Stress | Achar o limite da API | Até 1000 VUs, com e sem `sleep` |

## Estrutura

```
k6-performance-testing/
├── tests/
│   ├── smoke/smoke.js
│   ├── load/load.js
│   └── stress/stress.js
├── RESULTS-2026-10-02-serverest-local.md
└── README.md
```

## Como executar

Pré-requisitos: [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) e Node.js.

```bash
# terminal 1: subir a API
npx serverest@latest

# terminal 2: rodar os testes
k6 run tests/smoke/smoke.js
k6 run tests/load/load.js
k6 run tests/stress/stress.js
```

Se um threshold falhar, o k6 mostra `thresholds ... have been crossed`. É o comportamento esperado.

## Resultados

| Teste | Perfil | p95 | Erros | Resultado |
|-------|--------|----:|------:|:---------:|
| Smoke | 1 VU | 4,15 ms | 0% | ✅ |
| Load | 10 VUs | 7,43 ms | 0% | ✅ |
| Stress | 400 VUs, sem sleep | 368 ms | 0% | ✅ |
| Stress | 800 VUs, sem sleep | 796 ms | 0% | ❌ |

Análise completa em [RESULTS-2026-10-02-serverest-local.md](RESULTS-2026-10-02-serverest-local.md).

## Limitações

- A API e o k6 rodam na mesma máquina, então os números servem para comparar execuções, não para prever produção.
- Só um endpoint foi testado (`POST /usuarios`).

## Próximos passos

- Testar um fluxo com login e produtos
- Rodar o smoke no GitHub Actions
