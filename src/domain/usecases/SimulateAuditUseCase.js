import { EXAMPLES, EXAMPLE_OUTPUT } from '../../data/examples.js';

/**
 * Executes the medical records quality audit.
 * Parses the incoming JSON, matches it against available examples to pull template expectations,
 * and calculates compliance scores and lists non-conformity violations.
 * 
 * @param {string} jsonText - Raw JSON of the medical chart records.
 * @returns {object|null} Evaluated audit report or null if JSON is invalid.
 */
export function simulateAudit(jsonText, customExamples = EXAMPLES) {
  let parsed = null;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return null;
  }

  const prontId = Array.isArray(parsed) ? parsed[0]?.["Prontuário"] : parsed?.["Prontuário"];

  const matchedEx = customExamples.find(ex => {
    let exParsed = JSON.parse(ex.input);
    let exPront = Array.isArray(exParsed) ? exParsed[0]?.["Prontuário"] : exParsed?.["Prontuário"];
    return exPront === prontId;
  });

  const template = matchedEx ? matchedEx.output : EXAMPLE_OUTPUT;
  const output = JSON.parse(JSON.stringify(template));

  const statusCfg = {
    conforme: 'conforme',
    nao_conforme: 'nao_conforme',
    nao_se_aplica: 'nao_se_aplica',
    nao_aplicavel: 'nao_se_aplica'
  };

  output.secoes.forEach(sec => {
    if (sec.subgrupos) {
      sec.subgrupos.forEach(sub => {
        if (sub.itens && !Array.isArray(sub.itens)) {
          sub.itens = [sub.itens];
        }
      });
    } else if (sec.itens && !Array.isArray(sec.itens)) {
      sec.itens = [sec.itens];
    }

    const relevantItens = sec.subgrupos
      ? sec.subgrupos.flatMap(sub => sub.itens || [])
      : (sec.itens || []);

    const applicableItens = relevantItens.filter(it => it.status === 'conforme' || it.status === 'nao_conforme');
    const total = applicableItens.length;
    const conformes = applicableItens.filter(it => it.status === 'conforme').length;

    sec.total = total;
    sec.conformes = conformes;
    sec.conformidade = total > 0 ? Math.round((conformes / total) * 1000) / 10 : 100;
  });

  const overallTotal = output.secoes.reduce((acc, sec) => acc + sec.total, 0);
  const overallConformes = output.secoes.reduce((acc, sec) => acc + sec.conformes, 0);
  output.conformidade_geral = overallTotal > 0 ? Math.round((overallConformes / overallTotal) * 1000) / 10 : 100;

  // Extract all unique dates from subgroups dynamically
  const dateSet = new Set();
  output.secoes.forEach(sec => {
    if (sec.subgrupos) {
      sec.subgrupos.forEach(sub => {
        if (sub.data) {
          const match = sub.data.match(/(\d{2})\/(\d{2})/);
          if (match) {
            dateSet.add(`${match[1]}/${match[2]}`);
          }
        }
      });
    }
  });

  const days = Array.from(dateSet).sort((a, b) => {
    const [da, ma] = a.split('/').map(Number);
    const [db, mb] = b.split('/').map(Number);
    return ma !== mb ? ma - mb : da - db;
  });

  if (days.length === 0) {
    days.push('15/04', '16/04', '17/04', '18/04');
  }
  output.days = days;

  const getSubgroupData = (secId, titleSub) => {
    const sec = output.secoes.find(s => s.id === secId);
    if (!sec) return [];
    return sec.subgrupos
      ? sec.subgrupos.filter(sub => sub.titulo.toLowerCase().includes(titleSub.toLowerCase()))
      : [];
  };

  const buildQuantitativoRow = (tipo, secId, titleSub, isEvolution) => {
    const subs = getSubgroupData(secId, titleSub);
    const row = { tipo };
    let presentCount = 0;
    let totalApp = 0;
    let totalConf = 0;

    days.forEach(d => {
      const subForDay = subs.find(sub => (sub.data && sub.data.includes(d)) || sub.titulo.includes(d));
      if (subForDay) {
        let isPresent = false;
        if (isEvolution) {
          const isAbsent = subForDay.itens.every(it => it.status === 'nao_conforme' && (it.valor === 'Ausente' || it.observacao === 'Registro ausente'));
          isPresent = !isAbsent;
        } else {
          isPresent = true;
        }

        row[d] = isPresent;
        if (isPresent) presentCount++;

        const app = subForDay.itens.filter(it => it.status === 'conforme' || it.status === 'nao_conforme');
        totalApp += app.length;
        totalConf += app.filter(it => it.status === 'conforme').length;
      } else {
        row[d] = false;
      }
    });

    row.total = presentCount;
    row.conformidade = totalApp > 0 ? Math.round((totalConf / totalApp) * 1000) / 10 : 100;
    return row;
  };

  output.quantitativo = [
    buildQuantitativoRow('Anamnese Médica', 'B', 'Anamnese Médica', false),
    buildQuantitativoRow('Anamnese Enfermagem', 'D', 'Anamnese Enfermagem', false),
    buildQuantitativoRow('Evolução Médica', 'B', 'Evolução Médica', true),
    buildQuantitativoRow('Evolução Enfermagem', 'D', 'Evolução Enfermagem', true),
    buildQuantitativoRow('Serviço Social', 'E', 'Serviço Social', false),
  ];

  const dynamicNaoConformidades = [];
  output.secoes.forEach(sec => {
    if (sec.subgrupos) {
      sec.subgrupos.forEach(sub => {
        sub.itens.forEach(it => {
          if (it.status === 'nao_conforme') {
            dynamicNaoConformidades.push({
              secao: sec.id,
              item: `${sub.titulo} — ${it.item}`,
              descricao: it.observacao || 'Registro não conforme'
            });
          }
        });
      });
    } else if (sec.itens) {
      sec.itens.forEach(it => {
        if (it.status === 'nao_conforme') {
          dynamicNaoConformidades.push({
            secao: sec.id,
            item: it.item,
            descricao: it.observacao || 'Registro não conforme'
          });
        }
      });
    }
  });
  output.nao_conformidades = dynamicNaoConformidades;

  return output;
}
