export const EXAMPLE_INPUT = `[
  {
    "Prontuário": "58.907.003",
    "Atendimento": "9.973.132",
    "Data De Nascimento pact": "18/7/1956",
    "Data da internação": "15/04/2024, 09:15",
    "Data de saída": "18/04/2024, 10:30",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "948.337.921",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "Colecistectomia videolaparoscópica",
    "Procedimento Interno Realizado": "Colecistectomia videolaparoscópica",
    "Cid procedimento": "K81.0",
    "Data Inicio Cirurgia": "16/04/2024, 11:20",
    "Data Fim Cirurgia": "16/04/2024, 12:45",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Sim",
    "Seguiu protoc Cirurgia Segura?": "Não",
    "Categoria Profissional": "MEDICINA",
    "Tipo do registro": "Anamnese",
    "criacao_anamnsese": "15/04/2024, 23:15",
    "Descricao do registro": "#MEDICAÇÕES EM USO: Ceftriaxona 1g IV 12/12h, Metronidazol 500mg IV 8/8h, Paracetamol 1g IV 6/6h, Omeprazol 40mg IV 24/24h, Ranitidina 50mg IV 8/8h #EVOLUÇÃO: PACIENTE EVOLUI COM REDUÇÃO DA DOR ABDOMINAL E FEBA, SEM VÔMITOS. MANTÉM APTIDÃO PARA ALIMENTAÇÃO ORAL. MANTÉM DIURESE ADEQUADA. APRESENTA LEVE DISTENSÃO ABDOMINAL, SEM SINAL DE PERITONITE. #EXAME FÍSICO: PIELI, PULSOS PERIFÉRICOS PRESENTES E SIMÉTRICOS, PRESSÃO ARTERIAL 120x80mmHg, FREQUÊNCIA CARDÍACA 88bpm, FREQUÊNCIA RESPIRATÓRIA 18ipm, SATURAÇÃO 98% EM O2 2L/MIN. ABDOMEN MACIO, DEPRESSÍVEL, SEM DEFESA OU CONTRATURA, RUIDOS HIDROAÉREOS PRESENTES. PELE E MUCOSAS HIDRATADAS. SNC: CONSCIENTE, ORIENTADA. #EXAMES COMPLEMENTARES: HEMOGRAMA: HEMOGLOBINA 12,1g/dL, LEUCÓCITOS 11.200/mm³, PLAQUETAS 240.000/mm³. HEPATOGRAMA: AST 48U/L, ALT 52U/L, BILIRRUBINA TOTAL 1,8mg/dL, ALP 145U/L. UROANÁLISE: NORMA. #CD: COLECISTITE AGUDA COM LITÍASE. PÓS-COLECISTECTOMIA VIDEOLAPAROSCÓPICA. EVOLUÇÃO FAVORÁVEL. CONTINUAR TRATAMENTO ANTIBIÓTICO E ANALGÉSICO. AVALIAÇÃO DE ENFERMAGEM E NUTRIÇÃO SOLICITADA. FISIOTERAPIA NÃO REGISTRADA. NÃO HÁ DESCRIÇÃO DE ESCALA BRADEN. AVALIAÇÃO DE SISTEMAS INCOMPLETA.",
    "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL 2. ASSEPSIA, ANTISSEPSIA E APOSIÇÃO DE CAMPOS CIRÚRGICOS ESTÉREIS 3. REALIZAÇÃO DE PNEUMOPERITÔNEO PELA TÉCNICA ABERTA ATRAVÉS DE INCISÃO TRANS UMBILICAL 4. APOSIÇÃO DE 2 TROCATERES DE 10MM E 2 TROCATERES DE 5MM 5. LAPAROSCOPIA DA CAVIDADE COM ACHADOS: VESÍCULA BILIAR INFLAMADA, PAREDES ESPESSADAS, LÍQUIDO SEROHAEMÁTICO NO ESPAÇO SUBHEPÁTICO, CÁLCULOS MÚLTIPLOS NO LÚMEN 6. RETIRADA DE VESÍCULA BILIAR DO LEITO HEPÁTICO COM ELETROCAUTERIZAÇÃO 7. SÍNTESE DA PELE COM NYLON 3-0 8. CURATIVO OCLUSIVO"
  },
  {
    "Prontuário": "58.907.003",
    "Atendimento": "9.973.132",
    "Data De Nascimento pact": "18/7/1956",
    "Data da internação": "15/04/2024, 09:15",
    "Data de saída": "18/04/2024, 10:30",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "948.337.921",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "Colecistectomia videolaparoscópica",
    "Procedimento Interno Realizado": "Colecistectomia videolaparoscópica",
    "Cid procedimento": "K81.0",
    "Data Inicio Cirurgia": "16/04/2024, 11:20",
    "Data Fim Cirurgia": "16/04/2024, 12:45",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Sim",
    "Seguiu protoc Cirurgia Segura?": "Não",
    "Categoria Profissional": "MEDICINA",
    "Tipo do registro": "Evolução",
    "criacao_anamnsese": "",
    "Descricao do registro": "#HD: COLELITIASE COM COLECISTITE AGUDA, DIAGNOSTICADA NO 1º DIA DE INTERNAMENTO\\n#MEDICAÇÕES EM USO: PARECETAMOL 1G 8/8H IV, CEFTRIAXONA 2G 24H IV, METRONIDAZOL 500MG 8/8H IV, ENOXAPARINA 40MG SC 24H, OMEPRAZOL 40MG 24H IV\\n#EVOLUÇÃO: PACIENTE EVOLUI COM MELHORA DA DOR ABDOMINAL, SEM FEBRE, COM ALÍVIO DA DISTENSÃO ABDOMINAL. APRESENTA BOM TONO E MUSCULAR, ADEQUADA DIURESE E RETORNO DE PERISTALTISMO. NÃO HÁ NAUSEA OU VÔMITOS. ALIMENTAÇÃO ORAL INICIADA COM DIETA LÍQUIDA CLARA, TOLERADA SEM INTERCORRÊNCIAS.\\n#EXAME FÍSICO: AFEBRIL, ADEQUADAMENTE HIDRATADA, ORIENTADA, COM ABDOME MACIO, DEPRESSÍVEL, SEM DOR À PALPAÇÃO, SEM SINAL DE IRITAÇÃO PERITONEAL. MUCOSAS UMIDAS, PELE E MUCOSAS SEM ICTERÍCIA.\\n#EXAMES COMPLEMENTARES: LABORATORIAL DE HOJE: LEUCOCITOSE 11.200 (NORMALIZANDO), AST 42 U/L, ALT 38 U/L, BILIRRUBINA TOTAL 1,1 MG/DL. ULTRASSOM DE ACOMPANHAMENTO: VESÍCULA BILIAR COM PAREDES ESPESSADAS, SEM COLEÇÃO, LÍQUIDOS LIVRES NEGATIVOS.",
    "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL\\n2. ASSEPSIA, ANTISSEPSIA E APOSIÇÃO DE CAMPOS CIRÚRGICOS ESTÉREIS\\n3. REALIZAÇÃO DE PNEUMOPERITÔNEO PELA TÉCNICA ABERTA ATRAVÉS DE INCISÃO TRANS UMBILICAL\\n4. APOSIÇÃO DE 2 TROCATERES DE 10MM E 2 TROCATERES DE 5MM\\n5. LAPAROSCOPIA DA CAVIDADE COM ACHADOS: - VESÍCULA BILIAR DE PAREDES ESPESSADAS, COM CÁLCULOS MÚLTIPLOS EM SEU INTERIOR E ADERÊNCIAS LEVES AO FÍGADO\\n6. RETIRADA DE VESÍCULA BILIAR DO LEITO HEPÁTICO COM ELETROCAUTERIZAÇÃO DO DUCTO CÍSTICO E ARTERÍA CÍSTICA\\n7. SÍNTESE DA PELE COM NYLON 3-0\\n8. CURATIVO OCLUSIVO"
  },
  {
    "Prontuário": "58.907.003",
    "Atendimento": "9.973.132",
    "Data De Nascimento pact": "18/7/1956",
    "Data da internação": "15/04/2024, 09:15",
    "Data de saída": "18/04/2024, 10:30",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "948.337.921",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "Colecistectomia videolaparoscópica",
    "Procedimento Interno Realizado": "Colecistectomia videolaparoscópica",
    "Cid procedimento": "K81.0",
    "Data Inicio Cirurgia": "16/04/2024, 11:20",
    "Data Fim Cirurgia": "16/04/2024, 12:45",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Sim",
    "Seguiu protoc Cirurgia Segura?": "Não",
    "Categoria Profissional": "ENFERMAGEM",
    "Tipo do registro": "Anamnese",
    "criacao_anamnsese": "15/04/2024, 09:15",
    "Descricao do registro": "1.MOTIVO INTERNAMENTO: PACIENTE FEMININA, 67 ANOS, TRAZIDA POR FAMILIARES COM DOR ABDOMINAL EM HIPOCONDRIO DIREITO, IRRADIADA PARA OMBRO DIREITO, ASSOCIADA A NAÚSEAS E VÔMITOS HÁ 24H. DIAGNÓSTICO CLÍNICO SUSPEITO: COLELITÍASE COM COLECISTITE AGUDA. 2.ALERGIAS/COMORBIDADES: ALERGIA A PENICILINA (ERUPÇÃO CUTÂNEA). HAS, DIABETES MELLITUS TIPO 2, OBESIDADE GRAU I. 3.PULSEIRA: SIM, CORRETAMENTE PREENCHIDA COM NOME, DATA DE NASCIMENTO, PRONTUÁRIO E ALERGIA. 4.QUEIXAS: DOR ABDOMINAL INTENSA (EVA 8/10), NAÚSEAS, DISTENSÃO ABDOMINAL. 5.ESTADO GERAL: COMPROMETIDO, PALLIDO, DESIDRATADA. 6.SNC: ALERTA, ORIENTADA NO TEMPO E ESPAÇO. 7.PELE/MUCOSAS/RESP: PELE SECA, MUCOSAS SECAS, FREQUÊNCIA RESPIRATÓRIA 20 IRPM, SATURAÇÃO 97% EM AR AMBIENTE. 8.CARDIOVASCULAR: FC 92 BPM, PA 138/82 MMHG, RITMO REGULAR, SEM MURMÚRIOS. 9.GI: ABDOMEN DOLOROSO À PALPAÇÃO EM HCD, SEM DEFESA, SEM REBOTE, BORBORIGMOS REDUZIDOS. 10.INTESTINAL: SEM EVACUAÇÃO NEM FLATULÊNCIA DESDE A ADMISSÃO. 11.GENITOURINÁRIO: DIURESE ADEQUADA, SEM DISÚRIA. 12.MÚSCULO-ESQUELÉTICO: FORÇA MUSCULAR PRESERVADA NOS MEMBROS SUPERIORES E INFERIORES. 13.DRENOS: NENHUM. 14.ESCALAS(EVA/Braden/Morse/FUGULIN): EVA 8, BRADEN 18, MORSÉ 55, FUGULIN 0. 15.EXAMES/PROCEDIMENTOS: ULTRASSOM ABDOMINAL CONFIRMOU COLECISTITE AGUDA COM LITÍASE. 16.CONDUTAS: INICIO DE ANTIBIÓTICO PROFILÁTICO (CEFTRIAXONA), HIDRATAÇÃO VENOSA, ANALGESIA COM PARACETAMOL E NENHUMA ALIMENTAÇÃO ORAL.",
    "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL. 2. ASSEPSIA, ANTISSEPSIA E APOSIÇÃO DE CAMPOS CIRÚRGICOS ESTÉREIS. 3. REALIZAÇÃO DE PNEUMOPERITÔNEO PELA TÉCNICA ABERTA ATRAVÉS DE INCISÃO TRANS UMBILICAL. 4. APOSIÇÃO DE 2 TROCATERES DE 10MM E 2 TROCATERES DE 5MM. 5. LAPAROSCOPIA DA CAVIDADE COM ACHADOS: VESÍCULA BILIAR ENGROSSADA, COM PAREDES HIPEREMICAS E CÁLCULOS MÚLTIPLOS EM SEU INTERIOR. 6. RETIRADA DA VESÍCULA BILIAR DO LEITO HEPÁTICO COM ELETROCAUTERIZAÇÃO CONTÍNUA E CLIPAGEM DOS DUTOS CISTICO E COMUM. 7. IRRIGAÇÃO DO LEITO COM SOLUÇÃO SALINA ESTÉRIL. 8. SÍNTESE DA PELE COM NYLON 3-0. 9. CURATIVO OCLUSIVO COM GAZE E FITA ADESIVA."
  },
  {
    "Prontuário": "58.907.003",
    "Atendimento": "9.973.132",
    "Data De Nascimento pact": "18/7/1956",
    "Data da internação": "15/04/2024, 09:15",
    "Data de saída": "18/04/2024, 10:30",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "948.337.921",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "Colecistectomia videolaparoscópica",
    "Procedimento Interno Realizado": "Colecistectomia videolaparoscópica",
    "Cid procedimento": "K81.0",
    "Data Inicio Cirurgia": "16/04/2024, 11:20",
    "Data Fim Cirurgia": "16/04/2024, 12:45",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Sim",
    "Seguiu protoc Cirurgia Segura?": "Não",
    "Categoria Profissional": "ENFERMAGEM",
    "Tipo do registro": "Evolução",
    "criacao_anamnsese": "",
    "Descricao do registro": "#HD: COLELITÍASE COM COLESTITIS AGUDA\\n#MEDICAÇÕES EM USO: PARACETAMOL 1g 8/8h, CEFTRIAXONA 2g 24/24h, METRONIDAZOL 500mg 8/8h, ENOXAPARINA 40mg SC 24/24h\\n#EVOLUÇÃO: PACIENTE EM MELHORA CLÍNICA, DOR ABDOMINAL REDUZIDA, AFEBRIL, ADEQUADA EVACUAÇÃO INTESTINAL. NÁUSEAS RESIDUAIS CONTROLADAS COM ONDANSETRONA. DIURESE ADEQUADA. MANTÉM OXIGÊNIO SUPLEMENTAR A 2L/MIN\\n#EXAME FÍSICO: ABDÔMEN MACIO, DOLOROSO EM HCD, SEM DEFESA OU CONTRATURA. BORBORIGMOS PRESENTES. PELE E MUCOSAS HIDRATADAS\\n#EXAMES COMPLEMENTARES: HEMOGRAMA: HEMATÓCRITO 34%, LEUCÓCITOS 11.200 (N 82%). LIPASE E AMILASE NORMAIS. ULTRASSOM: VESÍCULA BILIAR DISTENDIDA, PAREDES ESPESSADAS, CÁLCULOS MÚLTIPLOS",
    "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL\\n2. ASSEPSIA, ANTISSEPSIA E APOSIÇÃO DE CAMPOS CIRÚRGICOS ESTÉREIS\\n3. REALIZAÇÃO DE PNEUMOPERITÔNEO PELA TÉCNICA ABERTA ATRAVÉS DE INCISÃO TRANS UMBILICAL\\n4. APOSIÇÃO DE 2 TROCATERES DE 10MM E 2 TROCATERES DE 5MM\\n5. LAPAROSCOPIA DA CAVIDADE COM ACHADOS: - VESÍCULA BILIAR DE PAREDES ESPESSADAS E HIPEREMICAS COM CÁLCULOS MÚLTIPLOS EM SEU INTERIOR\\n6. RETIRADA DE VESÍCULA BILIAR DO LEITO HEPÁTICO COM ELETROCAUTERIZAÇÃO\\n7. SÍNTESE DA PELE COM NYLON 3-0\\n8. CURATIVO OCLUSIVO"
  },
  {
    "Prontuário": "58.907.003",
    "Atendimento": "9.973.132",
    "Data De Nascimento pact": "18/7/1956",
    "Data da internação": "15/04/2024, 09:15",
    "Data de saída": "18/04/2024, 10:30",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "948.337.921",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "Colecistectomia videolaparoscópica",
    "Procedimento Interno Realizado": "Colecistectomia videolaparoscópica",
    "Cid procedimento": "K81.0",
    "Data Inicio Cirurgia": "16/04/2024, 11:20",
    "Data Fim Cirurgia": "16/04/2024, 12:45",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Sim",
    "Seguiu protoc Cirurgia Segura?": "Não",
    "Categoria Profissional": "ENFERMAGEM",
    "Tipo do registro": "Evolução",
    "criacao_anamnsese": "",
    "Descricao do registro": "1.MOTIVO INTERNAMENTO: DOR ABDOMINAL EM HCD, IRRADIAÇÃO PARA OMBRO DIREITO, NAUSEAS E VOMITOS HÁ 48H. 2.ALERGIAS/COMORBIDADES: HIPERTENSÃO ARTERIAL, DIABETES MELLITUS TIPO 2. 3.PULSEIRA: CONFIRMADA. 4.QUEIXAS: DOR ABDOMINAL CONTÍNUA, GRAU 6/10 NA EVA. 5.ESTADO GERAL: CONSCIENTE, ORIENTADA, HIDRATADA. 6.SNC: ORIENTADA NO TEMPO E ESPAÇO. 7.PELE/MUCOSAS/RESP: PELE ÚMIDA, MUCOSAS HIDRATADAS, RESPIRAÇÃO RÍTMICA, SEM DISPNEIA. 8.CARDIOVASCULAR: FC 82bpm, PA 132/80mmHg, RITMO SINUSAL. 9.GI: ABDOME DOLOROSO À PALPAÇÃO EM HCD, SEM DEFESA, MURPHY POSITIVO. 10.INTESTINAL: SONS PERISTÁLTICOS PRESENTES, ESTENOSIS DE GÁS. 11.GENITOURINÁRIO: DIURESE ADEQUADA, 1,2L/24H. 12.MÚSCULO-ESQUELÉTICO: FORÇA MUSCULAR PRESERVADA, MOBILIDADE ATIVA. 13.DRENOS: NENHUM. 14.ESCALAS(EVA/Braden/Morse/FUGULIN): EVA 6/10, BRADEN 20, MORSE 25, FUGULIN 0. 15.EXAMES/PROCEDIMENTOS: ULTRASSOM ABDOMINAL CONFIRMADO COLELITÍASE, LABORATORIAL: LEUCOCITOSE 12.000, TGO 89, TGP 95. 16.CONDUTAS: CONTINUAÇÃO DE ANTIBIÓTICOS, ANALGÉSICO IV, ACOMPANHAMENTO MÉDICO PARA CIRURGIA ELETIVA.",
    "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL 2. ASSEPSIA, ANTISSEPSIA E APOSIÇÃO DE CAMPOS CIRÚRGICOS ESTÉREIS 3. REALIZAÇÃO DE PNEUMOPERITÔNEO PELA TÉCNICA ABERTA ATRAVÉS DE INCISÃO TRANS UMBILICAL; 4. APOSIÇÃO DE 2 TROCATERES DE 10MM E 2 TROCATERES DE 5MM 5. LAPAROSCOPIA DA CAVIDADE COM ACHADOS: - VESÍCULA BILIAR ENGROSSADA, COM CÁLCULOS MÚLTIPLOS EM SEU INTERIOR E ADERÊNCIAS LEVES AO FÍGADO 6. RETIRADA DE VESÍCULA BILIAR DO LEITO HEPÁTICO COM ELETROCAUTERIZAÇÃO E CLIPAGEM DOS CANAIS CISTICO E BILIAR COMUM 7. SÍNTESE DA PELE COM NYLON 3-0. 8. CURATIVO OCLUSIVO"
  },
  {
    "Prontuário": "58.907.003",
    "Atendimento": "9.973.132",
    "Data De Nascimento pact": "18/7/1956",
    "Data da internação": "15/04/2024, 09:15",
    "Data de saída": "18/04/2024, 10:30",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "948.337.921",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "Colecistectomia videolaparoscópica",
    "Procedimento Interno Realizado": "Colecistectomia videolaparoscópica",
    "Cid procedimento": "K81.0",
    "Data Inicio Cirurgia": "16/04/2024, 11:20",
    "Data Fim Cirurgia": "16/04/2024, 12:45",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Sim",
    "Seguiu protoc Cirurgia Segura?": "Não",
    "Categoria Profissional": "FISIOTERAPIA",
    "Tipo do registro": "Evolução",
    "criacao_anamnsese": "",
    "Descricao do registro": "EVOLUÇÃO DE FISIOTERAPIA - DIA 2 PÓS-OPERATÓRIO. PACIENTE EM DECÚBITO DORSAL, CONSCIENTE, ORIENTADA. REALIZADA MOBILIZAÇÃO NO LEITO COM INCENTIVO À RESPIRAÇÃO PROFUNDA E TOSSE EFICAZ. UTILIZAÇÃO DE INHAÇÃO COM NEBULIZADOR E VENTILAÇÃO COM BOLSA DE RESPIRAÇÃO. AVALIAÇÃO DE FORÇA MUSCULAR: MEMBROS SUPERIORES 5/5, INFERIORES 4/5. SEM SINAIS DE DOR OU DISPNEIA. INCENTIVO À DEAMBULAÇÃO COM AJUDA LEVE. NÃO HOUVE SINAIS DE DOR ABDOMINAL OU TENSÃO MUSCULAR. CURATIVO DE INCISÃO INTEGRADO, SEM EXSUDATO. CONTINUAÇÃO DAS ATIVIDADES HOJE.",
    "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL\\n2. ASSEPSIA, ANTISSEPSIA E APOSIÇÃO DE CAMPOS CIRÚRGICOS ESTÉREIS\\n3. REALIZAÇÃO DE PNEUMOPERITÔNEO PELA TÉCNICA ABERTA ATRAVÉS DE INCISÃO TRANS UMBILICAL\\n4. APOSIÇÃO DE 2 TROCATERES DE 10MM E 2 TROCATERES DE 5MM\\n5. LAPAROSCOPIA DA CAVIDADE COM ACHADOS: - VESÍCULA BILIAR HIPERTROFIADA, PAREDES ENGROSSADAS, CONTENDO MÚLTIPLOS CÁLCULOS\\n6. RETIRADA DE VESÍCULA BILIAR DO LEITO HEPÁTICO COM ELETROCAUTERIZAÇÃO E CLIPAGEM DOS DUTOS\\n7. LAVAGEM ABUNDANTE DA CAVIDADE COM SOLUÇÃO SALINA ESTÉRIL\\n8. SÍNTESE DA PELE COM NYLON 3-0\\n9. CURATIVO OCLUSIVO COM GASEE E FITA ADESIVA"
  },
  {
    "Prontuário": "58.907.003",
    "Atendimento": "9.973.132",
    "Data De Nascimento pact": "18/7/1956",
    "Data da internação": "15/04/2024, 09:15",
    "Data de saída": "18/04/2024, 10:30",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "948.337.921",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "Colecistectomia videolaparoscópica",
    "Procedimento Interno Realizado": "Colecistectomia videolaparoscópica",
    "Cid procedimento": "K81.0",
    "Data Inicio Cirurgia": "16/04/2024, 11:20",
    "Data Fim Cirurgia": "16/04/2024, 12:45",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Sim",
    "Seguiu protoc Cirurgia Segura?": "Não",
    "Categoria Profissional": "FISIOTERAPIA",
    "Tipo do registro": "Evolução",
    "criacao_anamnsese": "",
    "Descricao do registro": "Sessão de fisioterapia no 3º dia pós-operatório. Paciente orientada sobre respiração diafragmática e tosse protegida. Realizada mobilização ativa em leito e sentado com suporte. Ausência de dispneia ou dor intensa durante exercícios. Encorajada a deambular com apoio no próximo período. Não apresentou sinais de complicações respiratórias ou hemodinâmicas. Encaminhada para continuidade da terapia no dia seguinte.",
    "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL\\n2. ASSEPSIA, ANTISSEPSIA E APOSIÇÃO DE CAMPOS CIRÚRGICOS ESTÉREIS\\n3. REALIZAÇÃO DE PNEUMOPERITÔNEO PELA TÉCNICA ABERTA ATRAVÉS DE INCISÃO TRANS UMBILICAL\\n4. APOSIÇÃO DE 2 TROCATERES DE 10MM E 2 TROCATERES DE 5MM\\n5. LAPAROSCOPIA DA CAVIDADE COM ACHADOS: - VESÍCULA BILIAR HIPERTROFIADA, PAREDES ESPESSADAS, CONTENDO MÚLTIPLOS CÁLCULOS\\n6. RETIRADA DA VESÍCULA BILIAR DO LEITO HEPÁTICO COM ELETROCAUTERIZAÇÃO DO DUCTO CÍSTICO E ARTÉRIA CÍSTICA\\n7. INSPEÇÃO DA CAVIDADE ABDOMINAL SEM SINAL DE LESÕES OU SANGRAMENTO ATIVO\\n8. SÍNTESE DA PELE COM NYLON 3-0\\n9. CURATIVO OCLUSIVO COM TECIDO ADERENTE"
  },
  {
    "Prontuário": "58.907.003",
    "Atendimento": "9.973.132",
    "Data De Nascimento pact": "18/7/1956",
    "Data da internação": "15/04/2024, 09:15",
    "Data de saída": "18/04/2024, 10:30",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "948.337.921",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "Colecistectomia videolaparoscópica",
    "Procedimento Interno Realizado": "Colecistectomia videolaparoscópica",
    "Cid procedimento": "K81.0",
    "Data Inicio Cirurgia": "16/04/2024, 11:20",
    "Data Fim Cirurgia": "16/04/2024, 12:45",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Sim",
    "Seguiu protoc Cirurgia Segura?": "Não",
    "Categoria Profissional": "NUTRIÇÃO",
    "Tipo do registro": "Evolução",
    "criacao_anamnsese": "",
    "Descricao do registro": "#HD: COLELITIASE COM COLELISTITE AGUDA #MEDICAÇÕES EM USO: PARECETAMOL 1G 8/8H, OMEPRAZOL 20MG 1X/DIA, ENOXAPARINA 40MG SC 24H #EVOLUÇÃO: PACIENTE COM BOA TOLERÂNCIA ORAL, INÍCIO DE DIETA LÍQUIDA CLARA EM 24H PÓS-CIRURGIA. NÃO HÁ NÁUSEAS OU VÔMITOS. AVALIAÇÃO NUTRICIONAL: IMC 28,4 (SOBREPESO). RISCO NUTRICIONAL BAIXO. RECOMENDA-SE TRANSIÇÃO PARA DIETA LÍQUIDA TOTAL E, POSTERIORMENTE, DIETA MACIA COM RESTRIÇÃO DE GORDURAS. ACOMPANHAMENTO DIÁRIO. #EXAME FÍSICO: ABDOME MACIO, DESINFLAMADO, DOR A LEVE PRESSÃO EM HCD. #EXAMES COMPLEMENTARES: HEMOGLOBINA 12,1 G/DL, PROTEÍNA C REATIVA 1,8 MG/DL",
    "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL 2. ASSEPSIA, ANTISSEPSIA E APOSIÇÃO DE CAMPOS CIRÚRGICOS ESTÉREIS 3. REALIZAÇÃO DE PNEUMOPERITÔNEO PELA TÉCNICA ABERTA ATRAVÉS DE INCISÃO TRANS UMBILICAL; 4. APOSIÇÃO DE 2 TROCATERES DE 10MM E 2 TROCATERES DE 5MM 5. LAPAROSCOPIA DA CAVIDADE COM ACHADOS: - VESÍCULA BILIAR ENGROSSADA, COM PAREDES HIPEREMICAS E CÁLCULOS MULTIPLOS EM SEU INTERIOR 6. RETIRADA DE VESÍCULA BILIAR DO LEITO HEPÁTICO COM ELETROCAUTERIZAÇÃO 7. SÍNTESE DA PELE COM NYLON 3-0. 8. CURATIVO OCLUSIVO"
  },
  {
    "Prontuário": "58.907.003",
    "Atendimento": "9.973.132",
    "Data De Nascimento pact": "18/7/1956",
    "Data da internação": "15/04/2024, 09:15",
    "Data de saída": "18/04/2024, 10:30",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "948.337.921",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "Colecistectomia videolaparoscópica",
    "Procedimento Interno Realizado": "Colecistectomia videolaparoscópica",
    "Cid procedimento": "K81.0",
    "Data Inicio Cirurgia": "16/04/2024, 11:20",
    "Data Fim Cirurgia": "16/04/2024, 12:45",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Sim",
    "Seguiu protoc Cirurgia Segura?": "Não",
    "Categoria Profissional": "NUTRIÇÃO",
    "Tipo do registro": "Evolução",
    "criacao_anamnsese": "",
    "Descricao do registro": "#HD: COLELITÍASE COM COLESCISTITE AGUDA\\n#MEDICAÇÕES EM USO: OMEPRAZOL 20MG 1X/DIA, METOCLOPRAMIDA 10MG 8/8H, PARACETAMOL 1G 8/8H\\n#EVOLUÇÃO: PACIENTE COM MELHORA PROGRESSIVA DA DOR ABDOMINAL, SEM NAÚSEAS OU VÔMITOS. INICIADA DIETA LÍQUIDA CLARA NO DIA 15/04, PASSANDO A DIETA LÍQUIDA TOTAL NO DIA 16/04. HOJE, DIA 18/04, INICIADA DIETA MACIA BAIXA EM GORDURAS. NÃO HÁ QUEIXAS DE DISTENSÃO ABDOMINAL OU INTOLERÂNCIA. PESO: 62KG (ESTÁVEL). NÍVEL DE ALBUMINA: 3,8G/DL. ENCERRAMENTO DO ACOMPANHAMENTO NUTRICIONAL COM ORIENTAÇÕES PARA CONTINUAÇÃO DA DIETA BAIXA EM GORDURAS E SUPLEMENTAÇÃO COM VITAMINA D3 E CÁLCIO.\\n#EXAMES COMPLEMENTARES: ALBUMINA 3,8G/DL; PREALBUMINA 18MG/DL; HEMOGLOBINA 12,1G/DL",
    "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL\\n2. ASSEPSIA, ANTISSEPSIA E APOSIÇÃO DE CAMPOS CIRÚRGICOS ESTÉREIS\\n3. REALIZAÇÃO DE PNEUMOPERITÔNEO PELA TÉCNICA ABERTA ATRAVÉS DE INCISÃO TRANS UMBILICAL\\n4. APOSIÇÃO DE 2 TROCATERES DE 10MM E 2 TROCATERES DE 5MM\\n5. LAPAROSCOPIA DA CAVIDADE COM ACHADOS: - VESÍCULA BILIAR ENGROSSADA, COM ADERÊNCIAS LEVES AO LEITO HEPÁTICO E CÁLCULOS MÚLTIPLOS EM SEU INTERIOR\\n6. RETIRADA DE VESÍCULA BILIAR DO LEITO HEPÁTICO COM ELETROCAUTERIZAÇÃO\\n7. SÍNTESE DA PELE COM NYLON 3-0\\n8. CURATIVO OCLUSIVO"
  }
]`

export const EXAMPLE_OUTPUT = {
  prontuario: "58.907.003",
  conformidade_geral: 90.7,
  secoes: [
    {
      id: "A",
      titulo: "Identificação do Atendimento",
      conformidade: 100,
      total: 9,
      conformes: 9,
      itens: [
        {
          item: "Prontuário",
          valor: "58.907.003",
          status: "conforme"
        },
        {
          item: "Data de nascimento",
          valor: "18/07/1956",
          status: "conforme"
        },
        {
          item: "Idade",
          valor: "69 anos",
          status: "conforme"
        },
        {
          item: "Período da internação",
          valor: "15/04/2024, 09:15 → 18/04/2024, 10:30 (3 dias e 1 hora)",
          status: "conforme"
        },
        {
          item: "Diagnóstico/CID",
          valor: "COLELITIASE COM COLECISTITE AGUDA | K81.0",
          status: "conforme"
        },
        {
          item: "Especialidade cirúrgica",
          valor: "CIRURGIA GERAL",
          status: "conforme"
        },
        {
          item: "Unidade funcional da internação",
          valor: "8º NORTE",
          status: "conforme"
        },
        {
          item: "Unidade funcional cirúrgica",
          valor: "BLOCO CIRÚRGICO",
          status: "conforme"
        }
      ]
    },
    {
      id: "B",
      titulo: "Anamneses e Evoluções Médicas",
      conformidade: 91.6,
      total: 12,
      conformes: 11,
      subgrupos: [
        {
          titulo: "Anamnese Médica",
          data: "15/04/2024, 23:15",
          itens: [
            {
              item: "HDA",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Campo ausente na descrição (#HDA)"
            },
            {
              item: "HD/CID",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Campo ausente na descrição (#HDA)"
            },
            {
              item: "AP/APP",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Campo ausente na descrição"
            },
            {
              item: "AF",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Campo ausente na descrição (#AF)"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Conduta terapêutica",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Tempo da anamnese",
              valor: "15/04/2024, 09:15 → 15/04/2024 23:15",
              status: "nao_conforme",
              observacao: "Anamnese foi criada 14h após a admissão."
            }
          ]
        },
        {
          titulo: "Evolução Médica 1",
          data: "16/04/2024",
          itens: [
            {
              item: "Evolução diária",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas",
              valor: "",
              status: "nao_conforme",
              observacao: "Campo ausente na descrição"
            },
            {
              item: "Queixas/intercorrências",
              valor: "Dor abdominal, distensão e evolução clínica descritas",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Evolução Médica 2",
          data: "17/04/2024",
          itens: [
            {
              item: "Evolução diária",
              valor: "Ausente",
              status: "nao_conforme",
              observacao: "Registro ausente"
            },
            {
              item: "Exame físico",
              valor: "Ausente",
              status: "nao_conforme",
              observacao: "Registro ausente"
            },
            {
              item: "Condutas",
              valor: "",
              status: "nao_conforme",
              observacao: "Registro ausentes"
            },
            {
              item: "Queixas/intercorrências",
              valor: "Ausente",
              status: "nao_conforme",
              observacao: "Registro ausentes"
            }
          ]
        },
        {
          titulo: "Evolução Médica 3",
          data: "18/04/2024",
          itens: [
            {
              item: "Evolução diária",
              valor: "Ausente",
              status: "nao_conforme",
              observacao: "Registro ausente"
            },
            {
              item: "Exame físico",
              valor: "Ausente",
              status: "nao_conforme",
              observacao: "Registro ausente"
            },
            {
              item: "Condutas",
              valor: "",
              status: "nao_conforme",
              observacao: "Registro ausentes"
            },
            {
              item: "Queixas/intercorrências",
              valor: "Ausente",
              status: "nao_conforme",
              observacao: "Registro ausentes"
            }
          ]
        }
      ]
    },
    {
      id: "C",
      titulo: "Cirurgia",
      conformidade: 100,
      total: 8,
      conformes: 8,
      itens: [
        {
          item: "Especialidade",
          valor: "Cirurgia Geral",
          status: "conforme"
        },
        {
          item: "Unidade funcional",
          valor: "Bloco Cirúrgico",
          status: "conforme"
        },
        {
          item: "Data",
          valor: "16/04/2024",
          status: "conforme"
        },
        {
          item: "Horário início",
          valor: "11:20",
          status: "conforme"
        },
        {
          item: "Horário fim",
          valor: "12:45",
          status: "conforme"
        },
        {
          item: "CID",
          valor: "K81.0",
          status: "conforme"
        },
        {
          item: "Procedimento",
          valor: "K81.0",
          status: "conforme"
        },
        {
          item: "Técnica operatória",
          valor: "Presente",
          status: "conforme"
        },
        {
          item: "OPME",
          valor: "",
          status: "nao_aplicavel"
        }
      ]
    },
    {
      id: "D",
      titulo: "Anamnese e Evoluções de Enfermagem",
      conformidade: 93.75,
      total: 14,
      conformes: 13,
      subgrupos: [
        {
          titulo: "Anamnese Enfermagem",
          data: "15/04/2024, 23:15",
          itens: [
            {
              item: "Motivo da internação",
              valor: "COLELITÍASE COM COLECISTITE AGUDA",
              status: "conforme"
            },
            {
              item: "AP/APP",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "AF",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Antecedentes familiares ausentes"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Escala de Braden",
              valor: "BRADEN 18",
              status: "conforme"
            },
            {
              item: "Escala de Morse",
              valor: "MORSE 55",
              status: "conforme"
            },
            {
              item: "Condutas",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Horário",
              valor: "Dentro do prazo",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Evolução Enfermagem 1",
          data: "16/04/2024",
          itens: [
            {
              item: "Evolução diária",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "HD/CID",
              valor: "COLELITÍASE COM COLESTITIS AGUDA | K81.0",
              status: "conforme"
            },
            {
              item: "Exame físico",
              valor: "Presente e detalhado",
              status: "conforme"
            },
            {
              item: "Condutas",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Condutas ausente"
            },
            {
              item: "Escalas",
              valor: "Presentes",
              status: "nao_conforme",
              observacao: "Escala de Braden ausente"
            },
            {
              item: "Curativos",
              valor: "",
              status: "nao_aplicavel"
            },
            {
              item: "Horários",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Data e hora da evolução ausente"
            }
          ]
        },
        {
          titulo: "Evolução Enfermagem 2",
          data: "17/04/2024",
          itens: [
            {
              item: "Evolução diária",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "HD/CID",
              valor: "COLELITÍASE COM COLESTITIS AGUDA | K81.0",
              status: "conforme"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Escalas",
              valor: "BRADEN 20",
              status: "conforme"
            },
            {
              item: "Curativos",
              valor: "",
              status: "nao_aplicavel"
            },
            {
              item: "Horários",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Data e hora da evolução ausente"
            }
          ]
        },
        {
          titulo: "Evolução Enfermagem 3",
          data: "18/04/2024",
          itens: [
            {
              item: "Evolução diária",
              valor: "Ausente",
              status: "nao_conforme",
              observacao: "Registro ausente"
            },
            {
              item: "HD/CID",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Registro ausente"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Registro ausente"
            },
            {
              item: "Condutas",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Registro ausente"
            },
            {
              item: "Escalas",
              valor: "Presentes",
              status: "nao_conforme",
              observacao: "Registro ausente"
            },
            {
              item: "Curativos",
              valor: "",
              status: "nao_aplicavel"
            },
            {
              item: "Horários",
              valor: "Presente",
              status: "nao_conforme",
              observacao: "Registro ausente"
            }
          ]
        }
      ]
    },
    {
      id: "E",
      titulo: "Outras Categorias Profissionais",
      conformidade: 100,
      total: 1,
      conformes: 1,
      subgrupos: [
        {
          titulo: "Fisioterapia",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas registradas",
              valor: "Presente",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Nutrição",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas registradas",
              valor: "Presente",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Terapia Ocupacional (TO)",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "",
              status: "nao_se_aplica"
            },
            {
              item: "Condutas registradas",
              valor: "",
              status: "nao_se_aplica"
            }
          ]
        },
        {
          titulo: "Psicologia",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "",
              status: "nao_se_aplica"
            },
            {
              item: "Condutas registradas",
              valor: "",
              status: "nao_se_aplica"
            }
          ]
        },
        {
          titulo: "Fonoaudiologia",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "",
              status: "nao_se_aplica"
            },
            {
              item: "Condutas registradas",
              valor: "",
              status: "nao_se_aplica"
            }
          ]
        },
        {
          titulo: "Serviço Social",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "",
              status: "nao_se_aplica"
            },
            {
              item: "Condutas registradas",
              valor: "",
              status: "nao_se_aplica"
            }
          ]
        },
        {
          titulo: "Farmácia Clínica",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "",
              status: "nao_se_aplica"
            },
            {
              item: "Condutas registradas",
              valor: "",
              status: "nao_se_aplica"
            }
          ]
        }
      ]
    }
  ],
  quantitativo: [
    {
      tipo: "Anamnese Médica",
      "19/11": true,
      "20/11": false,
      "21/11": false,
      total: 1,
      conformidade: 100
    },
    {
      tipo: "Anamnese Enfermagem",
      "19/11": true,
      "20/11": false,
      "21/11": false,
      total: 1,
      conformidade: 87.5
    },
    {
      tipo: "Evolução Médica",
      "19/11": false,
      "20/11": true,
      "21/11": false,
      total: 1,
      conformidade: 50
    },
    {
      tipo: "Evolução Enfermagem",
      "19/11": true,
      "20/11": true,
      "21/11": true,
      total: 3,
      conformidade: 100
    },
    {
      tipo: "Serviço Social",
      "19/11": false,
      "20/11": true,
      "21/11": false,
      total: 1,
      conformidade: 100
    }
  ],
  nao_conformidades: [
    {
      secao: "B",
      item: "Evolução Médica Diária",
      descricao: "Evolução médica ausente no 3º dia de internação"
    },
    {
      secao: "C",
      item: "CID do Procedimento Cirúrgico",
      descricao: "CID ausente na descrição cirúrgica"
    },
    {
      secao: "D",
      item: "Antecedentes Familiares — Anamnese de Enfermagem",
      descricao: "AF não registrado pela equipe de enfermagem"
    }
  ]
}

export const EXAMPLE_INPUT_2 = `[
  {
  "Prontuário": "24.440.208",
  "Atendimento": "7.092.672",
  "Data De Nascimento pact": "30/10/1956",
  "Data da internação": "15/04/2024, 03:15",
  "Data de saída": "18/04/2024, 14:30",
  "Data de óbito": "",
  "Sexo": "M",
  "Código Sus pact": "015.700.667",
  "Especialidade cirurgia": "CIRURGIA GERAL",
  "Procedimento cirurgico Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Procedimento Interno Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Cid procedimento": "K46.1",
  "Data Inicio Cirurgia": "15/04/2024, 06:45",
  "Data Fim Cirurgia": "15/04/2024, 09:20",
  "UF cirurgia": "BLOCO CIRURGICO",
  "Unidade Funcional Internaçao": "UTI ADULTO",
  "Utilizou O2?": "Sim",
  "Usou Antibiótico Profilático?": "Sim",
  "Seguiu protoc Cirurgia Segura?": "Não",
  "Categoria Profissional": "MEDICINA",
  "Tipo do registro": "Anamnese",
  "criacao_anamnsese": "15/04/2024, 03:45",
  "Descricao do registro": "FICHA DE ADMISSÃO #CG-ADMISSÃO# DATA: 15/04/2024 REGISTRO: 24440208 LEITO: UTI-07 #IDENTIFICAÇÃO: IDADE: 68 ANOS NATURAL E PROCEDENTE: RECIFE-PE #QPD/HDA: PACIENTE REFERE DOR ABDOMINAL INTENSA, CONTÍNUA, INICIO HÁ 12 HORAS, ASSOCIADA A VÔMITOS, AUSENCIA DE EVACUAÇÃO E FLATULÊNCIA. RELATA HISTÓRIA DE HÉRNIA INGUINAL DIREITA HÁ 10 ANOS, SEM TRATAMENTO. #ANTECEDENTES PESSOAIS: HAS, DIABETES MELLITUS TIPO 2, TABAGISMO CRÔNICO (30 PACES/ANO). #ANTECEDENTES FAMILIARES: PAI COM CÂNCER DE CÓLON, MÃE COM HAS. #EXAME FÍSICO: PACIENTE ALERTA, DESORIENTADO NO TEMPO, PLETO, SUDORÉTICO, TAQUICÁRDICO (112 BPM), TAQUIPNEICO (24 RPM), PRESSÃO ARTERIAL 90/60 MMHG. ABDOMEN DURÍSSIMO, DOR À PALPAÇÃO EM HCD COM REBOTE E DEFESA. SONS PERISTÁLTICOS AUSENTES. #HD: 1- OBSTRUÇÃO INTESTINAL POR HÉRNIA INGUINAL ESTRANGULADA 2- HAS 3- DIABETES MELLITUS TIPO 2 #CD: INTERNAMENTO EM UTI PARA AVALIAÇÃO E INTERVENÇÃO CIRÚRGICA URGENTE #MEDICAÇÕES EM USO: PARACETAMOL 1G IV, RANITIDINA 50MG IV, SORO FISIOLÓGICO 1000ML/H, CEFTRIAXONA 2G IV",
  "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL, ANESTESIA GERAL INDUZIDA 2. ASSEPSIA E ANTISSEPSIA DA REGIÃO INGUINAL DIREITA COM CAMPOS ESTÉREIS 3. INCISÃO TRANSVERSA NA REGIÃO INGUINAL, DESLIZAMENTO DOS PLANOS MUSCULARES 4. IDENTIFICAÇÃO DE HÉRNIA INGUINAL DIREITA COM ÍNTESTINO DELGADO ESTRANGULADO, COM PROMINENTE EDEMA E COLORAÇÃO ESCURO-ROXEA 5. LIBERAÇÃO DO SACO HERNIÁRIO E RETIRADA DO ÍNTESTINO COMPROMETIDO (APROX. 30CM) COM CLAMP E RESSECÇÃO ANASTOMOSE TERMINO-TERMINAL 6. REPARO DO ANEL INGUINAL COM PRÓTESE DE POLIPROPILENO, FIXADA COM PONTOS DE NYLON 3-0 7. LAVAGEM ABUNDANTE DA CAVIDADE ABDOMINAL COM SOLUÇÃO FISIOLÓGICA 8. FECHAMENTO DOS PLANOS MUSCULARES E PELE COM PONTOS ABSORVÍVEIS 9. CURATIVO OCLUSIVO COM GASEE E FITA ADESIVA"
},
{
  "Prontuário": "24.440.208",
  "Atendimento": "7.092.672",
  "Data De Nascimento pact": "30/10/1956",
  "Data da internação": "15/04/2024, 03:15",
  "Data de saída": "18/04/2024, 14:30",
  "Data de óbito": "",
  "Sexo": "M",
  "Código Sus pact": "015.700.667",
  "Especialidade cirurgia": "CIRURGIA GERAL",
  "Procedimento cirurgico Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Procedimento Interno Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Cid procedimento": "K46.1",
  "Data Inicio Cirurgia": "15/04/2024, 06:45",
  "Data Fim Cirurgia": "15/04/2024, 09:20",
  "UF cirurgia": "BLOCO CIRURGICO",
  "Unidade Funcional Internaçao": "UTI ADULTO",
  "Utilizou O2?": "Sim",
  "Usou Antibiótico Profilático?": "Sim",
  "Seguiu protoc Cirurgia Segura?": "Não",
  "Categoria Profissional": "MEDICINA",
  "Tipo do registro": "Evolução",
  "criacao_anamnsese": "15/04/2024, 15:44",
  "Descricao do registro": "#HD: OBSTRUÇÃO INTESTINAL POR HÉRNIA INGUINAL ESTRANGULADA (K46.1) #MEDICAÇÕES EM USO: PARECONE 100MG IV 8/8H, CEFTRIAXONA 2G IV 12/12H, MORFINA 5MG IV PRN, RANITIDINA 50MG IV 12/12H #EVOLUÇÃO: PACIENTE NO 2º PÓS-OPERATÓRIO, CONSCIENTE, ORIENTADO, EM REPOUSO, COM DOR CONTROLADA COM ANALGESIA IV. ABDÔMEN FLÁCIDO, DOLOROSO AO PALPAR REGIÃO INGUINAL, SEM DISTENSÃO. RUMINAÇÃO PRESENTE. DIURESE ADEQUADA. SPO2 96% EM O2 2L/MIN. #EXAME FÍSICO: PULSOS PERIFÉRICOS PRESENTES E SIMÉTRICOS, FC 88bpm, PA 118/76mmHg, T 37,1°C. PULMÕES: VOZ TÁTIL E VENTILAÇÃO SIMÉTRICAS. ABDÔMEN: HIPOCONDRIO DIREITO COM CICATRIZ OPERATÓRIA SEM SINAIS INFLAMATÓRIOS. #EXAMES COMPLEMENTARES: RX ABDOMINAL SEM SINAIS DE OBSTRUÇÃO. HEMOGLOBINA 10,8g/dL, LEUCÓCITOS 12.500/mm³, CRP 4,8mg/dL. #CD: EVOLUÇÃO ESTÁVEL PÓS-OPERATÓRIA DE HERNIORRAFIA E RESSECÇÃO INTESTINAL. CONTINUAR ACOMPANHAMENTO NA UTI.",
  "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL, ANESTESIA GERAL INDUZIDA 2. ASSEPSIA E ANTISSEPSIA DA REGIÃO INGUINAL E ABDOMINAL COM PVD 3. INCISÃO LONGITUDINAL NA REGIÃO INGUINAL, ATRAVÉS DA LINHA HALSTED 4. DISSECAÇÃO DOS PLANOS MUSCULARES ATÉ A IDENTIFICAÇÃO DO SACO HERNIÁRIO 5. AVALIAÇÃO DO SACO: CONTÉM SEGMENTO DE INTESTINO DELGADO COM NECESSIDADE DE RESSECÇÃO POR ISQUEMIA E PERFORAÇÃO LOCALIZADA 6. RESSECÇÃO DO SEGMENTO INTESTINAL AFETADO (15CM) COM ANASTOMOSE TERMINOTERMINAL COM CLIPES METÁLICOS 7. REPARO DO ANEL INGUINAL COM PRÓTESE DE POLIPROPILENO, FIXADA COM PONTOS DE SEDA 3-0 8. FECHAMENTO DOS PLANOS MUSCULARES E CUTÂNEOS COM SUTURA CONTÍNUA DE NYLON 2-0 9. CURATIVO ESTÉRIL COM GASEA E FITA ADESIVA 10. TRANSPORTE AO PÓS-OPERATÓRIO EM CONDIÇÕES ESTÁVEIS."
},
{
  "Prontuário": "24.440.208",
  "Atendimento": "7.092.672",
  "Data De Nascimento pact": "30/10/1956",
  "Data da internação": "15/04/2024, 03:15",
  "Data de saída": "18/04/2024, 14:30",
  "Data de óbito": "",
  "Sexo": "M",
  "Código Sus pact": "015.700.667",
  "Especialidade cirurgia": "CIRURGIA GERAL",
  "Procedimento cirurgico Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Procedimento Interno Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Cid procedimento": "K46.1",
  "Data Inicio Cirurgia": "15/04/2024, 06:45",
  "Data Fim Cirurgia": "15/04/2024, 09:20",
  "UF cirurgia": "BLOCO CIRURGICO",
  "Unidade Funcional Internaçao": "UTI ADULTO",
  "Utilizou O2?": "Sim",
  "Usou Antibiótico Profilático?": "Sim",
  "Seguiu protoc Cirurgia Segura?": "Não",
  "Categoria Profissional": "MEDICINA",
  "Tipo do registro": "Evolução",
  "criacao_anamnsese": "16/04/2024, 00:03",
  "Descricao do registro": "#HD: OBSTRUÇÃO INTESTINAL POR HÉRNIA INGUINAL ESTRANGULADA COM COMPROMETIMENTO INTESTINAL SECUNDÁRIO A ISQUEMIA\\n#MEDICAÇÕES EM USO: MORFINA 5MG IV 8/8H, MEROPENEM 1G IV 8/8H, RANITIDINA 50MG IV 12/12H, LAXANTE OSMÓTICO, SORO FISIOLÓGICO 100ML/H\\n#EVOLUÇÃO: PACIENTE EM VIGILÂNCIA NA UTI, COM MELHORA DO QUADRO DOR, AUSENCIA DE DISTENSÃO ABDOMINAL, SONS PERISTÁLTICOS PRESENTES, EVACUAÇÃO INTESTINAL ESPONTÂNEA NO PÓS-OPERATÓRIO IMEDIATO. PRESSÃO ARTERIAL ESTÁVEL, FREQUÊNCIA CARDÍACA 84 BPM, SATURAÇÃO 96% EM O2 2L/MIN. DIURESE ADEQUADA. NENHUM SINAL DE INFECÇÃO NO SÍTIO CIRÚRGICO.\\n#EXAME FÍSICO: ABDOMEN MACIO, DESCOMPROMETIDO, SEM DOR À PALPAÇÃO, SEM MASSAS, SEM SINAIS DE IRITAÇÃO PERITONEAL. PULSOS PERIFÉRICOS PRESENTES E SIMÉTRICOS.\\n#EXAMES COMPLEMENTARES: RX ABDOMINAL SEM IMAGEM DE OBSTRUÇÃO, EXAMES LABORAIS: LEUCOCITOSE 12.300, CRP 4,8 MG/DL, CREATININA 1,1 MG/DL. #CD: EVOLUÇÃO PÓS-CIRÚRGICA DE HÉRNIA INGUINAL ESTRANGULADA COM RESSECÇÃO INTESTINAL. MANUTENÇÃO DE CUIDADOS INTENSIVOS.",
  "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL E MONITORAMENTO CONTÍNUO\\n2. ASSEPSIA E ANTISSEPSIA DO CAMPO CIRÚRGICO COM SOLUÇÃO AQUOSA DE CLORHEXIDINA\\n3. INCISÃO INGUINAL LONGITUDINAL, ATRAVÉS DA LINHA BRANCA, EXPOSICÃO DO ANEL INGUINAL\\n4. DESCOBERTA DE HÉRNIA INGUINAL DIREITA COM TRÂNSITO DE ALÇA INTESTINAL ESTRANGULADA, COM SINAL DE ISQUEMIA E COLORAÇÃO ESCURO-ROXACENTO\\n5. RESSECÇÃO DE 25CM DE ALÇA INTESTINAL ISQUÊMICA, COM APROXIMAÇÃO EXTREMA DA ALÇA SAUDÁVEL\\n6. ANASTOMOSE INTESTINAL EXTREMA-EXTREMA COM LINHA DE PONTOS CONTÍNUOS DE POLIPROPILENO 3-0\\n7. REPARO DO ANEL INGUINAL COM PRÓTESE DE POLIPROPILENO, FIXADA COM PONTOS CONTÍNUOS DE POLIPROPILENO 2-0\\n8. FECHAMENTO DA FÁSCIA COM LINHA DE POLIPROPILENO 2-0, PELE COM NYLON 3-0\\n9. CURATIVO ESTÉRIL COM GASEA E FITA ADHESIVA\\n10. ENCAMINHAMENTO PARA UTI COM CONTROLE DE DOR E ANTIBIOTICOTERAPIA CONTÍNUA"
},
{
  "Prontuário": "24.440.208",
  "Atendimento": "7.092.672",
  "Data De Nascimento pact": "30/10/1956",
  "Data da internação": "15/04/2024, 03:15",
  "Data de saída": "18/04/2024, 14:30",
  "Data de óbito": "",
  "Sexo": "M",
  "Código Sus pact": "015.700.667",
  "Especialidade cirurgia": "CIRURGIA GERAL",
  "Procedimento cirurgico Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Procedimento Interno Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Cid procedimento": "K46.1",
  "Data Inicio Cirurgia": "15/04/2024, 06:45",
  "Data Fim Cirurgia": "15/04/2024, 09:20",
  "UF cirurgia": "BLOCO CIRURGICO",
  "Unidade Funcional Internaçao": "UTI ADULTO",
  "Utilizou O2?": "Sim",
  "Usou Antibiótico Profilático?": "Sim",
  "Seguiu protoc Cirurgia Segura?": "Não",
  "Categoria Profissional": "ENFERMAGEM",
  "Tipo do registro": "Anamnese",
  "criacao_anamnsese": "15/04/2024, 04:30",
  "Descricao do registro": "1.MOTIVO INTERNAMENTO: PACIENTE TRAZIDO POR SAMU COM DORES ABDOMINAIS INTENSAS, VÔMITOS E AUSÊNCIA DE EVACUAÇÃO E FLATULÊNCIA HÁ 12H. EXAME FÍSICO REVELA HÉRNIA INGUINAL DIREITA ESTRANGULADA COM SINAL DE IRREDUTIBILIDADE. 2.ALERGIAS/COMORBIDADES: NÃO REFERE ALERGIAS. COMORBIDADES: HAS, DIABETES MELLITUS TIPO 2. 3.PULSEIRA: IDENTIFICADA CORRETAMENTE COM NOME, DATA DE NASCIMENTO E PRONTUÁRIO. 4.QUEIXAS: DOR ABDOMINAL INTENSA, INCONTINÊNCIA FECAL, NÁUSEAS. 5.ESTADO GERAL: PESADO, DESIDRATADO, TACICÁRDICO. 6.SNC: ALERTA, ORIENTADO, RESPOSTA A ESTÍMULOS VERBAIS. 7.PELE/MUCOSAS/RESP: PELE FRIA E ÚMIDA, MUCOSAS SECAS, RESPIRAÇÃO RÁPIDA E SURDA. 8.CARDIOVASCULAR: FC 112 BPM, PA 100/60 MMHG, RITMO REGULAR. 9.GI: ABDOME DURÍSSIMO, DISTENDIDO, DOR A PALPAÇÃO DIFUSA, RUIDOS HIDROAÉREOS ABAIXADOS. 10.INTESTINAL: AUSÊNCIA DE EVACUAÇÃO E FLATULÊNCIA DESDE 12H. 11.GENITOURINÁRIO: DIURESE ADEQUADA (400ML/8H), CATETER VESICAL EM FUNÇÃO. 12.MÚSCULO-ESQUELÉTICO: FORÇA MUSCULAR PRESERVADA NOS Membros INFERIORES. 13.DRENOS: NENHUM. 14.ESCALAS(EVA/Braden/Morse/FUGULIN): EVA 9, BRADEN 14, MORSE 45, FUGULIN 3. 15.EXAMES/PROCEDIMENTOS: RX ABDOMINAL SEMI-ERETO: NÍVEIS HIDROAÉREOS MÚLTIPLOS, INTESTINO DILATADO. 16.CONDUTAS: PREPARO PARA CIRURGIA EMERGENCIAL, INICIO DE ANTIBIOTICOTERAPIA, HIDRATAÇÃO VENOSA, MONITORAMENTO CONTÍNUO DE SINAIS VITAIS. 17.ANTECEDENTES FAMILIARES: PAI COM CÂNCER DE CÓLON, MÃE COM HAS.",
  "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL, PREPARADO E ANTISSEPTIZADO COM CLORHEXIDINA 2% 2. INCISÃO EM LINHA INGUINAL DIREITA, COM EXTENSÃO PARA A HÉRNIA 3. DISSECÇÃO DO SACO HERNIÁRIO, IDENTIFICAÇÃO DE ALÇA INTESTINAL ESTRANGULADA COM NECROSE SEGMENTAR 4. RESSEÇÃO DO TRECHO INTESTINAL NECRÓTICO (15CM) COM ANASTOMOSE EXTREMO-EXTREMO COM SUTURA CONTÍNUA DE POLIPROPILENO 3-0 5. REPARO DO ANEL INGUINAL COM PRÓTESE DE POLIPROPILENO, FIXADA COM PONTOS DE SUTURA ABSORVÍVEL 6. LAVAGEM ABUNDANTE DA CAVIDADE ABDOMINAL COM SOLUÇÃO SALINA 0,9% 7. SÍNTESE DA FÁSCIA E PELE COM SUTURA DE NYLON 2-0 8. CURATIVO ESTÉRIL COM GASEA E ADESIVO 9. ENVIO DE AMOSTRA INTESTINAL PARA ANÁLISE PATOLÓGICA"
},
{
  "Prontuário": "24.440.208",
  "Atendimento": "7.092.672",
  "Data De Nascimento pact": "30/10/1956",
  "Data da internação": "15/04/2024, 03:15",
  "Data de saída": "18/04/2024, 14:30",
  "Data de óbito": "",
  "Sexo": "M",
  "Código Sus pact": "015.700.667",
  "Especialidade cirurgia": "CIRURGIA GERAL",
  "Procedimento cirurgico Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Procedimento Interno Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Cid procedimento": "K46.1",
  "Data Inicio Cirurgia": "15/04/2024, 06:45",
  "Data Fim Cirurgia": "15/04/2024, 09:20",
  "UF cirurgia": "BLOCO CIRURGICO",
  "Unidade Funcional Internaçao": "UTI ADULTO",
  "Utilizou O2?": "Sim",
  "Usou Antibiótico Profilático?": "Sim",
  "Seguiu protoc Cirurgia Segura?": "Não",
  "Categoria Profissional": "ENFERMAGEM",
  "Tipo do registro": "Evolução",
  "criacao_anamnsese": "16/04/2024, 16:42",
  "Descricao do registro": "#HD: OBSTRUÇÃO INTESTINAL POR HÉRNIA INGUINAL ESTRANGULADA #MEDICAÇÕES EM USO: MORFINA 5MG IV 8/8H, CEFTRIAXONA 2G IV 24H, METRONIDAZOL 500MG IV 8/8H, HEPARINA 5000 UI SC 12/12H #EVOLUÇÃO: PACIENTE EM VIGÍLIA, RESPONDENDO A COMANDOS, COM DOR CONTÍNUA EM ESCALA EVA 7. ABDOMEN DURÃO, DOLOROSO À PALPAÇÃO, SEM SONS HIDROAÉREOS. DIURESE DE 40ML/H. SPO2 96% COM O2 A 4L/MIN. #EXAME FÍSICO: PULSO 110 BPM, PA 110/70 MMHG, TEMP 37,8°C. PÉLVIS E MEMBROS INF. COM EDEMA LEVE, SEM ULCERAS. #EXAMES COMPLEMENTARES: RX ABDOMINAL: NÍVEIS HIDROAÉREOS MÚLTIPLOS. HEMOGLOBINA 9,8 G/DL (BAIXA). LEUCOCITOSE 14.200. DHL ELEVADA. #CD: EVOLUÇÃO PÓS-CIRÚRGICA DE HÉRNIA INGUINAL ESTRANGULADA COM RESSECÇÃO INTESTINAL. MANUTENÇÃO DE CUIDADOS INTENSIVOS. #ESCALAS(EVA/Braden/Morse/FUGULIN): EVA 9, BRADEN 14, MORSE 35, FUGULIN 3. #CURATIVO: TROCA DE CURATIVO CIRÚRGICO NA REGIÃO INGUINAL DIREITA, TAMANHO DA LESÃO APROX. 15 CM, BORDAS BEM APROXIMADAS, SEM PRESENÇA DE EXSUDATO, SEM SINAIS DE NECROSE. ASPECTO LIMPO E SECO, FECHADO COM GAZE ESTÉRIL E ADESIVO HIPOALERGÊNICO.",
  "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL, MONITORIZAÇÃO CONTÍNUA 2. ASSEPSIA E ANTISSEPSIA DO CAMPO CIRÚRGICO COM CLORHEXIDINA 2% 3. INCISÃO LONGITUDINAL NA REGIÃO INGUINAL DIREITA, DESCOBERTA DO ANEL INGUINAL 4. IDENTIFICAÇÃO DE HÉRNIA ESTRANGULADA COM INTESTINO DELGADO NECRÓTICO, APRESENTANDO COR AZULADA E SEM MOVIMENTO PERISTÁLTICO 5. RESSECÇÃO DE 15 CM DE INTESTINO DELGADO NECRÓTICO COM ANASTOMOSE TERMINOTERMINAL ELETROCAUTERIZADA 6. REPARO DO ANEL INGUINAL COM PRÓTESE DE POLIPROPILENO, FIXADA COM PONTOS DE NYLON 0 7. LAVAGEM ABUNDANTE DA CAVIDADE ABDOMINAL COM SOLUÇÃO SALINA 0,9% 8. SÍNTESE DA FÁSCIA E PELE COM NYLON 2-0 9. CURATIVO OCLUSIVO COM GASEE E ADESIVO ESTÉRIL 10. ENCAMINHAMENTO PARA UTI COM MONITORIZAÇÃO CONTÍNUA"
},
{
  "Prontuário": "24.440.208",
  "Atendimento": "7.092.672",
  "Data De Nascimento pact": "30/10/1956",
  "Data da internação": "15/04/2024, 03:15",
  "Data de saída": "18/04/2024, 14:30",
  "Data de óbito": "",
  "Sexo": "M",
  "Código Sus pact": "015.700.667",
  "Especialidade cirurgia": "CIRURGIA GERAL",
  "Procedimento cirurgico Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Procedimento Interno Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Cid procedimento": "K46.1",
  "Data Inicio Cirurgia": "15/04/2024, 06:45",
  "Data Fim Cirurgia": "15/04/2024, 09:20",
  "UF cirurgia": "BLOCO CIRURGICO",
  "Unidade Funcional Internaçao": "UTI ADULTO",
  "Utilizou O2?": "Sim",
  "Usou Antibiótico Profilático?": "Sim",
  "Seguiu protoc Cirurgia Segura?": "Não",
  "Categoria Profissional": "ENFERMAGEM",
  "Tipo do registro": "Evolução",
  "criacao_anamnsese": "17/04/2024, 01:02",
  "Descricao do registro": "#HD: OBSTRUÇÃO INTESTINAL POR HÉRNIA INGUINAL ESTRANGULADA #MEDICAÇÕES EM USO: MORFINA 5MG IV 8/8H, CEFTRIAXONA 2G IV 24H, METRONIDAZOL 500MG IV 8/8H, HEPARINA 5000 UI SC 12/12H #EVOLUÇÃO: PACIENTE EM VIGÍLIA, RESPONDENDO A COMANDOS, COM DOR CONTÍNUA EM ESCALA EVA 7. ABDOMEN DURÃO, DOLOROSO À PALPAÇÃO, SEM SONS HIDROAÉREOS. DIURESE DE 40ML/H. SPO2 96% COM O2 A 4L/MIN. #EXAME FÍSICO: PULSO 110 BPM, PA 110/70 MMHG, TEMP 37,8°C. PÉLVIS E MEMBROS INF. COM EDEMA LEVE, SEM ULCERAS. #EXAMES COMPLEMENTARES: RX ABDOMINAL: NÍVEIS HIDROAÉREOS MÚLTIPLOS. HEMOGLOBINA 9,8 G/DL (BAIXA). LEUCOCITOSE 14.200. DHL ELEVADA. #CD: EVOLUÇÃO PÓS-CIRÚRGICA DE HÉRNIA INGUINAL ESTRANGULADA COM RESSECÇÃO INTESTINAL. MANUTENÇÃO DE CUIDADOS INTENSIVOS. #ESCALAS(EVA/Braden/Morse/FUGULIN): EVA 9, BRADEN 14, MORSE 35, FUGULIN 3. #CURATIVO: TROCA DE CURATIVO CIRÚRGICO NA REGIÃO INGUINAL DIREITA, TAMANHO DA LESÃO APROX. 15 CM, BORDAS BEM APROXIMADAS, SEM PRESENÇA DE EXSUDATO, SEM SINAIS DE NECROSE. ASPECTO LIMPO E SECO, FECHADO COM GAZE ESTÉRIL E ADESIVO HIPOALERGÊNICO.",
  "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL, ANESTESIA GERAL INDUZIDA. 2. ASSEPSIA E ANTISSEPSIA DA REGIÃO INGUINAL E ABDOMINAL INFERIOR. 3. INCISÃO LONGITUDINAL NA REGIÃO INGUINAL, EXPOSIÇÃO DO ANEL INGUINAL. 4. IDENTIFICAÇÃO E LIBERAÇÃO DO HÉRNIA INGUINAL ESTRANGULADA COM COMPROMETIMENTO DO LAÇO INTESTINAL. 5. RESSECÇÃO DE 15CM DE INTESTINO DELGADO COM LESÃO ISQUÊMICA, ANASTOMOSE TERMINOTERMINAL COM SUTURA INTERROMPIDA DE 3-0 POLIPROPILENO. 6. REPARO DA HÉRNIA COM PRÓTESE DE POLIPROPILENO, FIXADA COM PONTOS DE SUTURA NÃO ABSORVÍVEL. 7. LAVAGEM ABDOMINAL COM SOLUÇÃO FISIOLÓGICA A 0,9%. 8. FECHAMENTO DOS PLANOS MUSCULARES E PELE COM SUTURA CONTÍNUA DE NYLON 2-0. 9. CURATIVO ESTÉRIL COM GAZE E FITA ADHESIVA."
},
{
  "Prontuário": "24.440.208",
  "Atendimento": "7.092.672",
  "Data De Nascimento pact": "30/10/1956",
  "Data da internação": "15/04/2024, 03:15",
  "Data de saída": "18/04/2024, 14:30",
  "Data de óbito": "",
  "Sexo": "M",
  "Código Sus pact": "015.700.667",
  "Especialidade cirurgia": "CIRURGIA GERAL",
  "Procedimento cirurgico Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Procedimento Interno Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Cid procedimento": "K46.1",
  "Data Inicio Cirurgia": "15/04/2024, 06:45",
  "Data Fim Cirurgia": "15/04/2024, 09:20",
  "UF cirurgia": "BLOCO CIRURGICO",
  "Unidade Funcional Internaçao": "UTI ADULTO",
  "Utilizou O2?": "Sim",
  "Usou Antibiótico Profilático?": "Sim",
  "Seguiu protoc Cirurgia Segura?": "Não",
  "Categoria Profissional": "FISIOTERAPIA",
  "Tipo do registro": "Evolução",
  "criacao_anamnsese": "17/04/2024, 09:21",
  "Descricao do registro": "EVOLUÇÃO DE FISIOTERAPIA - DIA 2\\nPACIENTE EM UTI, CONSCIENTE, ORIENTADO, COM SEDAÇÃO LEVE, VENTILAÇÃO MECÂNICA CONTROLADA. AVALIAÇÃO DE FUNÇÃO RESPIRATÓRIA: VOLUME TIDAL 6 ML/KG, FREQUÊNCIA 18 RPM, SPO2 96% COM O2 40%. EXAME FÍSICO: RUGOSIDADES PULMONARES EM BASES, SEM SINAL DE DERRAME. REALIZADA TERAPIA MANUAL DE DESCONGESTÃO BRÔNQUICA, TÉCNICA DE MANOBRA DE EXPULSÃO DE SECREÇÃO E MOBILIZAÇÃO PASSIVA DE MEMBROS SUPERIORES E INFERIORES. NÃO HOUVE ALTERAÇÕES HEMODINÂMICAS. INSTRUÍDO A CUIDADORES SOBRE POSICIONAMENTO E PREVENÇÃO DE ÚLCERAS POR PRESSÃO. CONTINUA COM DRENOS A VÁCUO NO ABDOMEN, SEM ALTERAÇÕES. ESCALA DE RISCO DE QUEDA: MORSE 20. NÃO HÁ INDICAÇÃO DE ATIVIDADE ATIVA NESTE MOMENTO.",
  "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL COM INTUBAÇÃO OROTRAQUEAL\\n2. ASSEPSIA E ANTISSEPSIA DO CAMPO ABDOMINAL E INGUINAL COM SOLUÇÃO AQUOSA DE CLORHEXIDINA 2%\\n3. INCISÃO LONGITUDINAL NA REGIÃO INGUINAL, INICIANDO DO TUBÉRCULO DO PÚBIS ATÉ O LIMITE SUPERIOR DA DOBRA INGUINAL\\n4. DISSECAÇÃO DOS PLANOS MUSCULARES ATÉ A EXPOSIÇÃO DO ANEL INGUINAL INTERNO\\n5. IDENTIFICAÇÃO DA HÉRNIA INGUINAL ESTRANGULADA COM SEGMENTO INTESTINAL TUMEFADO E DE COR AZULADA, INDICANDO COMPROMETIMENTO VASCULAR\\n6. RESSEÇÃO DO SEGMENTO INTESTINAL NECRÓTICO DE APROXIMADAMENTE 25 CM, COM ANASTOMOSE ILEO-COLONICA TERMINO-TERMINAL EM DUPLA CAMADA COM SÍNTESE DE SUTURE ABSORVÍVEL 2-0\\n7. REPARO DO ANEL INGUINAL COM PRÓTESE DE POLIPROPILENO, FIXADA COM PONTOS NÃO ABSORVÍVEIS\\n8. RECONSTRUÇÃO DOS PLANOS MUSCULARES E PELE COM SÍNTESE DE NYLON 3-0\\n9. DRENAGEM DE TUBO DE SILON NO ABDOMEN COM SAÍDA PELA PAREDE ANT. DO ABDOME\\n10. CURATIVO OCLUSIVO COM GAZE ESTÉRIL E FITA ADESIVA"
},
{
  "Prontuário": "24.440.208",
  "Atendimento": "7.092.672",
  "Data De Nascimento pact": "30/10/1956",
  "Data da internação": "15/04/2024, 03:15",
  "Data de saída": "18/04/2024, 14:30",
  "Data de óbito": "",
  "Sexo": "M",
  "Código Sus pact": "015.700.667",
  "Especialidade cirurgia": "CIRURGIA GERAL",
  "Procedimento cirurgico Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Procedimento Interno Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Cid procedimento": "K46.1",
  "Data Inicio Cirurgia": "15/04/2024, 06:45",
  "Data Fim Cirurgia": "15/04/2024, 09:20",
  "UF cirurgia": "BLOCO CIRURGICO",
  "Unidade Funcional Internaçao": "UTI ADULTO",
  "Utilizou O2?": "Sim",
  "Usou Antibiótico Profilático?": "Sim",
  "Seguiu protoc Cirurgia Segura?": "Não",
  "Categoria Profissional": "FISIOTERAPIA",
  "Tipo do registro": "Evolução",
  "criacao_anamnsese": "17/04/2024, 17:41",
  "Descricao do registro": "EVOLUÇÃO DE FISIOTERAPIA - DIA 3\\nPACIENTE EM UTI, CONSCIENTE, ORIENTADO, COM SUPORTE VENTILATÓRIO ELEVADO. AVALIAÇÃO FISIOTERÁPICA: MUSCULATURA RESPIRATÓRIA FRACA, DIMINUIÇÃO DO VOLUME TIDAL, PRESENÇA DE SECREÇÕES BRÔNQUICAS EM REGIÃO BÁSICA. REALIZADA TERAPIA MANUAL COM VIBRAÇÕES, TAPOTEM E TOSSE ASSISTIDA. UTILIZADO NEBULIZADOR COM SALINA 0,9% E BRONCODILATADOR. MELHORA LEVE NA SATURAÇÃO (94% PARA 96%). NÃO APRESENTA DOR OU DISPNEIA EM REPOUSO. CONTINUA COM MOVIMENTOS PASSIVOS DE MEMBROS INFERIORES A CADA 4H PARA PREVENÇÃO DE TROMBOSE. NÃO HÁ INDICAÇÃO DE MOBILIZAÇÃO SENTADO OU EM PÉ DEVIDO A INSTABILIDADE HEMODINÂMICA. ACOMPANHAMENTO DIÁRIO CONTINUADO.",
  "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL COM ANESTESIA GERAL E BLOQUEIO PERIDURAL\\n2. ASSEPSIA E ANTISSEPSIA DA REGIÃO INGUINAL E ABDOMINAL COM SOLUÇÃO AQUOSA DE CLORHEXIDINA\\n3. INCISÃO TRANSVERSA NA REGIÃO INGUINAL, EXTENSÃO ATÉ O ANEL FEMORAL\\n4. DESCOBERTA DA HÉRNIA INGUINAL ESTRANGULADA COM TRATO INTESTINAL COMPROMETIDO E EDEMA SEVERO\\n5. RETIRADA DO ÓRGÃO HÉRNIA COM RESSEÇÃO DE 20CM DE INTESTINO DELGADO NECRÓTICO, COM CLIPAGEM E LIGADURA DOS VASOS MESENTÉRICOS\\n6. ANASTOMOSE EXTREMO-EXTREMO DO INTESTINO COM SUTURA CONTÍNUA DE POLIPROPILENO 3-0\\n7. REPARO DO ANEL INGUINAL COM PRÓTESE DE POLIPROPILENO NÃO REABSORVÍVEL, FIXADA COM PONTOS DE SUTURA DE NYLON 0\\n8. LAVAGEM ABDOMINAL COM SOLUÇÃO SALINA A 0,9% E DRENAGEM COM DRENO DE SILICONE\\n9. FECHAMENTO CAMADAS MUSCULARES E SUBCUTÂNEAS COM SUTURA CONTÍNUA DE POLIGLACTINA 2-0\\n10. PELE FECHADA COM PONTOS INTERROMPIDOS DE NYLON 2-0\\n11. CURATIVO ESTÉRIL COM GAZE E FITA ADHESIVA"
},
{
  "Prontuário": "24.440.208",
  "Atendimento": "7.092.672",
  "Data De Nascimento pact": "30/10/1956",
  "Data da internação": "15/04/2024, 03:15",
  "Data de saída": "18/04/2024, 14:30",
  "Data de óbito": "",
  "Sexo": "M",
  "Código Sus pact": "015.700.667",
  "Especialidade cirurgia": "CIRURGIA GERAL",
  "Procedimento cirurgico Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Procedimento Interno Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Cid procedimento": "K46.1",
  "Data Inicio Cirurgia": "15/04/2024, 06:45",
  "Data Fim Cirurgia": "15/04/2024, 09:20",
  "UF cirurgia": "BLOCO CIRURGICO",
  "Unidade Funcional Internaçao": "UTI ADULTO",
  "Utilizou O2?": "Sim",
  "Usou Antibiótico Profilático?": "Sim",
  "Seguiu protoc Cirurgia Segura?": "Não",
  "Categoria Profissional": "NUTRIÇÃO",
  "Tipo do registro": "Evolução",
  "criacao_anamnsese": "18/04/2024, 02:00",
  "Descricao do registro": "Evolução Nutricional - Dia 2 pós-operatório\\n#HD: Obstrução intestinal por hérnia inguinal estrangulada com ressecção de alça intestinal comprometida\\n#MEDICAÇÕES EM USO: Antibióticos, analgésicos, soro fisiológico 0,9%\\n#EVOLUÇÃO: Paciente em jejum absoluto, com sinais de recuperação hemodinâmica. Ausência de flatulência e evacuação. Abdomem distendido, com ruídos hidroaéreos hipocinéticos. Náuseas leves controladas com antieméticos.\\n#EXAME FÍSICO: Aparelho digestivo: abdome distendido, sem dor à palpação profunda. Ausência de sinais de peritonite.\\n#EXAMES COMPLEMENTARES: Radiografia de abdome sem evidência de obstáculo mecânico residual. Laboratório: albumina 2,8 g/dL, pré-albumina 12 mg/dL. Risco nutricional elevado.\\n#CD: Iniciar nutrição enteral mínima (10 mL/h) com solução isosmótica a partir de 24h, monitorando tolerância e diurese. Manter jejum até retorno de peristaltismo e ausência de distensão abdominal.",
  "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL\\n2. ASSEPSIA, ANTISSEPSIA E APOSIÇÃO DE CAMPOS CIRÚRGICOS ESTÉREIS\\n3. INCISÃO INGUINAL LONGITUDINAL NA REGIÃO DA HÉRNIA, EXPOSIÇÃO DO ANEL INGUINAL\\n4. DESCOBERTA DE HÉRNIA INGUINAL ESTRANGULADA COM COMPROMETIMENTO DA ALÇA INTESTINAL DELGADA, COM COLORAÇÃO ESCURA E SINAIS DE NECROSE\\n5. RESSECCÃO DE 25 CM DA ALÇA INTESTINAL NECRÓTICA COM CLAMP E CORTADOR CIRCULAR\\n6. ANASTOMOSE ILEO-ILEAL EM UMA CAMADA COM FIO ABSORVÍVEL 3-0\\n7. REDUÇÃO DO SACO HERNIÁRIO E REPARO DO ANEL INGUINAL COM PRÓTESE DE POLIPROPILENO\\n8. SÍNTESE DA FÁSCIA E DA PELE COM NYLON 2-0\\n9. CURATIVO ESTÉRIL COM GASEA E FITA ADHESIVA\\n10. ENCAMINHAMENTO DO MATERIAL PARA ANÁLISE PATOLÓGICA"
},
{
  "Prontuário": "24.440.208",
  "Atendimento": "7.092.672",
  "Data De Nascimento pact": "30/10/1956",
  "Data da internação": "15/04/2024, 03:15",
  "Data de saída": "18/04/2024, 14:30",
  "Data de óbito": "",
  "Sexo": "M",
  "Código Sus pact": "015.700.667",
  "Especialidade cirurgia": "CIRURGIA GERAL",
  "Procedimento cirurgico Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Procedimento Interno Realizado": "Herniorrafia inguinal emergencial com ressecção intestinal",
  "Cid procedimento": "K46.1",
  "Data Inicio Cirurgia": "15/04/2024, 06:45",
  "Data Fim Cirurgia": "15/04/2024, 09:20",
  "UF cirurgia": "BLOCO CIRURGICO",
  "Unidade Funcional Internaçao": "UTI ADULTO",
  "Utilizou O2?": "Sim",
  "Usou Antibiótico Profilático?": "Sim",
  "Seguiu protoc Cirurgia Segura?": "Não",
  "Categoria Profissional": "NUTRIÇÃO",
  "Tipo do registro": "Evolução",
  "criacao_anamnsese": "18/04/2024, 10:20",
  "Descricao do registro": "1. AVALIAÇÃO NUTRICIONAL NO 3º DIA PÓS-CIRÚRGICO: PACIENTE EM VENTILAÇÃO MECÂNICA, COM ABDÔMEN DOLORIDO E DISTENDIDO. 2. ACESSO VENOSO PERIFÉRICO COM PARENTERAL TOTAL EM ANDAMENTO. 3. NÍVEIS DE ALBUMINA: 2,8 g/dL; PREALBUMINA: 12 mg/dL. 4. ENTIDADES ALIMENTARES: NADA POR VIA ORAL DEVIDO AO RISCO DE FISTULA ANASTOMÓTICA. 5. MONITORAMENTO DE GASTROINTESTINAL: SEM RETORNO DE PERISTALSES. 6. CONDUTA: CONTINUAÇÃO DE PN COM AUMENTO DE CALORIAS PARA 25 KCAL/KG/DIA, ACOMPANHAMENTO DIÁRIO DE ELETRÓLITOS E CONTROLE DE Glicemia. 7. OBSERVAÇÃO: RISCO ELEVADO DE DESNUTRIÇÃO PROGRESSIVA DEVIDO AO PERÍODO DE ILEO PÓS-RESSEÇÃO.",
  "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL COM ANESTESIA GERAL E BLOQUEIO PERIDURAL 2. ASSEPSIA E ANTISSEPSIA DO CAMPO INGUINAL E ABDOMINAL 3. INCISÃO LONGITUDINAL NO ABDO-MESO-INGUINAL, EXPOSIÇÃO DO ANEL INGUINAL INTERNO 4. IDENTIFICAÇÃO DA HÉRNIA ESTRANGULADA COM TECIDO INTESTINAL ESCURECIDO E COMPROMETIDO 5. RESSEÇÃO DO TRECHO INTESTINAL NECRÓTICO (APROX. 20 CM) COM CLIPAGEM E CORTES COM ELETROCAUTÉRIO 6. ANASTOMOSE ILEO-ILEAL EM UMA CAMADA COM SUTURE CONTÍNUA DE PDS 2-0 7. REPARO DA HÉRNIA INGUINAL COM PRÓTESE DE POLIPROPILENO, FIXADA COM PONTOS DE NYLON 2-0 8. LAVAGEM ABDOMINAL COM SOLUÇÃO SALINA ESTÉRIL E DRENAGEM DE SUCÇÃO NO SEIO MORGAGNI 9. FECHAMENTO DA FÁSCIA E PELE COM SUTURA CONTÍNUA E MONOFILAMENTAR 10. CURATIVO ESTÉRIL COM GASES E FITA ADESIVA"
}
]`

export const EXAMPLE_OUTPUT_2 = {
  prontuario: "24.440.208",
  conformidade_geral: 100,
  secoes: [
    {
      id: "A",
      titulo: "Identificação do Atendimento",
      conformidade: 100,
      total: 9,
      conformes: 9,
      itens: [
        {
          item: "Prontuário",
          valor: "24.440.208",
          status: "conforme"
        },
        {
          item: "Data de nascimento",
          valor: "30/10/1956",
          status: "conforme"
        },
        {
          item: "Idade",
          valor: "67 anos",
          status: "conforme"
        },
        {
          item: "Período da internação",
          valor: "15/04/2024 às 03:15, 09:15 → 18/04/2024 às 14:30 (3 dias e 11 horas)",
          status: "conforme"
        },
        {
          item: "Diagnóstico/CID",
          valor: "Obstrução intestinal por hérnia inguinal estrangulada | K46.1",
          status: "conforme"
        },
        {
          item: "Especialidade cirúrgica",
          valor: "CIRURGIA GERAL",
          status: "conforme"
        },
        {
          item: "Unidade funcional da internação",
          valor: "UTI ADULTA",
          status: "conforme"
        },
        {
          item: "Unidade funcional cirúrgica",
          valor: "BLOCO CIRÚRGICO",
          status: "conforme"
        }
      ]
    },
    {
      id: "B",
      titulo: "Anamneses e Evoluções Médicas",
      conformidade: 91.6,
      total: 12,
      conformes: 11,
      subgrupos: [
        {
          titulo: "Anamnese Médica",
          data: "15/04/2024, 23:15",
          itens: [
            {
              item: "HDA",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "HD/CID",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "AP/APP",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "AF",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Conduta terapêutica",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Tempo da anamnese",
              valor: "05/04/2024 09:15 → 05/04/2024 09:45",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Evolução Médica 1",
          data: "15/04/2024 às 15:44",
          itens: [
            {
              item: "Evolução diária",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Queixas/intercorrências",
              valor: "Presente",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Evolução Médica 2",
          data: "16/04/2024, 00:03",
          itens: [
            {
              item: "Evolução diária",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Queixas/intercorrências",
              valor: "Presente",
              status: "conforme"
            }
          ]
        }
      ]
    },
    {
      id: "C",
      titulo: "Cirurgia",
      conformidade: 100,
      total: 8,
      conformes: 8,
      itens: [
        {
          item: "Especialidade",
          valor: "CIRURGIA GERAL",
          status: "conforme"
        },
        {
          item: "Unidade funcional",
          valor: "BLOCO CIRURGICO",
          status: "conforme"
        },
        {
          item: "Data",
          valor: "15/04/2024",
          status: "conforme"
        },
        {
          item: "Horário início",
          valor: "06:45",
          status: "conforme"
        },
        {
          item: "Horário fim",
          valor: "09:20",
          status: "conforme"
        },
        {
          item: "CID",
          valor: "K46.1",
          status: "conforme"
        },
        {
          item: "Procedimento",
          valor: "K46.1",
          status: "conforme"
        },
        {
          item: "Técnica operatória",
          valor: "Presente. Curativo: Presente",
          status: "conforme"
        },
        {
          item: "OPME",
          valor: "Presente",
          status: "conforme"
        }
      ]
    },
    {
      id: "D",
      titulo: "Anamnese e Evoluções de Enfermagem",
      conformidade: 93.75,
      total: 14,
      conformes: 13,
      subgrupos: [
        {
          titulo: "Anamnese Enfermagem",
          data: "15/04/2024, 23:15",
          itens: [
            {
              item: "Motivo da internação",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "AP/APP",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "AF",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Escala de Braden",
              valor: "14",
              status: "conforme"
            },
            {
              item: "Escala de Morse",
              valor: "45",
              status: "conforme"
            },
            {
              item: "Condutas",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Horário",
              valor: "Dentro do prazo",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Evolução Enfermagem 1",
          data: "16/04/2024 16:42",
          itens: [
            {
              item: "Evolução diária",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "HD/CID",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Escalas",
              valor: "14",
              status: "conforme"
            },
            {
              item: "Curativos",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Horários",
              valor: "Presente",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Evolução Enfermagem 2",
          data: "17/04/2024, 09:21",
          itens: [
            {
              item: "Evolução diária",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "HD/CID",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Exame físico",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Escalas",
              valor: "15",
              status: "conforme"
            },
            {
              item: "Curativos",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Horários",
              valor: "Presente",
              status: "conforme"
            }
          ]
        }
      ]
    },
    {
      id: "E",
      titulo: "Outras Categorias Profissionais",
      conformidade: 100,
      total: 1,
      conformes: 1,
      subgrupos: [
        {
          titulo: "Fisioterapia 1",
          data: "17/04/2024, 09:21",
          itens: [
            {
              item: "Assistência descrita",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas registradas",
              valor: "Presente",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Fisioterapia 2",
          data: "17/-4/2024, 17:41",
          itens: [
            {
              item: "Assistência descrita",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas registradas",
              valor: "Presente",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Nutrição 1",
          data: "18/04/2024, 02:00",
          itens: [
            {
              item: "Assistência descrita",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas registradas",
              valor: "Presente",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Nutrição 2",
          data: "18/04/2024, 10:20",
          itens: [
            {
              item: "Assistência descrita",
              valor: "Presente",
              status: "conforme"
            },
            {
              item: "Condutas registradas",
              valor: "Presente",
              status: "conforme"
            }
          ]
        },
        {
          titulo: "Terapia Ocupacional (TO)",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "",
              status: "nao_se_aplica"
            },
            {
              item: "Condutas registradas",
              valor: "",
              status: "nao_se_aplica"
            }
          ]
        },
        {
          titulo: "Psicologia",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "",
              status: "nao_se_aplica"
            },
            {
              item: "Condutas registradas",
              valor: "",
              status: "nao_se_aplica"
            }
          ]
        },
        {
          titulo: "Fonoaudiologia",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "",
              status: "nao_se_aplica"
            },
            {
              item: "Condutas registradas",
              valor: "",
              status: "nao_se_aplica"
            }
          ]
        },
        {
          titulo: "Serviço Social",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "",
              status: "nao_se_aplica"
            },
            {
              item: "Condutas registradas",
              valor: "",
              status: "nao_se_aplica"
            }
          ]
        },
        {
          titulo: "Farmácia Clínica",
          data: "",
          itens: [
            {
              item: "Assistência descrita",
              valor: "",
              status: "nao_se_aplica"
            },
            {
              item: "Condutas registradas",
              valor: "",
              status: "nao_se_aplica"
            }
          ]
        }
      ]
    }
  ],
  quantitativo: [
    {
      tipo: "Anamnese Médica",
      "15/04": true,
      "16/04": false,
      "17/04": false,
      "18/04": false,
      total: 1,
      conformidade: 100
    },
    {
      tipo: "Anamnese Enfermagem",
      "15/04": true,
      "16/04": false,
      "17/04": false,
      "18/04": false,
      total: 1,
      conformidade: 100
    },
    {
      tipo: "Evolução Médica",
      "15/04": true,
      "16/04": true,
      "17/04": false,
      "18/04": false,
      total: 2,
      conformidade: 100
    },
    {
      tipo: "Evolução Enfermagem",
      "15/04": false,
      "16/04": true,
      "17/04": true,
      "18/04": false,
      total: 2,
      conformidade: 71.4
    },
    {
      tipo: "Fisioterapia",
      "15/04": false,
      "16/04": false,
      "17/04": true,
      "18/04": false,
      total: 2,
      conformidade: 100
    },
    {
      tipo: "Nutrição",
      "15/04": false,
      "16/04": false,
      "17/04": false,
      "18/04": true,
      total: 2,
      conformidade: 100
    }
  ],
  nao_conformidades: [
    {
      secao: "D",
      item: "Escala de Braden",
      descricao: "Escala de Braden não registrada na Evolução de Enfermagem do dia 16/04"
    },
    {
      secao: "D",
      item: "Escala de Morse",
      descricao: "Escala de Morse não registrada na Evolução de Enfermagem do dia 16/04"
    },
    {
      secao: "D",
      item: "Curativo",
      descricao: "Descrição do curativo incompleta nas Evoluções de Enfermagem de 16/04 e 17/04"
    }
  ]
}

export const EXAMPLES = [
  {
    id: "1",
    name: "Prontuário 58.907.003 (Colecistite)",
    input: EXAMPLE_INPUT,
    output: EXAMPLE_OUTPUT
  },
  {
    id: "2",
    name: "Prontuário 24.440.208 (Herniorrafia Inguinal)",
    input: EXAMPLE_INPUT_2,
    output: EXAMPLE_OUTPUT_2
  }
]