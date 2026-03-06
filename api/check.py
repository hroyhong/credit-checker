from http.server import BaseHTTPRequestHandler
import json
import re


# ============================================================
# 培养方案 Requirements (2022级 英语学院 x 卓越学院 联合培养)
# ============================================================

def build_requirements(zhuo_class, ying_class):
    is_gaofan = zhuo_class == "高翻班"
    platform_credits = 18 if is_gaofan else 12
    zhuo_total = 101 if is_gaofan else 95

    if zhuo_class == "国别班":
        platform_category = {
            "国别区域研究方法课程 (%d学分)" % platform_credits: {
                "_flat": True,
                "required_credits": platform_credits,
                "required_courses": [
                    ("SRPP1002", "区域国别研究导论 (H)", 2),
                    ("SRPP1001", "全球文明史概论 (H)", 2),
                    ("SRPP2001", "区域国别研究理论与方法 (H)", 2),
                    ("SRPP2002", "区域与国际发展：理论与实践 (H)", 2),
                    (None, "国别区域研究经典案例分析 (H)", 2),
                    ("SRPP3002", "政策研究入门 (H)", 2),
                ],
            }
        }
    else:
        label = {"高翻班": "高级翻译方向", "国组班": "国际组织方向", "外交班": "外交外事方向"}[zhuo_class]
        platform_category = {
            "%s课程 (%d学分)" % (label, platform_credits): {
                "_flat": True,
                "required_credits": platform_credits,
                "note": "平台课程，详见%s培养方案" % zhuo_class,
            }
        }

    zhuo_section = {
        "卓越博雅课程 (14学分)": {
            "博雅必修": {
                "required_credits": 6,
                "required_courses": [
                    ("HON.C1001", "Python程序设计基础 (H)", 2),
                    ("HON.C1002", "全媒体讯息设计与传播 (H)", 2),
                    ("HON.C2001", "计算机数据统计与社会科学研究方法 (H)", 2),
                ],
            },
            "博雅选修": {
                "required_credits": 8,
                "note": "历史与哲思/表达与传播/数据与科学/治理与发展模块选修",
            },
        },
        "英语强化课程 (32学分)": {
            "_flat": True,
            "required_credits": 32,
            "required_courses": [
                ("HON.E1001", "人文阅读I (H)", 4),
                ("HON.E1004", "英语叙事文写作 (H)", 2),
                ("HON.E1002", "人文阅读II (H)", 4),
                ("HON.E1003", "演讲的艺术 (H)", 2),
                ("HON.E1005", "英语议论文写作 (H)", 2),
                ("HON.E2002", "人文阅读III (H)", 2),
                ("HON.E2006", "经典文献阅读I (H)", 1),
                ("HON.E2005", "英语辩论 (H)", 2),
                ("HON.E2001", "英语多文体写作 (H)", 2),
                ("HON.E2003", "人文阅读IV (H)", 2),
                ("HON.E2007", "经典文献阅读II (H)", 1),
                ("HON.E2004", "创意写作 (H)", 2),
                ("HON.E3008", "经典文献阅读III (H)", 1),
                ("HON.E3010", "学术写作I (H)", 2),
                ("HON.E3009", "经典文献阅读IV (H)", 1),
                ("HON.E3011", "学术写作II (H)", 2),
            ],
        },
    }
    zhuo_section.update(platform_category)
    zhuo_section.update({
        "国际课程 (4学分)": {
            "_flat": True,
            "required_credits": 4,
            "required_courses": [
                ("HON.C1003", "国际课程 (H)", 4),
            ],
        },
        "卓越实践 (2学分)": {
            "_flat": True,
            "required_credits": 2,
            "note": "根据卓越实践学分认定管理办法认定",
        },
        "创新创业实践 (2学分)": {
            "_flat": True,
            "required_credits": 2,
            "note": "根据创新创业实践学分认定管理办法认定",
        },
    })

    # --- 英语学院 side ---
    if ying_class == "翻译+工管":
        pro_ed_credits = 76
        ying_total = 93
        pro_ed = {
            "工商管理核心课": {
                "required_credits": 31,
                "note": "必修",
            },
            "工商管理方向课": {
                "required_credits": 6,
                "note": "必修",
            },
            "商务数据分析": {
                "required_credits": 3,
                "note": "实践教育模块，必修",
            },
            "英院课程自由选择": {
                "required_credits": 36,
                "note": "大类基础+翻译+英语等课程",
            },
        }
    elif ying_class == "英语+国政":
        pro_ed_credits = 76
        ying_total = 93
        pro_ed = {
            "国际政治核心课": {
                "required_credits": 30,
                "note": "必修。与卓越学院有重叠课程，只需选一边修读",
            },
            "国际政治方向课": {
                "required_credits": 8,
                "note": "必修",
            },
            "国际谈判": {
                "required_credits": 2,
                "note": "实践教育模块，必修",
            },
            "英院课程自由选择": {
                "required_credits": 36,
                "note": "大类基础+英语等课程",
            },
        }
    else:
        pro_ed_credits = 52
        ying_total = 69
        pro_ed = {
            "专业教育课程": {
                "required_credits": 52,
                "note": "大类基础+专业核心+培养方向课程（含专业实习）",
            },
        }

    ying_section = {
        "专业教育课程 (%d学分)" % pro_ed_credits: pro_ed,
        "第二外语 (12学分)": {
            "_flat": True,
            "required_credits": 12,
            "note": "学期3-6",
        },
        "毕业论文 (5学分)": {
            "_flat": True,
            "required_credits": 5,
            "note": "学期7-8",
        },
    }

    grand_total = zhuo_total + ying_total

    reqs = {
        "通识教育课程 (29学分)": {
            "公共基础课程 (27学分)": {
                "思想政治理论课（不含形势与政策）": {
                    "required_credits": 17,
                },
                "形势与政策": {
                    "required_credits": 2,
                    "note": "本学期待修",
                },
                "语文": {
                    "required_credits": 2,
                    "note": "语言学概论/现代汉语/中国现代文学/中国古代文学/阅读与写作 任选1门",
                },
                "体育": {
                    "required_credits": 4,
                    "note": "4学期体育课",
                },
                "理解艺术": {
                    "required_credits": 2,
                    "note": "理解艺术A+B",
                },
            },
            "通识选修课程 (2学分)": {
                "_flat": True,
                "required_credits": 2,
                "note": "六大模块任选",
            },
        },
        "卓越课程模块 (%d学分)" % (zhuo_total - 29): zhuo_section,
        "英语学院 (%d学分)" % ying_total: ying_section,
    }

    return reqs, grand_total


def parse_transcript(text):
    courses = []
    lines = text.strip().split("\n")
    i = 0
    current_semester = ""

    while i < len(lines):
        line = lines[i].strip()

        semester_match = re.match(r"(\d{4}-\d{4}学年.*学期)", line)
        if semester_match:
            current_semester = semester_match.group(1)
            i += 1
            if i < len(lines) and "课程名称" in lines[i]:
                i += 1
            continue

        if not line or line.startswith("GPA") or line.startswith("选择学期") or line.startswith("学生成绩") or line.startswith("课程名称") or line == "...":
            i += 1
            continue

        course_name = line

        if i + 1 < len(lines):
            meta_line = lines[i + 1].strip()
            if "|" in meta_line or re.match(r"^[A-Z0-9._]+", meta_line):
                code = ""
                course_type = ""
                category = ""
                req_type = ""

                parts = [p.strip() for p in meta_line.split("|")]
                if parts:
                    code = parts[0].strip()
                if len(parts) >= 2:
                    course_type = parts[1].strip()
                if len(parts) >= 3:
                    category = parts[2].strip()
                if len(parts) >= 4:
                    req_type = parts[3].strip()
                if len(parts) == 2:
                    category = parts[1].strip()

                credits = 0
                grade_point = 0
                score = ""
                if i + 2 < len(lines):
                    score_line = lines[i + 2].strip()
                    score_match = re.match(r"^(\d+)\s+([\d.]+)\s+(\S+)", score_line)
                    if score_match:
                        credits = int(score_match.group(1))
                        grade_point = float(score_match.group(2))
                        score = score_match.group(3)
                        i += 3
                    else:
                        i += 2
                else:
                    i += 2

                courses.append({
                    "name": course_name,
                    "code": code,
                    "course_type": course_type,
                    "category": category,
                    "req_type": req_type,
                    "credits": credits,
                    "grade_point": grade_point,
                    "score": score,
                    "semester": current_semester,
                })
                continue

        i += 1

    return courses


def categorize_course(course, ying_class, zhuo_class):
    code = course["code"]
    name = course["name"]
    category = course["category"]

    is_gaofan = zhuo_class == "高翻班"
    zhuo_mod_credits = 72 if is_gaofan else 66

    if ying_class == "翻译+工管":
        ying_credits = 93
    elif ying_class == "英语+国政":
        ying_credits = 93
    else:
        ying_credits = 69

    zhuo_label = "卓越课程模块 (%d学分)" % zhuo_mod_credits
    ying_label = "英语学院 (%d学分)" % ying_credits

    if ying_class in ("翻译+工管", "英语+国政"):
        pro_ed_label = "专业教育课程 (76学分)"
    else:
        pro_ed_label = "专业教育课程 (52学分)"

    platform_credits = 18 if is_gaofan else 12
    if zhuo_class == "国别班":
        platform_label = "国别区域研究方法课程 (%d学分)" % platform_credits
    else:
        plat_name = {"高翻班": "高级翻译方向", "国组班": "国际组织方向", "外交班": "外交外事方向"}[zhuo_class]
        platform_label = "%s课程 (%d学分)" % (plat_name, platform_credits)

    # === 通识教育课程 ===
    if code.startswith("MAR."):
        if "形势与政策" in name:
            return ("通识教育课程 (29学分)", "公共基础课程 (27学分)", "形势与政策")
        return ("通识教育课程 (29学分)", "公共基础课程 (27学分)", "思想政治理论课（不含形势与政策）")

    if code.startswith("PED."):
        return ("通识教育课程 (29学分)", "公共基础课程 (27学分)", "体育")

    if code.startswith("ART.") or "理解艺术" in name:
        return ("通识教育课程 (29学分)", "公共基础课程 (27学分)", "理解艺术")

    if code.startswith("CSE.") or code.startswith("1.030"):
        return ("通识教育课程 (29学分)", "公共基础课程 (27学分)", "语文")

    if code.startswith("1.010") or "通识选修" in category:
        return ("通识教育课程 (29学分)", "通识选修课程 (2学分)", None)

    # === 卓越课程模块 ===
    if code == "HON.C1003" or "国际课程" in name:
        return (zhuo_label, "国际课程 (4学分)", None)

    if code in ("HON.C1001", "HON.C1002", "HON.C2001"):
        return (zhuo_label, "卓越博雅课程 (14学分)", "博雅必修")

    if code.startswith("HON.G") or code.startswith("HOG.G"):
        return (zhuo_label, "卓越博雅课程 (14学分)", "博雅选修")

    if code.startswith("HON.E"):
        return (zhuo_label, "英语强化课程 (32学分)", None)

    if code.startswith("SRPP"):
        return (zhuo_label, platform_label, None)

    if "卓越实践" in name:
        return (zhuo_label, "卓越实践 (2学分)", None)

    if "创新创业" in name:
        return (zhuo_label, "创新创业实践 (2学分)", None)

    # === 英语学院 ===
    if code.startswith("FFS."):
        return (ying_label, "第二外语 (12学分)", None)

    if "毕业论文" in name or "毕业设计" in name:
        return (ying_label, "毕业论文 (5学分)", None)

    if ying_class == "翻译+工管":
        if "商务数据分析" in name:
            return (ying_label, pro_ed_label, "商务数据分析")

        OVERRIDE_TO_DIRECTION = {"TIBA4203"}

        if code.startswith("TIBA"):
            if "专业方向" in category or code in OVERRIDE_TO_DIRECTION:
                return (ying_label, pro_ed_label, "工商管理方向课")
            else:
                return (ying_label, pro_ed_label, "工商管理核心课")

        if code.startswith(("ENGL", "TRIN", "ENIP", "HSPP")):
            return (ying_label, pro_ed_label, "英院课程自由选择")

    elif ying_class == "英语+国政":
        if "国际谈判" in name:
            return (ying_label, pro_ed_label, "国际谈判")

        if code.startswith("TIBA") or code.startswith("POLI"):
            if "专业方向" in category:
                return (ying_label, pro_ed_label, "国际政治方向课")
            else:
                return (ying_label, pro_ed_label, "国际政治核心课")

        if code.startswith(("ENGL", "TRIN", "ENIP", "HSPP")):
            return (ying_label, pro_ed_label, "英院课程自由选择")

    else:
        if code.startswith(("ENGL", "TRIN", "ENIP", "HSPP", "TIBA")):
            return (ying_label, pro_ed_label, "专业教育课程")

    # HOG.* fallback
    if code.startswith("HOG."):
        return (zhuo_label, "卓越博雅课程 (14学分)", "博雅选修")

    return ("未分类", "未分类", None)


def check_credits(courses, requirements, grand_total, ying_class, zhuo_class):
    credit_map = {}
    uncategorized = []

    for c in courses:
        section, cat, subcat = categorize_course(c, ying_class, zhuo_class)
        if section == "未分类":
            uncategorized.append(c)
            continue
        key = (section, cat, subcat)
        if key not in credit_map:
            credit_map[key] = []
        credit_map[key].append(c)

    results = []
    missing_items = []
    overflow_items = []

    for section_name, section_data in requirements.items():
        section_result = {
            "name": section_name,
            "categories": [],
            "section_target": int(re.search(r"(\d+)学分", section_name).group(1)),
            "section_earned": 0,
        }

        for cat_name, cat_data in section_data.items():
            is_flat = cat_data.get("_flat", False)

            if is_flat:
                key = (section_name, cat_name, None)
                matched = credit_map.get(key, [])
                earned = sum(c["credits"] for c in matched)
                target = cat_data["required_credits"]
                capped = min(earned, target)

                cat_result = {
                    "name": cat_name,
                    "target": target,
                    "earned": earned,
                    "capped": capped,
                    "complete": earned >= target,
                    "courses": matched,
                    "note": cat_data.get("note", ""),
                    "subcategories": None,
                }

                if "required_courses" in cat_data:
                    req_status = []
                    matched_codes = {c["code"] for c in matched}
                    matched_names = {c["name"] for c in matched}
                    for req_code, req_name, req_credits in cat_data["required_courses"]:
                        found = False
                        if req_code and req_code in matched_codes:
                            found = True
                        elif any(req_name.split("(")[0].strip().split("（")[0].strip() in mn for mn in matched_names):
                            found = True
                        req_status.append({
                            "code": req_code or "—",
                            "name": req_name,
                            "credits": req_credits,
                            "done": found,
                        })
                        if not found:
                            missing_items.append({
                                "section": section_name,
                                "category": cat_name,
                                "course": req_name,
                                "credits": req_credits,
                            })
                    cat_result["required_courses"] = req_status

                if not cat_result["complete"]:
                    gap = target - earned
                    if gap > 0 and "required_courses" not in cat_data:
                        missing_items.append({
                            "section": section_name,
                            "category": cat_name,
                            "course": "还需 %d 学分" % gap,
                            "credits": gap,
                        })
                elif earned > target:
                    overflow_items.append({
                        "section": section_name,
                        "category": cat_name,
                        "excess": earned - target,
                        "earned": earned,
                        "target": target,
                    })

                section_result["section_earned"] += capped
                section_result["categories"].append(cat_result)

            else:
                cat_target = int(re.search(r"(\d+)学分", cat_name).group(1))
                cat_earned = 0
                subcats = []

                for sub_name, sub_data in cat_data.items():
                    if sub_name.startswith("_"):
                        continue
                    key = (section_name, cat_name, sub_name)
                    matched = credit_map.get(key, [])
                    earned = sum(c["credits"] for c in matched)
                    target = sub_data["required_credits"]
                    capped = min(earned, target)

                    sub_result = {
                        "name": sub_name,
                        "target": target,
                        "earned": earned,
                        "capped": capped,
                        "complete": earned >= target,
                        "courses": matched,
                        "note": sub_data.get("note", ""),
                    }

                    if "required_courses" in sub_data:
                        req_status = []
                        matched_codes = {c["code"] for c in matched}
                        for req_code, req_name, req_credits in sub_data["required_courses"]:
                            found = req_code in matched_codes if req_code else False
                            req_status.append({
                                "code": req_code or "—",
                                "name": req_name,
                                "credits": req_credits,
                                "done": found,
                            })
                            if not found:
                                missing_items.append({
                                    "section": section_name,
                                    "category": "%s > %s" % (cat_name, sub_name),
                                    "course": req_name,
                                    "credits": req_credits,
                                })
                        sub_result["required_courses"] = req_status

                    if not sub_result["complete"]:
                        gap = target - earned
                        if gap > 0 and "required_courses" not in sub_data:
                            missing_items.append({
                                "section": section_name,
                                "category": "%s > %s" % (cat_name, sub_name),
                                "course": "还需 %d 学分" % gap,
                                "credits": gap,
                            })
                    elif earned > target:
                        overflow_items.append({
                            "section": section_name,
                            "category": "%s > %s" % (cat_name, sub_name),
                            "excess": earned - target,
                            "earned": earned,
                            "target": target,
                        })

                    cat_earned += capped
                    subcats.append(sub_result)

                cat_result = {
                    "name": cat_name,
                    "target": cat_target,
                    "earned": cat_earned,
                    "capped": min(cat_earned, cat_target),
                    "complete": cat_earned >= cat_target,
                    "subcategories": subcats,
                    "courses": None,
                }

                section_result["section_earned"] += min(cat_earned, cat_target)
                section_result["categories"].append(cat_result)

        results.append(section_result)

    total_earned = sum(s["section_earned"] for s in results)

    return {
        "results": results,
        "total_target": grand_total,
        "total_earned": total_earned,
        "total_complete": total_earned >= grand_total,
        "uncategorized": uncategorized,
        "missing": missing_items,
        "overflow": overflow_items,
        "course_count": len(courses),
    }


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        data = json.loads(body)

        transcript_text = data.get("transcript", "")
        zhuo_class = data.get("zhuo_class", "国别班")
        ying_class = data.get("ying_class", "翻译+工管")

        requirements, grand_total = build_requirements(zhuo_class, ying_class)
        courses = parse_transcript(transcript_text)
        result = check_credits(courses, requirements, grand_total, ying_class, zhuo_class)

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(result, ensure_ascii=False).encode("utf-8"))
