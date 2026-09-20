"""Regras de prazo do prompt de auditoria.

3.5  Anamnese médica e de enfermagem criada em até 12h após a internação.
3.6  Médicos e enfermeiros evoluem diariamente: uma evolução por janela de 24h, contada a partir da
     data/hora da internação até a alta. A janela do 1º dia é dispensada quando há anamnese nela;
     sem anamnese no 1º dia, a contagem começa na própria internação.
"""
from datetime import datetime, timedelta

PRAZO_ANAMNESE_HORAS = 12
JANELA = timedelta(hours=24)
_FORMATOS = ("%d/%m/%Y, %H:%M", "%d/%m/%Y %H:%M", "%d/%m/%Y")


def parse_datetime(value):
    if not value:
        return None
    text = str(value).strip()
    for fmt in _FORMATOS:
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def _fmt_horas(delta):
    minutos = int(delta.total_seconds() // 60)
    h, m = divmod(minutos, 60)
    return f"{h}h{m:02d}" if m else f"{h}h"


def check_criacao_anamnese(internacao, criacao):
    """Diferença entre a data/hora da internação e a da criação da anamnese (limite: 12h)."""
    dt_int, dt_cri = parse_datetime(internacao), parse_datetime(criacao)
    if dt_int is None or dt_cri is None:
        return "Não registrado"
    delta = dt_cri - dt_int
    if delta > timedelta(hours=PRAZO_ANAMNESE_HORAS):
        return f"não conforme (criada {_fmt_horas(delta)} após a internação; prazo de {PRAZO_ANAMNESE_HORAS}h)"
    return "conforme"


def check_evolucao_diaria(internacao, saida, criacoes_anamnese, criacoes_evolucao):
    """Uma evolução por janela de 24h desde a internação até a alta.

    `criacoes_anamnese` / `criacoes_evolucao`: datas de criação (texto) dos registros da MESMA categoria.
    Retorna 'conforme' ou 'não conforme (sem evolução entre X e Y; ...)'. 'Não registrado' se faltarem datas.
    """
    dt_int, dt_alta = parse_datetime(internacao), parse_datetime(saida)
    if dt_int is None or dt_alta is None or dt_alta <= dt_int:
        return "Não registrado"

    total_janelas = int((dt_alta - dt_int) / JANELA)  # janelas de 24h completas até a alta
    anamnese_no_dia1 = any(
        (dt := parse_datetime(c)) is not None and dt_int <= dt < dt_int + JANELA for c in criacoes_anamnese
    )
    primeira = 1 if anamnese_no_dia1 else 0

    datas = [dt for c in criacoes_evolucao if (dt := parse_datetime(c)) is not None]
    sem_evolucao = []
    for k in range(primeira, total_janelas):
        ini, fim = dt_int + k * JANELA, dt_int + (k + 1) * JANELA
        if not any(ini <= dt < fim for dt in datas):
            sem_evolucao.append(f"{ini:%d/%m %H:%M} e {fim:%d/%m %H:%M}")

    if sem_evolucao:
        return "não conforme (sem evolução entre " + "; entre ".join(sem_evolucao) + ")"
    return "conforme"
