# Relatório de Execução — ServeRest (local)

| Campo | Valor |
|-------|-------|
| **Alvo** | ServeRest — `http://localhost:3000` |
| **Ferramenta** | k6 (`<preencher: saída de k6 version>`) |
| **Cenário** | `POST /usuarios` com e-mail único, check de status `201` |
| **Autor** | Maurício |
| **Data** | 02-10-2026 |

## Resultados

| Teste | Perfil | Requisições | Vazão | p95 | Máx | Erros | Resultado |
|-------|--------|------------:|------:|----:|----:|------:|:---------:|
| Smoke | 1 VU, 1 iteração | 1 | — | 4,15 ms | 4,15 ms | 0% | ✅ |
| Load | até 10 VUs, 2 min, com sleep | 917 | 7,6 req/s | 7,43 ms | 23,7 ms | 0% | ✅ |
| Stress 1 | até 1000 VUs, com sleep | 104.482 | 385,7 req/s | 38,78 ms | 309,6 ms | 0% | ✅ |
| Stress 2 | até 400 VUs, **sem sleep** | 264.173 | 978,4 req/s | 368,07 ms | 762,7 ms | 0% | ✅ |
| Stress 3 | até 800 VUs, **sem sleep** | 228.974 | 848,0 req/s | **795,56 ms** | 1,45 s | 0% | ❌ |

Critérios: `p(95) < 500 ms` e `http_req_failed < 1%`. O único threshold que falhou foi o `p(95)` do Stress 3.

## Conclusões

1. **Smoke e load passaram com folga.** Com 10 VUs, o p95 foi de 7 ms contra um limite de 500 ms.
2. **VUs não são carga.** Com `sleep(1)`, 1000 VUs geraram ~386 req/s. Sem pausa, 400 VUs geraram ~978 req/s. Por isso foi preciso remover o `sleep` para pressionar a API.
3. **A saturação apareceu entre 400 e 800 VUs.** Ao dobrar os VUs, a vazão **caiu** (978 → 848 req/s) e o p95 mais que dobrou (368 → 796 ms). Esse é o sinal clássico de que a API chegou ao limite.
4. **A API ficou lenta, mas não falhou.** Nenhuma execução teve erro: o limite encontrado é de latência.

## Limitações

- k6 e API rodam na mesma máquina, então o gargalo pode ser o hardware.
- A ServeRest guarda os dados em memória, e cada execução cria centenas de milhares de usuários, o que pode influenciar a latência.
- Cada perfil foi executado uma vez.

