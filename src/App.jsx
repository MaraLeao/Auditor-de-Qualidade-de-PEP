import { useState, useRef, useEffect } from 'react'

const EXAMPLE_INPUT = `[
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

const EXAMPLE_OUTPUT = {
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
        { item: "Prontuário", valor: "58.907.003", status: "conforme" },
        { item: "Data de Nascimento", valor: "18/07/1956", status: "conforme" },
        { item: "Idade", valor: "69 anos", status: "conforme" },
        { item: "Período da Internação", valor: "15/04/2024, 09:15 → 18/04/2024, 10:30 (3 dias e 1 hora)", status: "conforme" },
        { item: "Diagnóstico Identificado", valor: "COLELITIASE COM COLECISTITE AGUDA", status: "conforme" },
        { item: "CID", valor: "K81.0", status: "conforme" },
        { item: "Especialidade Cirurgia", valor: "CIRURGIA GERAL", status: "conforme" },
        { item: "Procedimento Cirurgico Realizado", valor: "Colecistectomia videolaparoscópica", status: "conforme" },
        { item: "Unidade Funcional", valor: "8º NORTE", status: "conforme" },
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
            { item: "HDA", valor: "", status: "nao_conforme", observacao: "Campo ausente na descrição (#HDA)" },
            { item: "HD / CID", valor: "COLELITIASE COM COLECISTITE AGUDA | K81.0", status: "conforme" },
            { item: "Antecedentes Pessoais", valor: "HAS", status: "conforme" },
            { item: "Antecedentes Familiares", valor: "", status: "nao_conforme", observacao: "Campo ausente na descrição (#AF)" },
            { item: "Antecedentes Pessoais", valor: "", status: "nao_conforme", observacao: "Campo ausente na descrição" },
            { item: "Exame Físico", valor: "Presente", status: "conforme" },
            { item: "Conduta Terapêutica", valor: "Presente", status: "conforme" },
            { item: "Criação Anamnese ≤ 12h", valor: "15/04/2024, 09:15 → 15/04/2024 23:15", status: "nao_conforme", observacao: "Anamnese foi criada 14h após a admissão." },
            { item: "Identificação cronológica adequada", valor: "Presente", status: "conforme" },
          ]
        },
        {
          titulo: "Evolução Médica 1",
          data: "16/04/2024",
          itens: [
            { item: "Evolução Diária", valor: "Presente", status: "conforme" },
            { item: "HD / CID ", valor: "Colecistite aguda com litíase | K81.0", status: "conforme" },
            { item: "Exame Físico", valor: "Presente", status: "conforme" },
            { item: "Condutas", valor: "", status: "nao_conforme", observacao: "Campo ausente na descrição" },
            { item: "Queixas/ Intercorrências", valor: "Dor abdominal, distensão e evolução clínica descritas", status: "conforme" },
            { item: "Identificação cronológica adequada", valor: "", status: "nao_conforme", observacao: "Data e hora ausentes" },
            { item: "Separação adequada entre categorias profissionais", valor: "Sem conteúdo de outra categoria", status: "conforme" },
          ]
        },
        {
          titulo: "Evolução Médica 2",
          data: "17/04/2024",
          itens: [
            { item: "Evolução Diária", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "HD / CID ", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Exame Físico", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Condutas", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausentes" },
            { item: "Queixas/ Intercorrências", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausentes" },
            { item: "Identificação cronológica adequada", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Separação adequada entre categorias profissionais", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausente" },
          ]
        },
        {
          titulo: "Evolução Médica 3",
          data: "18/04/2024",
          itens: [
            { item: "Evolução Diária", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "HD / CID ", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Exame Físico", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Condutas", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausentes" },
            { item: "Queixas/ Intercorrências", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausentes" },
            { item: "Identificação cronológica adequada", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Separação adequada entre categorias profissionais", valor: "Ausente", status: "nao_conforme", observacao: "Registro ausente" },
          ]
        },
      ]
    },
    {
      id: "C",
      titulo: "Cirurgia",
      conformidade: 100,
      total: 8,
      conformes: 8,
      itens: [
        { item: "Especialidade da Cirurgia", valor: "Cirurgia Geral", status: "conforme" },
        { item: "Unidade Funcional", valor: "Bloco Cirúrgico", status: "conforme" },
        { item: "Data da Cirurgia", valor: "16/04/2024", status: "conforme" },
        { item: "Início da Cirurgia", valor: "11:20", status: "conforme" },
        { item: "Fim da Cirurgia", valor: "12:45", status: "conforme" },
        { item: "CID do Procedimento", valor: "K81.0", status: "conforme" },
        { item: "Procedimento realizado", valor: "Colecistectomia videolaparoscópica", status: "conforme" },
        { item: "Técnica Cirúrgica", valor: "Itens identificados na descrição cirúrgica - Posicionamento cirúrgico, Tipo anestésico, Antissepsia e campos estéreis, Técnica de pneumoperitônio, Número e tamanho de trocateres,Achados intraoperatórios, Retirada da vesícula biliar, Eletrocauterização, Síntese da pele, Curativo oclusivo", status: "conforme" },
        { item: "Uso de OPME", valor: "", status: "nao_aplicavel" },
        { item: "Curativo Cirúrgico", valor: "Curativo oclusivo em incisões de trocateres", status: "conforme" }
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
            { item: "HDA", valor: "COLELITÍASE COM COLECISTITE AGUDA", status: "conforme" },
            { item: "HD/CID", valor: "COLELITÍASE COM COLECISTITE AGUDA | K81.0", status: "conforme" },
            { item: "Antecedentes Pessoais", valor: "Presente", status: "conforme" },
            { item: "Antecedentes Familiares", valor: "", status: "nao_conforme", observacao: "Antecedentes familiares ausentes" },
            { item: "Exame Físico", valor: "Presente", status: "conforme" },
            { item: "Escala de Braden", valor: "BRADEN 18", status: "conforme" },
            { item: "Escala de Morse", valor: "MORSE 55", status: "conforme" },
            { item: "Conduta terapêutica", valor: "Presente", status: "conforme" },
            { item: "Criação Anamnese Enf. ≤ 12h", valor: "Dentro do prazo", status: "conforme" }
          ]
        },
        {
          titulo: "Evolução Enfermagem 1",
          data: "16/04/2024",
          itens: [
            { item: "HD/CID", valor: "COLELITÍASE COM COLESTITIS AGUDA | K81.0", status: "conforme" },
            { item: "Exame Físico Completo", valor: "Presente e detalhado", status: "conforme" },
            { item: "Condutas Realizadas", valor: "", status: "nao_conforme", observacao: "Condutas ausente" },
            { item: "Escala de Braden", valor: "", status: "nao_conforme", observacao: "Escala de Braden ausente" },
            { item: "Escala de Morse", valor: "", status: "nao_conforme", observacao: "Escala de Morse ausente" },
            { item: "Curativo", valor: "", status: "nao_aplicavel" },
            { item: "Identificação cronológica adequada", valor: "", status: "nao_conforme", observacao: "Data e hora da evolução ausente" }
          ]
        },
        {
          titulo: "Evolução Enfermagem 2",
          data: "17/04/2024",
          itens: [
            { item: "HD/CID", valor: "COLELITÍASE COM COLESTITIS AGUDA | K81.0", status: "conforme" },
            { item: "Exame Físico Completo", valor: "Presente", status: "conforme" },
            { item: "Condutas Realizadas", valor: "Presente", status: "conforme" },
            { item: "Escala de Braden", valor: "BRADEN 20", status: "conforme" },
            { item: "Escala de Morse", valor: "MORSE 25", status: "conforme" },
            { item: "Curativo", valor: "", status: "nao_aplicavel" },
            { item: "Identificação cronológica adequada", valor: "", status: "nao_conforme", observacao: "Data e hora da evolução ausente" },
          ]
        },
        {
          titulo: "Evolução Enfermagem 3",
          data: "18/04/2024",
          itens: [
            { item: "HD/CID", valor: "", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Exame Físico Completo", valor: "", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Condutas Realizadas", valor: "", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Escala de Braden", valor: "", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Escala de Morse", valor: "", status: "nao_conforme", observacao: "Registro ausente" },
            { item: "Curativo", valor: "", status: "nao_aplicavel" },
            { item: "Identificação cronológica adequada", valor: "", status: "nao_conforme", observacao: "Registro ausente" },
          ]
        },
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
            { item: "Descrição da consulta", valor: "Presente", status: "conforme" },
            { item: "Condutas/procedimentos fisioterapêuticos", valor: "Presente", status: "conforme" },
            { item: "Evolução funcional", valor: "Presente", status: "conforme" },
            { item: "Identificação cronológica adequada", valor: "", status: "nao_conforme", observacao: "Data e hora da evolução ausente" },
          ]
        },
        {
          titulo: "Nutrição",
          data: "",
          itens: [
            { item: "Descrição da consulta", valor: "Presente", status: "conforme" },
            { item: "Tipo de dieta descrito", valor: "Presente", status: "conforme" },
            { item: "Evolução nutricional", valor: "Presente", status: "conforme" },
            { item: "Orientação nutricional", valor: "Presente", status: "conforme" },
            { item: "Dieta enteral/parenteral", valor: "", status: "nao_aplicavel" },
            { item: "Identificação cronológica adequada", valor: "", status: "nao_conforme", observacao: "Data e hora da evolução ausente" },
          ]
        },
        {
          titulo: "Terapia Ocupacional (TO)",
          data: "",
          itens: [{ item: "Registro de Terapia Ocupacional", valor: "", status: "nao_aplicavel" }]
        },
        {
          titulo: "Psicologia",
          data: "",
          itens: [{ item: "Registro de Psicologia", valor: "", status: "nao_aplicavel" }]
        },
        {
          titulo: "Fonoaudiologia",
          data: "",
          itens: [{ item: "Registro de Fonoaudiologia", valor: "", status: "nao_aplicavel" }]
        },
        {
          titulo: "Serviço Social",
          data: "",
          itens: [{ item: "Registro de Serviço Social", valor: "", status: "nao_aplicavel" }]
        },
        {
          titulo: "Farmácia Clínica",
          data: "",
          itens: [{ item: "Registro de Farmácia Clínica", valor: "", status: "nao_aplicavel" }]
        }
      ]
    },
  ],
  quantitativo: [
    { tipo: "Anamnese Médica", "19/11": true, "20/11": false, "21/11": false, total: 1, conformidade: 100 },
    { tipo: "Anamnese Enfermagem", "19/11": true, "20/11": false, "21/11": false, total: 1, conformidade: 87.5 },
    { tipo: "Evolução Médica", "19/11": false, "20/11": true, "21/11": false, total: 1, conformidade: 50 },
    { tipo: "Evolução Enfermagem", "19/11": true, "20/11": true, "21/11": true, total: 3, conformidade: 100 },
    { tipo: "Serviço Social", "19/11": false, "20/11": true, "21/11": false, total: 1, conformidade: 100 },
  ],
  nao_conformidades: [
    { secao: "B", item: "Evolução Médica Diária", descricao: "Evolução médica ausente no 3º dia de internação" },
    { secao: "C", item: "CID do Procedimento Cirúrgico", descricao: "CID ausente na descrição cirúrgica" },
    { secao: "D", item: "Antecedentes Familiares — Anamnese de Enfermagem", descricao: "AF não registrado pela equipe de enfermagem" },
  ]
}

const EXAMPLE_INPUT_2 = `[
  {
    "Prontuário": "12.345.678",
    "Atendimento": "8.765.432",
    "Data De Nascimento pact": "25/12/1988",
    "Data da internação": "20/05/2024, 08:00",
    "Data de saída": "22/05/2024, 14:00",
    "Data de óbito": "",
    "Sexo": "M",
    "Código Sus pact": "123.456.789",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "Apendicectomia videolaparoscópica",
    "Procedimento Interno Realizado": "Apendicectomia videolaparoscópica",
    "Cid procedimento": "K35.8",
    "Data Inicio Cirurgia": "20/05/2024, 14:30",
    "Data Fim Cirurgia": "20/05/2024, 15:45",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "4º ANDAR",
    "Utilizou O2?": "Não",
    "Usou Antibiótico Profilático?": "Sim",
    "Seguiu protoc Cirurgia Segura?": "Sim",
    "Categoria Profissional": "MEDICINA",
    "Tipo do registro": "Anamnese",
    "criacao_anamnsese": "20/05/2024, 10:30",
    "Descricao do registro": "#HDA: Dor abdominal de início súbito em região periumbilical que migrou para fossa ilíaca direita, associada a anorexia e náuseas. #EXAME FÍSICO: Abdômen doloroso à palpação profunda em fossa ilíaca direita, com sinal de Blumberg presente. Afebril. #CD: Apendicite aguda. Indicada apendicectomia videolaparoscópica de urgência.",
    "Descrição Cirurgica": "1. Decúbito dorsal. Anestesia geral. 2. Pneumoperitônio por técnica fechada. 3. Trocartes em cicatriz umbilical e fossas ilíacas. 4. Apêndice cecal edemaciado com fibrina em ponta. 5. Apendicectomia com ligadura da base. 6. Sem intercorrências. Pele suturada. Curativo simples."
  },
  {
    "Prontuário": "12.345.678",
    "Atendimento": "8.765.432",
    "Data De Nascimento pact": "25/12/1988",
    "Data da internação": "20/05/2024, 08:00",
    "Data de saída": "22/05/2024, 14:00",
    "Sexo": "M",
    "Categoria Profissional": "MEDICINA",
    "Tipo do registro": "Evolução",
    "Descricao do registro": "1º PO de apendicectomia. Paciente refere melhora importante da dor abdominal, deambulando, tolerando dieta líquida sem náuseas. Sinais vitais estáveis. Abdômen pouco doloroso na região dos trocartes. Sem sinais de infecção. Conduta: Alta hospitalar programada."
  }
]`

const EXAMPLE_OUTPUT_2 = {
  prontuario: "12.345.678",
  conformidade_geral: 100.0,
  secoes: [
    {
      id: "A",
      titulo: "Identificação do Atendimento",
      conformidade: 100,
      total: 9,
      conformes: 9,
      itens: [
        { item: "Nome do Paciente", valor: "Pedro Souza", status: "conforme" },
        { item: "Número do Prontuário", valor: "12.345.678", status: "conforme" },
        { item: "Número do Atendimento", valor: "8.765.432", status: "conforme" },
        { item: "Data de Nascimento", valor: "25/12/1988", status: "conforme" },
        { item: "Data de Internação", valor: "20/05/2024", status: "conforme" },
        { item: "Data de Alta", valor: "22/05/2024", status: "conforme" },
        { item: "Sexo", valor: "Masculino", status: "conforme" },
        { item: "Idade", valor: "35 anos", status: "conforme" },
        { item: "Dias de Internação", valor: "2 dias", status: "conforme" }
      ]
    },
    {
      id: "B",
      titulo: "Anamneses e Evoluções Médicas",
      conformidade: 100,
      total: 16,
      conformes: 16,
      subgrupos: [
        {
          titulo: "Anamnese Médica",
          data: "20/05/2024, 10:30",
          itens: [
            { item: "HDA", valor: "Dor em FID, náuseas", status: "conforme" },
            { item: "HD / CID", valor: "Apendicite aguda | K35.8", status: "conforme" },
            { item: "Antecedentes Pessoais", valor: "Negativos", status: "conforme" },
            { item: "Exame Físico", valor: "Blumberg presente", status: "conforme" },
            { item: "Conduta Terapêutica", valor: "Cirurgia de urgência", status: "conforme" },
            { item: "Criação Anamnese ≤ 12h", valor: "Dentro do prazo", status: "conforme" },
            { item: "Identificação cronológica adequada", valor: "Presente", status: "conforme" }
          ]
        },
        {
          titulo: "Evolução Médica 1",
          data: "21/05/2024",
          itens: [
            { item: "Evolução Diária", valor: "1º PO sem queixas", status: "conforme" },
            { item: "HD / CID ", valor: "K35.8", status: "conforme" },
            { item: "Exame Físico", valor: "Afebril, abdômen flácido", status: "conforme" },
            { item: "Condutas", valor: "Manter analgesia", status: "conforme" },
            { item: "Queixas/ Intercorrências", valor: "Sem queixas", status: "conforme" },
            { item: "Identificação cronológica adequada", valor: "Presente", status: "conforme" },
            { item: "Separação adequada entre categorias profissionais", valor: "Conforme", status: "conforme" }
          ]
        },
        {
          titulo: "Evolução Médica 2",
          data: "22/05/2024",
          itens: [
            { item: "Evolução Diária", valor: "Alta hospitalar", status: "conforme" },
            { item: "Identificação cronológica adequada", valor: "Presente", status: "conforme" }
          ]
        }
      ]
    },
    {
      id: "C",
      titulo: "Cirurgia",
      conformidade: 100,
      total: 6,
      conformes: 6,
      itens: [
        { item: "Início da Cirurgia", valor: "14:30", status: "conforme" },
        { item: "Fim da Cirurgia", valor: "15:45", status: "conforme" },
        { item: "CID do Procedimento", valor: "K35.8", status: "conforme" },
        { item: "Procedimento realizado", valor: "Apendicectomia videolaparoscópica", status: "conforme" },
        { item: "Técnica Cirúrgica", valor: "Apendicectomia por laparoscopia", status: "conforme" },
        { item: "Uso de OPME", valor: "", status: "nao_aplicavel" },
        { item: "Curativo Cirúrgico", valor: "Curativo simples", status: "conforme" }
      ]
    },
    {
      id: "D",
      titulo: "Anamnese e Evoluções de Enfermagem",
      conformidade: 100,
      total: 16,
      conformes: 16,
      subgrupos: [
        {
          titulo: "Anamnese Enfermagem",
          data: "20/05/2024, 11:15",
          itens: [
            { item: "HDA", valor: "Dor em abdômen", status: "conforme" },
            { item: "HD/CID", valor: "Apendicite aguda", status: "conforme" },
            { item: "Antecedentes Pessoais", valor: "Negativos", status: "conforme" },
            { item: "Exame Físico", valor: "Presente", status: "conforme" },
            { item: "Escala de Braden", valor: "Braden 23", status: "conforme" },
            { item: "Escala de Morse", valor: "Morse 0", status: "conforme" },
            { item: "Conduta terapêutica", valor: "Acompanhamento cirúrgico", status: "conforme" },
            { item: "Criação Anamnese Enf. ≤ 12h", valor: "Dentro do prazo", status: "conforme" }
          ]
        },
        {
          titulo: "Evolução Enfermagem 1",
          data: "21/05/2024",
          itens: [
            { item: "HD/CID", valor: "K35.8", status: "conforme" },
            { item: "Exame Físico Completo", valor: "Conforme", status: "conforme" },
            { item: "Condutas Realizadas", valor: "Medicações administradas", status: "conforme" },
            { item: "Escala de Braden", valor: "Braden 23", status: "conforme" },
            { item: "Escala de Morse", valor: "Morse 0", status: "conforme" },
            { item: "Curativo", valor: "", status: "nao_aplicavel" },
            { item: "Identificação cronológica adequada", valor: "Presente", status: "conforme" }
          ]
        },
        {
          titulo: "Evolução Enfermagem 2",
          data: "22/05/2024",
          itens: [
            { item: "HD/CID", valor: "K35.8", status: "conforme" },
            { item: "Exame Físico Completo", valor: "Conforme", status: "conforme" },
            { item: "Identificação cronológica adequada", valor: "Presente", status: "conforme" }
          ]
        }
      ]
    },
    {
      id: "E",
      titulo: "Outras Categorias Profissionais",
      conformidade: 100,
      total: 2,
      conformes: 2,
      subgrupos: [
        {
          titulo: "Fisioterapia",
          data: "21/05/2024",
          itens: [
            { item: "Descrição da consulta", valor: "Fisioterapia motora", status: "conforme" },
            { item: "Evolução funcional", valor: "Deambulação precoce incentivada", status: "conforme" }
          ]
        },
        {
          titulo: "Serviço Social",
          data: "",
          itens: [{ item: "Registro de Serviço Social", valor: "", status: "nao_aplicavel" }]
        }
      ]
    }
  ]
}

const EXAMPLES = [
  {
    id: "1",
    name: "Prontuário 58.907.003 (Colecistite)",
    input: EXAMPLE_INPUT,
    output: EXAMPLE_OUTPUT
  },
  {
    id: "2",
    name: "Prontuário 12.345.678 (Apendicite)",
    input: EXAMPLE_INPUT_2,
    output: EXAMPLE_OUTPUT_2
  }
]

function simulateAudit(jsonText) {
  try { JSON.parse(jsonText) } catch { return null }

  const output = JSON.parse(JSON.stringify(EXAMPLE_OUTPUT))

  output.secoes.forEach(sec => {
    if (sec.subgrupos) {
      sec.subgrupos.forEach(sub => {
        if (sub.itens && !Array.isArray(sub.itens)) {
          sub.itens = [sub.itens]
        }
      })
    } else if (sec.itens && !Array.isArray(sec.itens)) {
      sec.itens = [sec.itens]
    }

    const relevantItens = sec.subgrupos
      ? sec.subgrupos.flatMap(sub => sub.itens || [])
      : (sec.itens || [])

    const applicableItens = relevantItens.filter(it => it.status === 'conforme' || it.status === 'nao_conforme')
    const total = applicableItens.length
    const conformes = applicableItens.filter(it => it.status === 'conforme').length

    sec.total = total
    sec.conformes = conformes
    sec.conformidade = total > 0 ? Math.round((conformes / total) * 1000) / 10 : 100
  })

  const overallTotal = output.secoes.reduce((acc, sec) => acc + sec.total, 0)
  const overallConformes = output.secoes.reduce((acc, sec) => acc + sec.conformes, 0)
  output.conformidade_geral = overallTotal > 0 ? Math.round((overallConformes / overallTotal) * 1000) / 10 : 100

  // Dynamic quantitativo calculation
  const days = ['15/04', '16/04', '17/04', '18/04']
  output.days = days

  const getSubgroupData = (secId, titleSub) => {
    const sec = output.secoes.find(s => s.id === secId)
    if (!sec) return []
    return sec.subgrupos 
      ? sec.subgrupos.filter(sub => sub.titulo.toLowerCase().includes(titleSub.toLowerCase()))
      : []
  }

  const buildQuantitativoRow = (tipo, secId, titleSub, isEvolution) => {
    const subs = getSubgroupData(secId, titleSub)
    const row = { tipo }
    let presentCount = 0
    let totalApp = 0
    let totalConf = 0

    days.forEach(d => {
      const subForDay = subs.find(sub => (sub.data && sub.data.includes(d)) || sub.titulo.includes(d))
      if (subForDay) {
        let isPresent = false
        if (isEvolution) {
          const isAbsent = subForDay.itens.every(it => it.status === 'nao_conforme' && (it.valor === 'Ausente' || it.observacao === 'Registro ausente'))
          isPresent = !isAbsent
        } else {
          isPresent = true
        }

        row[d] = isPresent
        if (isPresent) presentCount++

        const app = subForDay.itens.filter(it => it.status === 'conforme' || it.status === 'nao_conforme')
        totalApp += app.length
        totalConf += app.filter(it => it.status === 'conforme').length
      } else {
        row[d] = false
      }
    })

    row.total = presentCount
    row.conformidade = totalApp > 0 ? Math.round((totalConf / totalApp) * 1000) / 10 : 100
    return row
  }

  output.quantitativo = [
    buildQuantitativoRow('Anamnese Médica', 'B', 'Anamnese Médica', false),
    buildQuantitativoRow('Anamnese Enfermagem', 'D', 'Anamnese Enfermagem', false),
    buildQuantitativoRow('Evolução Médica', 'B', 'Evolução Médica', true),
    buildQuantitativoRow('Evolução Enfermagem', 'D', 'Evolução Enfermagem', true),
    buildQuantitativoRow('Serviço Social', 'E', 'Serviço Social', false),
  ]

  const dynamicNaoConformidades = []
  output.secoes.forEach(sec => {
    if (sec.subgrupos) {
      sec.subgrupos.forEach(sub => {
        sub.itens.forEach(it => {
          if (it.status === 'nao_conforme') {
            dynamicNaoConformidades.push({
              secao: sec.id,
              item: `${sub.titulo} — ${it.item}`,
              descricao: it.observacao || 'Registro não conforme'
            })
          }
        })
      })
    } else if (sec.itens) {
      sec.itens.forEach(it => {
        if (it.status === 'nao_conforme') {
          dynamicNaoConformidades.push({
            secao: sec.id,
            item: it.item,
            descricao: it.observacao || 'Registro não conforme'
          })
        }
      })
    }
  })
  output.nao_conformidades = dynamicNaoConformidades

  return output
}

const statusCfg = {
  conforme: { label: 'Conforme', color: '#00e676', bg: '#0d2b1a', border: '#00e67630' },
  nao_conforme: { label: 'Não Conforme', color: '#ff5252', bg: '#2b0d0d', border: '#ff525230' },
  nao_se_aplica: { label: 'Não se aplica', color: '#00d4ff', bg: '#002538', border: '#00d4ff30' },
  nao_aplicavel: { label: 'Não se aplica', color: '#00d4ff', bg: '#002538', border: '#00d4ff30' },
}

function ScoreRing({ value, size = 120, stroke = 9 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  const color = value >= 90 ? '#00e676' : value >= 75 ? '#ffd740' : '#ff5252'

  const valFontSize = size >= 120 ? 24 : size >= 90 ? 18 : 9
  const labelVisible = size >= 90

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1c2330" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.1 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: valFontSize, fontWeight: 600, color, whiteSpace: 'nowrap' }}>{value}%</span>
        {labelVisible && <span style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>geral</span>}
      </div>
    </div>
  )
}

function Badge({ status }) {
  const c = statusCfg[status] || statusCfg.conforme
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      fontSize: 11, padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
    }}>
      {c.label}
    </span>
  )
}

function Section({ sec, defaultOpen = false, isMobile }) {
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    setOpen(defaultOpen)
  }, [defaultOpen])

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'var(--bg3)', border: 'none', padding: isMobile ? '10px 12px' : '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)',
          background: 'var(--bg4)', padding: '2px 6px', borderRadius: 5, flexShrink: 0
        }}>
          {sec.id}
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', flex: 1, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span>{sec.titulo}</span>
          <span style={{
            fontSize: 10,
            fontWeight: 500,
            color: 'var(--text3)',
            background: 'var(--bg4)',
            padding: '2px 6px',
            borderRadius: 6,
            fontFamily: 'var(--mono)',
            whiteSpace: 'nowrap'
          }}>
            {sec.conformes}/{sec.total} ({sec.conformidade}%)
          </span>
        </span>
        <ScoreRing value={sec.conformidade} size={36} stroke={4} />
        <span style={{ color: 'var(--text3)', fontSize: 14, marginLeft: 2 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ background: 'var(--bg2)', padding: isMobile ? '10px 8px' : '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sec.subgrupos ? (
            sec.subgrupos.map((sub, sIdx) => (
              <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  fontFamily: 'var(--sans)',
                  marginTop: sIdx > 0 ? 10 : 0,
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span style={{ width: 3, height: 11, borderRadius: 2, background: 'var(--accent)' }} />
                  {sub.titulo}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {sub.itens.map((it, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '1fr auto', gap: 8,
                      background: 'var(--bg3)', border: '1px solid var(--border)',
                      borderLeft: `3px solid ${statusCfg[it.status]?.color || '#00e676'}`,
                      borderRadius: 7, padding: isMobile ? '8px 10px' : '10px 14px',
                    }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>{it.item}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)', wordBreak: 'break-word' }}>{it.valor}</div>
                        {it.observacao && (
                          <div style={{ fontSize: 10, color: '#ffd740', marginTop: 4, opacity: 0.9 }}>⚠ {it.observacao}</div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Badge status={it.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sec.itens.map((it, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 8,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderLeft: `3px solid ${statusCfg[it.status]?.color || '#00e676'}`,
                  borderRadius: 7, padding: isMobile ? '8px 10px' : '10px 14px',
                }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>{it.item}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)', wordBreak: 'break-word' }}>{it.valor}</div>
                    {it.observacao && (
                      <div style={{ fontSize: 10, color: '#ffd740', marginTop: 4, opacity: 0.9 }}>⚠ {it.observacao}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge status={it.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ResultCard({ r, isMobile }) {
  const [tab, setTab] = useState('secoes')
  const days = r.days || ['19/11', '20/11', '21/11']

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '2px 12px 12px 12px' }}>

      {/* Header score */}
      <div style={{
        padding: isMobile ? '16px 12px' : '24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-start',
        gap: isMobile ? '16px' : '24px',
        flexWrap: 'wrap',
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <ScoreRing value={r.conformidade_geral} size={isMobile ? 100 : 130} stroke={isMobile ? 8 : 10} />
        <div style={{ flex: isMobile ? 'none' : 1, minWidth: isMobile ? '100%' : 200, display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 6 }}>
            prontuário {r.prontuario}
          </div>
          <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, marginBottom: isMobile ? 0 : 12, letterSpacing: '-0.02em' }}>
            Relatório de Auditoria
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {r.secoes.map(s => {
                const color = s.conformidade >= 90 ? '#00e676' : s.conformidade >= 75 ? '#ffd740' : '#ff5252'
                const bg = s.conformidade >= 90 ? '#0d2b1a' : s.conformidade >= 75 ? '#2b2000' : '#2b0d0d'
                return (
                  <div key={s.id} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 8, padding: '7px 12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>Seção {s.id}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 600, color }}>{s.conformidade}%</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 16px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {[['secoes', 'Seções'], ['quantitativo', 'Quantitativo'], ['nao_conformidades', 'Não Conformidades']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: 'none', border: 'none', borderBottom: tab === k ? '2px solid var(--accent)' : '2px solid transparent',
            color: tab === k ? 'var(--accent)' : 'var(--text2)',
            padding: isMobile ? '10px 8px' : '10px 14px',
            fontSize: isMobile ? 11 : 12,
            fontFamily: 'var(--mono)', cursor: 'pointer',
            transition: 'color 0.15s',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: isMobile ? '12px 8px' : '16px' }}>

        {tab === 'secoes' && (
          <div>
            {r.secoes.map((s, i) => <Section key={s.id} sec={s} defaultOpen={!isMobile && i === 0} isMobile={isMobile} />)}
          </div>
        )}

        {tab === 'quantitativo' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: isMobile ? '6px 8px' : '8px 12px', color: 'var(--text2)', fontWeight: 500 }}>Tipo de Registro</th>
                  {days.map(d => <th key={d} style={{ padding: isMobile ? '6px 4px' : '8px 12px', color: 'var(--text2)', fontWeight: 500 }}>{d}</th>)}
                  <th style={{ padding: isMobile ? '6px 4px' : '8px 12px', color: 'var(--text2)', fontWeight: 500 }}>Total</th>
                  <th style={{ padding: isMobile ? '6px 8px' : '8px 12px', color: 'var(--text2)', fontWeight: 500 }}>Conform.</th>
                </tr>
              </thead>
              <tbody>
                {r.quantitativo.map((row, i) => {
                  const c = row.conformidade >= 90 ? '#00e676' : row.conformidade >= 75 ? '#ffd740' : '#ff5252'
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg3)' : 'transparent' }}>
                      <td style={{ padding: isMobile ? '8px 8px' : '10px 12px', color: 'var(--text)' }}>{row.tipo}</td>
                      {days.map(d => (
                        <td key={d} style={{ padding: isMobile ? '8px 4px' : '10px 12px', textAlign: 'center', fontSize: 14 }}>
                          {row[d] ? <span style={{ color: '#00e676' }}>✓</span> : <span style={{ color: 'var(--text3)' }}>—</span>}
                        </td>
                      ))}
                      <td style={{ padding: isMobile ? '8px 4px' : '10px 12px', textAlign: 'center', color: 'var(--text)' }}>{row.total}</td>
                      <td style={{ padding: isMobile ? '8px 8px' : '10px 12px', textAlign: 'center', color: c, fontWeight: 600, whiteSpace: 'nowrap' }}>{row.conformidade}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'nao_conformidades' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {r.nao_conformidades.length === 0
              ? <div style={{ color: '#00e676', fontSize: 13, padding: '16px', textAlign: 'center' }}>✓ Nenhuma não conformidade encontrada</div>
              : r.nao_conformidades.map((nc, i) => (
                <div key={i} style={{ background: '#2b0d0d', border: '1px solid #ff525230', borderLeft: '3px solid #ff5252', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, background: '#ff525220', color: '#ff5252', padding: '2px 8px', borderRadius: 5 }}>
                      Seção {nc.secao}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{nc.item}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{nc.descricao}</div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}

function UserMessage({ content, isMobile }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = content.length > 150

  let recordCount = 0
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) recordCount = parsed.length
  } catch (e) { }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
      <div style={{
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: '12px 12px 2px 12px', padding: '12px 16px',
        maxWidth: isMobile ? '95%' : '80%', width: '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--mono)' }}>prontuário enviado</span>
          {recordCount > 0 && (
            <span style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
              {recordCount} registro{recordCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <pre style={{
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)',
            whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            maxHeight: expanded ? 'none' : (isMobile ? '60px' : '100px'),
            overflowY: 'hidden', margin: 0
          }}>
            {content}
          </pre>
          {!expanded && isLong && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '24px',
              background: 'linear-gradient(to bottom, transparent, var(--bg3))',
              pointerEvents: 'none'
            }} />
          )}
        </div>
        {isLong && (
          <button onClick={() => setExpanded(e => !e)} style={{
            background: 'none', border: 'none', color: 'var(--accent)',
            fontSize: 11, fontFamily: 'var(--mono)', cursor: 'pointer',
            marginTop: 6, padding: 0, display: 'flex', alignItems: 'center', gap: 4
          }}>
            {expanded ? '▲ recolher' : '▼ expandir prontuário'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 600 : false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 600)
    const handleResize = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  function loadExample() {
    setInput(EXAMPLE_INPUT)
    textareaRef.current?.focus()
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 2200))
    const result = simulateAudit(text)
    setMessages(prev => [...prev, result
      ? { role: 'assistant', type: 'result', content: result }
      : { role: 'assistant', type: 'error', content: 'JSON inválido. Verifique a estrutura e tente novamente.' }
    ])
    setLoading(false)
  }

  function handleKey(e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend() }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <header style={{
        borderBottom: '1px solid var(--border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg2)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent) 0%, #0066aa 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17
        }}>⚕</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>Auditor de Prontuários</div>
          <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>CFM · LGPD · RDC 63/2011</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e676', boxShadow: '0 0 6px #00e676' }} />
          <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>sistema ativo</span>
        </div>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 10px' : '24px 16px', maxWidth: 900, width: '100%', margin: '0 auto' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: isMobile ? '30px 0 20px' : '60px 0 40px' }}>
            <div style={{ fontSize: isMobile ? 36 : 48, marginBottom: 16 }}>📋</div>
            <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.03em' }}>
              Auditoria Inteligente de Prontuários
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: isMobile ? 13 : 14, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Cole o array JSON com os registros do atendimento. A IA analisará todas as seções — identificação, anamneses, cirurgia e enfermagem.
            </p>
            <button onClick={loadExample} style={{
              background: 'transparent', border: '1px solid var(--border2)',
              color: 'var(--text2)', padding: '10px 20px', borderRadius: 8,
              fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseOver={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
              onMouseOut={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text2)' }}>
              carregar exemplo →
            </button>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.role === 'user') return (
            <UserMessage key={i} content={msg.content} isMobile={isMobile} />
          )
          if (msg.type === 'error') return (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{
                background: '#2b0d0d', border: '1px solid var(--red)',
                borderRadius: '2px 12px 12px 12px', padding: '12px 16px', color: 'var(--red)', fontSize: 13
              }}>
                ⚠ {msg.content}
              </div>
            </div>
          )
          if (msg.type === 'result') return (
            <div key={i} style={{ marginBottom: 24 }}><ResultCard r={msg.content} isMobile={isMobile} /></div>
          )
          return null
        })}

        {loading && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '2px 12px 12px 12px', padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                    animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                analisando prontuário — verificando seções A→F...
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: isMobile ? '10px' : '16px', position: 'sticky', bottom: 0 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
            <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              readOnly={input === EXAMPLE_INPUT}
              placeholder={isMobile ? 'Cole o JSON do atendimento...' : 'Cole o array JSON com os registros do atendimento...'}
              rows={isMobile ? 3 : 4}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: input === EXAMPLE_INPUT ? 'var(--text2)' : 'var(--text)',
                cursor: input === EXAMPLE_INPUT ? 'not-allowed' : 'text',
                fontFamily: 'var(--mono)', fontSize: 12,
                padding: '14px 16px', resize: 'none', lineHeight: 1.6
              }} />
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderTop: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', gap: isMobile ? 4 : 8 }}>
                <button onClick={loadExample} style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text2)', padding: isMobile ? '5px 8px' : '5px 12px', borderRadius: 6,
                  fontSize: 11, fontFamily: 'var(--mono)', cursor: 'pointer', transition: 'all 0.15s'
                }}
                  onMouseOver={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
                  onMouseOut={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)' }}>
                  exemplo
                </button>
                {input && (
                  <button onClick={() => setInput('')} style={{
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text3)', padding: isMobile ? '5px 8px' : '5px 12px', borderRadius: 6,
                    fontSize: 11, fontFamily: 'var(--mono)', cursor: 'pointer'
                  }}>limpar</button>
                )}
                {input === EXAMPLE_INPUT && (
                  <span style={{
                    color: 'var(--yellow)',
                    fontSize: 10,
                    fontFamily: 'var(--mono)',
                    alignSelf: 'center',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2,
                    padding: '2px 6px',
                    background: 'var(--yellow2)',
                    border: '1px solid #ffd74020',
                    borderRadius: 4
                  }}>
                    🔒 {isMobile ? 'Exemplo' : 'Exemplo (Leitura)'}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10 }}>
                {!isMobile && <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Ctrl+Enter</span>}
                <button onClick={handleSend} disabled={!input.trim() || loading} style={{
                  background: input.trim() && !loading ? 'var(--accent)' : 'var(--bg4)',
                  border: 'none', color: input.trim() && !loading ? '#000' : 'var(--text3)',
                  padding: isMobile ? '6px 12px' : '7px 18px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  transition: 'all 0.15s', fontFamily: 'var(--sans)'
                }}>
                  {loading ? 'analisando...' : 'Auditar →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  )
}
