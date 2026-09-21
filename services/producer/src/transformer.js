/**
 * Transformer: converts the data_extract output format into
 * the frontend rendering format expected by ResultCard/DashboardView.
 *
 * Input:  { record_id, audit_data: { secao_a, secao_b_anamnese, conformity_global, ... } }
 * Output: { prontuario, conformidade_geral, secoes[], nao_conformidades[], quantitativo[], days[] }
 */

/**
 * Transform raw audit_data from data_extract into frontend-renderable format.
 * @param {object} rawResult - The raw result from data_extract (single patient)
 * @returns {object} Frontend-compatible structure
 */
export function transformAuditResult(rawResult) {
  const auditData = rawResult.audit_data || rawResult;
  const recordId = rawResult.record_id || auditData.secao_a?.prontuario || "Desconhecido";

  // Build sections array
  const secoes = [];

  // Section A: Identificação
  const secaoA = auditData.secao_a || {};
  const confA = auditData.conformity_a || {};
  secoes.push({
    id: "A",
    titulo: "Identificação do Paciente",
    conformes: confA.valid || 0,
    total: confA.total || 0,
    conformidade: confA.total > 0 ? Math.round((confA.valid / confA.total) * 1000) / 10 : 100,
    itens: [
      { item: "Prontuário", valor: secaoA.prontuario || "N/A", status: isConforme(secaoA.prontuario) },
      { item: "Data de Nascimento", valor: secaoA.data_nascimento || "N/A", status: isConforme(secaoA.data_nascimento) },
      { item: "Idade", valor: secaoA.idade || "N/A", status: isConforme(secaoA.idade) },
      { item: "Especialidade Internação", valor: secaoA.especialidade_internacao || "N/A", status: isConforme(secaoA.especialidade_internacao) },
      { item: "Período de Internação", valor: secaoA.periodo_internacao || "N/A", status: isConforme(secaoA.periodo_internacao) },
      { item: "Diagnóstico de Internação", valor: secaoA.diagnostico_internacao || "N/A", status: isConforme(secaoA.diagnostico_internacao) },
      { item: "Especialidade Cirurgia", valor: secaoA.especialidade_cirurgia || "N/A", status: isConforme(secaoA.especialidade_cirurgia) },
      { item: "Unidade Funcional", valor: secaoA.unidade_funcional || "N/A", status: isConforme(secaoA.unidade_funcional) },
    ],
  });

  // Section B: Anamnese + Evolução Médica
  const secaoBAnamnese = auditData.secao_b_anamnese || {};
  const secaoBEvolucao = auditData.secao_b_evolucao || {};
  const confBA = auditData.conformity_b_anamnese || {};
  const confBE = auditData.conformity_b_evolucao || {};
  const bTotal = (confBA.total || 0) + (confBE.total || 0);
  const bValid = (confBA.valid || 0) + (confBE.valid || 0);
  secoes.push({
    id: "B",
    titulo: "Anamnese / Evolução Médica",
    conformes: bValid,
    total: bTotal,
    conformidade: bTotal > 0 ? Math.round((bValid / bTotal) * 1000) / 10 : 100,
    subgrupos: [
      {
        titulo: "Anamnese Médica",
        itens: [
          { item: "HDA", valor: secaoBAnamnese.hda || "N/A", status: isConforme(secaoBAnamnese.hda) },
          { item: "HD / CID", valor: secaoBAnamnese.hd_cid || "N/A", status: isConforme(secaoBAnamnese.hd_cid) },
          { item: "AP / APP", valor: secaoBAnamnese.ap_app || "N/A", status: isConforme(secaoBAnamnese.ap_app) },
          { item: "AF", valor: secaoBAnamnese.af || "N/A", status: isConforme(secaoBAnamnese.af) },
          { item: "Exame Físico", valor: secaoBAnamnese.exame_fisico || "N/A", status: isConforme(secaoBAnamnese.exame_fisico) },
          { item: "Conduta", valor: secaoBAnamnese.cd || "N/A", status: isConforme(secaoBAnamnese.cd) },
          { item: "Criação Anamnese", valor: secaoBAnamnese.criacao_anamnese || "N/A", status: isConforme(secaoBAnamnese.criacao_anamnese) },
        ],
      },
      {
        titulo: "Evolução Médica",
        itens: [
          { item: "HD / CID", valor: secaoBEvolucao.hd_cid || "N/A", status: isConforme(secaoBEvolucao.hd_cid) },
          { item: "Exame Físico", valor: secaoBEvolucao.exame_fisico || "N/A", status: isConforme(secaoBEvolucao.exame_fisico) },
          { item: "Procedimentos / Condutas / Queixas", valor: secaoBEvolucao.procedimentos_condutas_queixas || "N/A", status: isConforme(secaoBEvolucao.procedimentos_condutas_queixas) },
          { item: "Frequência Diária", valor: secaoBEvolucao.frequencia_diaria || "N/A", status: isConforme(secaoBEvolucao.frequencia_diaria) },
        ],
      },
    ],
  });

  // Section C: Bloco Cirúrgico
  const secaoC = auditData.secao_c || {};
  const confC = auditData.conformity_c || {};
  if (secaoC.tem_cirurgia) {
    secoes.push({
      id: "C",
      titulo: "Bloco Cirúrgico",
      conformes: confC.valid || 0,
      total: confC.total || 0,
      conformidade: confC.total > 0 ? Math.round((confC.valid / confC.total) * 1000) / 10 : 100,
      itens: [
        { item: "Especialidade", valor: secaoC.especialidade || "N/A", status: isConforme(secaoC.especialidade) },
        { item: "Unidade Funcional", valor: secaoC.unidade_funcional || "N/A", status: isConforme(secaoC.unidade_funcional) },
        { item: "Início Cirurgia", valor: secaoC.inicio || "N/A", status: isConforme(secaoC.inicio) },
        { item: "Fim Cirurgia", valor: secaoC.fim || "N/A", status: isConforme(secaoC.fim) },
        { item: "Diagnóstico / CID", valor: secaoC.diagnostico_cid || "N/A", status: isConforme(secaoC.diagnostico_cid) },
        { item: "Descrição Procedimento", valor: secaoC.descricao_procedimento || "N/A", status: isConforme(secaoC.descricao_procedimento) },
        { item: "Descrição Técnica", valor: secaoC.descricao_tecnica || "N/A", status: isConforme(secaoC.descricao_tecnica) },
        { item: "Uso OPME", valor: secaoC.uso_opme || "N/A", status: isConforme(secaoC.uso_opme) },
      ],
    });
  }

  // Section D: Enfermagem e Escalas
  const secaoDA = auditData.secao_d_anamnese || {};
  const secaoDE = auditData.secao_d_evolucao || {};
  const confDA = auditData.conformity_d_anamnese || {};
  const confDE = auditData.conformity_d_evolucao || {};
  const dTotal = (confDA.total || 0) + (confDE.total || 0);
  const dValid = (confDA.valid || 0) + (confDE.valid || 0);
  secoes.push({
    id: "D",
    titulo: "Enfermagem e Escalas",
    conformes: dValid,
    total: dTotal,
    conformidade: dTotal > 0 ? Math.round((dValid / dTotal) * 1000) / 10 : 100,
    subgrupos: [
      {
        titulo: "Anamnese Enfermagem",
        itens: [
          { item: "Motivo Internação", valor: secaoDA.motivo_internacao || "N/A", status: isConforme(secaoDA.motivo_internacao) },
          { item: "AP / APP", valor: secaoDA.ap_app || "N/A", status: isConforme(secaoDA.ap_app) },
          { item: "AF", valor: secaoDA.af || "N/A", status: isConforme(secaoDA.af) },
          { item: "Exame Físico", valor: secaoDA.exame_fisico || "N/A", status: isConforme(secaoDA.exame_fisico) },
          { item: "Escala Braden", valor: secaoDA.escala_braden || "N/A", status: isConforme(secaoDA.escala_braden) },
          { item: "Escala Morse", valor: secaoDA.escala_morse || "N/A", status: isConforme(secaoDA.escala_morse) },
          { item: "Conduta", valor: secaoDA.cd || "N/A", status: isConforme(secaoDA.cd) },
          { item: "Criação Anamnese", valor: secaoDA.criacao_anamnese || "N/A", status: isConforme(secaoDA.criacao_anamnese) },
          { item: "Curativo", valor: secaoDA.curativo || "N/A", status: isConforme(secaoDA.curativo) },
        ],
      },
      {
        titulo: "Evolução Enfermagem",
        itens: [
          { item: "Motivo Internação", valor: secaoDE.motivo_internacao || "N/A", status: isConforme(secaoDE.motivo_internacao) },
          { item: "Exame Físico", valor: secaoDE.exame_fisico || "N/A", status: isConforme(secaoDE.exame_fisico) },
          { item: "Condutas", valor: secaoDE.condutas || "N/A", status: isConforme(secaoDE.condutas) },
          { item: "Escala Braden", valor: secaoDE.escala_braden || "N/A", status: isConforme(secaoDE.escala_braden) },
          { item: "Escala Morse", valor: secaoDE.escala_morse || "N/A", status: isConforme(secaoDE.escala_morse) },
          { item: "Criação Evolução", valor: secaoDE.criacao_evolucao || "N/A", status: isConforme(secaoDE.criacao_evolucao) },
          { item: "Curativo", valor: secaoDE.curativo || "N/A", status: isConforme(secaoDE.curativo) },
        ],
      },
    ],
  });

  // Section E: Equipe Multiprofissional
  const secaoE = auditData.secao_e || {};
  const confE = auditData.conformity_e || {};
  if (secaoE.tem_outras_categorias) {
    secoes.push({
      id: "E",
      titulo: "Equipe Multiprofissional",
      conformes: confE.valid || 0,
      total: confE.total || 0,
      conformidade: confE.total > 0 ? Math.round((confE.valid / confE.total) * 1000) / 10 : 100,
      itens: [
        { item: "Categoria", valor: secaoE.categoria || "N/A", status: isConforme(secaoE.categoria) },
        { item: "Descrição", valor: secaoE.descricao || "N/A", status: isConforme(secaoE.descricao) },
      ],
    });
  }

  // Calculate overall conformity
  const confGlobal = auditData.conformity_global || {};
  const conformidadeGeral = confGlobal.total > 0
    ? Math.round((confGlobal.valid / confGlobal.total) * 1000) / 10
    : 100;

  // Build non-conformities list
  const naoConformidades = [];
  secoes.forEach((sec) => {
    const items = sec.subgrupos
      ? sec.subgrupos.flatMap((sub) =>
          sub.itens.map((it) => ({ ...it, subgrupoTitulo: sub.titulo }))
        )
      : sec.itens.map((it) => ({ ...it, subgrupoTitulo: null }));

    items.forEach((it) => {
      if (it.status === "nao_conforme") {
        naoConformidades.push({
          secao: sec.id,
          item: it.subgrupoTitulo ? `${it.subgrupoTitulo} — ${it.item}` : it.item,
          descricao: it.observacao || `Valor: ${it.valor}`,
        });
      }
    });
  });

  // Build quantitativo from matrix
  const matrizDoc = auditData.matriz_documentos || { datas: [], matriz: {} };
  const days = (matrizDoc.datas || []).map((d) => {
    const match = d.match(/(\d{2})\/(\d{2})/);
    return match ? `${match[1]}/${match[2]}` : d;
  });

  const quantitativo = buildQuantitativo(auditData, days);

  return {
    prontuario: recordId,
    conformidade_geral: conformidadeGeral,
    secoes,
    nao_conformidades: naoConformidades,
    quantitativo,
    days: days.length > 0 ? days : undefined,
  };
}

/**
 * Determine the conformity status of a field value.
 */
function isConforme(val) {
  if (!val || val === "N/A") return "nao_conforme";

  const v = String(val).toLowerCase().trim();
  if (v.startsWith("conforme")) return "conforme";
  if (v === "não se aplica" || v === "nao se aplica" || v === "n/a") return "nao_se_aplica";
  if (v === "não registrado" || v === "nao registrado") return "nao_conforme";

  // If it has an actual value (like a date or name), it's conforme
  if (v.length > 0 && v !== "false" && v !== "não" && v !== "nao") return "conforme";

  return "nao_conforme";
}

/**
 * Build quantitativo table rows from audit data and date columns.
 */
function buildQuantitativo(auditData, days) {
  const matrizDoc = auditData.matriz_documentos || { datas: [], matriz: {} };
  const matriz = matrizDoc.matriz || {};

  const buildRow = (tipo, matrizKey) => {
    const row = { tipo };
    let presentCount = 0;

    days.forEach((d) => {
      const fullDateKey = Object.keys(matrizDoc.datas || {}).find(
        (fd) => fd.includes(d)
      );
      const matrizEntries = matriz[matrizKey] || {};
      const found = Object.keys(matrizEntries).some((k) => k.includes(d));
      row[d] = found;
      if (found) presentCount++;
    });

    row.total = presentCount;
    row.conformidade = presentCount > 0 ? 100 : 0;
    return row;
  };

  return [
    buildRow("Anamnese Médica", "MEDICINA - Anamnese"),
    buildRow("Anamnese Enfermagem", "ENFERMAGEM - Anamnese"),
    buildRow("Evolução Médica", "MEDICINA - Evolução"),
    buildRow("Evolução Enfermagem", "ENFERMAGEM - Evolução"),
    buildRow("Serviço Social", "SERVIÇO SOCIAL - Evolução"),
  ];
}

/**
 * Transform multiple audit results into frontend format.
 * @param {Array} rawResults - Array of raw results from data_extract
 * @returns {Array} Array of frontend-compatible structures
 */
export function transformBatchResults(rawResults) {
  return rawResults.map(transformAuditResult);
}
