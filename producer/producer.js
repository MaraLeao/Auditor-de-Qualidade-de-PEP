import { createClient } from "redis";
import { randomUUID } from "crypto";

const redis = createClient({ url: "redis://localhost:6379" });
await redis.connect();

const QUEUE_KEY = "fila:prontuarios";

async function publicarLote(prontuarios, loteId) {
    let publicados = 0;

    for (const p of prontuarios) {
        const job = {
            job_id: randomUUID(),
            lote_id: loteId,
            numero_prontuario: p.numero,
            conteudo: p.conteudo,
            criado_em: new Date().toISOString(),
            tentativas: 0,
        };

        if (!job.numero_prontuario || !job.conteudo?.trim()) {
            console.error(`Prontuário inválido, pulando: ${JSON.stringify(job.numero_prontuario)}`);
            continue;
        }

        await redis.lPush(QUEUE_KEY, JSON.stringify(job));
        publicados++;
    }

    return publicados;
}

const loteId = randomUUID();
const total = await publicarLote(
    [
        { numero: "12345", conteudo: "texto do prontuário 1 com dados clínicos..." },
        { numero: "12346", conteudo: "texto do prontuário 2 com dados clínicos..." },
        { numero: "12347", conteudo: "texto do prontuário 3 com dados clínicos..." },
    ],
    loteId
);

console.log(`Lote ${loteId} publicado com ${total} prontuário(s).`);
await redis.quit();