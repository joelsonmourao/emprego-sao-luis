import re
from pathlib import Path

import pandas as pd
import json
import time


def clean_html_description(text: str, boilerplate_re: re.Pattern[str]) -> str:
    value = "" if pd.isna(text) else str(text)
    value = re.sub(r"\s+", " ", value)
    value = boilerplate_re.sub(" ", value)
    value = re.sub(r"\(vaga\s+[A-Z0-9\-]+\)", " ", value, flags=re.IGNORECASE)
    value = re.sub(r"informa[cç][aã]o vinculada [^\.]*\.", " ", value, flags=re.IGNORECASE)
    value = re.sub(r"\s{2,}", " ", value).strip()
    return value


def is_informative(text: str, missing_re: re.Pattern[str]) -> bool:
    value = "" if pd.isna(text) else str(text)
    return len(value) >= 15 and not bool(missing_re.search(value))


def normalize_title(row: pd.Series) -> str:
    title = re.sub(r"^vaga\s+de\s+", "", str(row.get("title", "") or ""), flags=re.IGNORECASE).strip()
    city = str(row.get("city", "") or "")
    state = str(row.get("state", "") or "")
    if city and state and (city.lower() not in title.lower() or state.lower() not in title.lower()):
        return f"{title} em {city} - {state}"
    return title


def normalize_text(value: object) -> str:
    return str(value).lower().strip()


def build_review_reason(row: pd.Series) -> str:
    reasons: list[str] = []
    if not row["requirements_ok"]:
        reasons.append("requisitos fracos/ausentes")
    if not row["benefits_ok"]:
        reasons.append("beneficios fracos/ausentes")
    if not row["description_ok"]:
        reasons.append("descricao curta/generica")
    if not row["has_apply_url"]:
        reasons.append("applyUrl invalida")
    if not row["has_location"]:
        reasons.append("cidade/estado ausentes")
    return "; ".join(reasons)


# region agent log
def debug_log(run_id: str, hypothesis_id: str, location: str, message: str, data: dict) -> None:
    payload = {
        "sessionId": "582712",
        "runId": run_id,
        "hypothesisId": hypothesis_id,
        "location": location,
        "message": message,
        "data": data,
        "timestamp": int(time.time() * 1000),
    }
    with open("debug-582712.log", "a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload, ensure_ascii=False) + "\n")
# endregion


def main() -> None:
    run_id = "run-location-indicators-fix"
    input_path = Path(r"C:\Users\Joelson\Downloads\vagas_indeed_aprendiz_sem_repeticao_neutra.xlsx")
    output_path = input_path.with_name("vagas_indeed_aprendiz_sem_repeticao_neutra_jobposting_otimizada.xlsx")

    df = pd.read_excel(input_path)
    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = df[col].fillna("").astype(str).str.strip()

    missing_re = re.compile(
        r"nao foram identificados|não foram identificados|nao informado|não informado|nao informados|não informados|"
        r"nao detalha|não detalha|informacao vinculada|informação vinculada",
        re.IGNORECASE,
    )
    boilerplate_re = re.compile(
        r"o site jovem aprendiz vagas.*?processo seletivo\.|"
        r"antes de se candidatar.*?oportunidade\.|"
        r"conte[uú]do tem car[aá]ter informativo.*?oportunidade\.|"
        r"esta p[aá]gina divulga.*?vaga\.|"
        r"esta publica[cç][aã]o apresenta.*?vaga\.|"
        r"consulta r[aá]pida.*?oficial\.|"
        r"informa[cç][oõ]es organizadas.*?consulta\.|"
        r"a vaga est[aá] associada [^\.]*\.[ ]*|"
        r"as informa[cç][oõ]es dispon[ií]veis indicam atua[cç][aã]o [^\.]*\.[ ]*|"
        r"o cadastro foi organizado com base nos dados p[uú]blicos informados [^\.]*\.[ ]*|"
        r"de acordo com os dados dispon[ií]veis, a oportunidade est[aá] relacionada [^\.]*\.[ ]*|"
        r"p[aá]gina com informa[cç][oõ]es.*?candidatura\.|"
        r"veja detalhes.*?consulta\.|"
        r"confira informa[cç][oõ]es organizadas.*?indicada\.",
        re.IGNORECASE,
    )
    location_indicator_re = re.compile(
        r"a vaga est[aá] associada|"
        r"as informa[cç][oõ]es dispon[ií]veis indicam atua[cç][aã]o|"
        r"o cadastro foi organizado com base nos dados p[uú]blicos informados|"
        r"de acordo com os dados dispon[ií]veis, a oportunidade est[aá] relacionada",
        re.IGNORECASE,
    )

    required_cols = [
        "title",
        "city",
        "state",
        "company",
        "applyUrl",
        "sourceUrl",
        "requirements",
        "benefits",
        "description",
        "validThrough",
        "externalId",
        "salaryMin",
        "salaryMax",
    ]
    for col in required_cols:
        if col not in df.columns:
            df[col] = ""

    work = df.copy()
    # region agent log
    pre_matches = int(work["description"].astype(str).str.contains(location_indicator_re, na=False).sum())
    debug_log(
        run_id,
        "H1",
        "optimize_jobposting_sheet.py:pre-clean",
        "Location indicators before cleaning",
        {"rowsWithIndicatorsBefore": pre_matches, "totalRows": int(len(work))},
    )
    # endregion
    work["title_optimized"] = work.apply(normalize_title, axis=1)
    work["description_optimized"] = work["description"].apply(lambda value: clean_html_description(value, boilerplate_re))
    # region agent log
    post_matches = int(work["description_optimized"].astype(str).str.contains(location_indicator_re, na=False).sum())
    debug_log(
        run_id,
        "H1",
        "optimize_jobposting_sheet.py:post-clean",
        "Location indicators after cleaning",
        {"rowsWithIndicatorsAfter": post_matches},
    )
    # endregion
    work["requirements_ok"] = work["requirements"].apply(lambda value: is_informative(value, missing_re))
    work["benefits_ok"] = work["benefits"].apply(lambda value: is_informative(value, missing_re))
    work["description_ok"] = work["description_optimized"].apply(
        lambda value: len(re.sub(r"<[^>]+>", " ", str(value)).strip()) >= 120
    )
    work["has_location"] = work["city"].astype(str).str.strip().ne("") & work["state"].astype(str).str.strip().ne("")
    work["has_company"] = work["company"].astype(str).str.strip().ne("")
    work["has_apply_url"] = work["applyUrl"].astype(str).str.startswith("http")

    for col in ["salaryMin", "salaryMax"]:
        salary = work[col].astype(str).str.replace(".", "", regex=False).str.replace(",", ".", regex=False)
        work[f"{col}_num"] = pd.to_numeric(salary, errors="coerce")
    work["has_salary"] = (
        work["salaryMin_num"].notna()
        & work["salaryMax_num"].notna()
        & (work["salaryMax_num"] >= work["salaryMin_num"])
    )

    work["quality_score"] = (
        work["requirements_ok"].astype(int) * 20
        + work["benefits_ok"].astype(int) * 15
        + work["description_ok"].astype(int) * 25
        + work["has_location"].astype(int) * 10
        + work["has_company"].astype(int) * 10
        + work["has_apply_url"].astype(int) * 10
        + work["has_salary"].astype(int) * 10
    )

    work["dup_key"] = work.apply(
        lambda row: (
            f"{normalize_text(row['title_optimized'])}|{normalize_text(row['company'])}|"
            f"{normalize_text(row['city'])}|{normalize_text(row['state'])}"
        ),
        axis=1,
    )
    work = work.sort_values(["quality_score", "validThrough", "externalId"], ascending=[False, False, True])
    work_unique = work.drop_duplicates(subset=["dup_key"], keep="first").copy()

    approved = work_unique[work_unique["quality_score"] >= 60].copy()
    review = work_unique[work_unique["quality_score"] < 60].copy()
    review["motivo_revisao"] = review.apply(build_review_reason, axis=1)

    all_cols = [
        "externalId",
        "title",
        "title_optimized",
        "company",
        "city",
        "state",
        "description",
        "description_optimized",
        "requirements",
        "benefits",
        "applyUrl",
        "sourceUrl",
        "employmentType",
        "salaryMin",
        "salaryMax",
        "workHours",
        "validThrough",
        "expiresAt",
        "quality_score",
        "requirements_ok",
        "benefits_ok",
        "description_ok",
        "motivo_revisao",
    ]
    for col in all_cols:
        if col not in approved.columns:
            approved[col] = ""
        if col not in review.columns:
            review[col] = ""

    approved = approved[[col for col in all_cols if col != "motivo_revisao"]]
    review = review[all_cols]

    with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
        approved.to_excel(writer, sheet_name="jobposting_otimizadas", index=False)
        review.to_excel(writer, sheet_name="revisar", index=False)
        work_unique[["externalId", "quality_score"]].to_excel(writer, sheet_name="resumo", index=False)
    # region agent log
    debug_log(
        run_id,
        "H4",
        "optimize_jobposting_sheet.py:export",
        "Workbook exported",
        {"outputPath": str(output_path), "approvedRows": int(len(approved)), "reviewRows": int(len(review))},
    )
    # endregion

    print(f"Arquivo salvo: {output_path}")
    print(f"Total original: {len(df)}")
    print(f"Total unico: {len(work_unique)}")
    print(f"Otimizadas: {len(approved)}")
    print(f"Revisar: {len(review)}")


if __name__ == "__main__":
    main()
