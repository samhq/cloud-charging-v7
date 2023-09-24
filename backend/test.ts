import { performance } from "perf_hooks";
import supertest from "supertest";
import { buildApp } from "./app";

const app = supertest(buildApp());

async function basicLatencyTest() {
    const accounts = ['test-1', 'test-2', 'test-3'];
    const charges = [0, 15, 20, 25, 30, 35]

    for (let i = 0; i < 3; i++) {
        await app.post("/reset").send({account: accounts[i]}).expect(204);
    }

    const start = performance.now();
    for (let i = 0; i < 20; i++) {
        let charge = charges[Math.floor(Math.random()*6)]
        if (charge == 0) {
            await app.post("/charge").send({account: accounts[i%3], charges: charge}).expect(400);
        } else {
            await app.post("/charge").send({account: accounts[i%3], charges: charge}).expect(200);
        }
    }
    // await app.post("/charge").expect(200);
    // await app.post("/charge").expect(200);
    // await app.post("/charge").expect(200);
    // await app.post("/charge").expect(200);
    // await app.post("/charge").expect(200);
    console.log(`Latency: ${performance.now() - start} ms`);
}

async function runTests() {
    await basicLatencyTest();
}

runTests().catch(console.error);
