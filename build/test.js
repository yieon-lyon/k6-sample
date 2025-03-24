import http from 'k6/http'
import { Rate } from 'k6/metrics'
import { check, sleep } from 'k6'

const failRate = new Rate('failed_requests')

export default function () {
    let result
    if (__ENV.AUTH_ENABLED === 'true') {
        result = http.get(__ENV.URI, { headers: { 'Authorization': __ENV.TOKEN }})
    } else {
        result = http.get(__ENV.URI)
    }

    check(result, {
        'http response status code is 200': result.status === 200
    })
    failRate.add(result.status !== 200)

    sleep(1)
}