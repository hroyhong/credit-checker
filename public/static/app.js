// ============================================================
// 培养方案 Requirements (2022级 英语学院 x 卓越学院 联合培养)
// All logic runs client-side — no server needed
// ============================================================

function buildRequirements(zhuoClass, yingClass) {
    const isGaofan = zhuoClass === "高翻班";
    const platformCredits = isGaofan ? 18 : 12;
    const zhuoTotal = isGaofan ? 101 : 95;

    let platformCategory;
    if (zhuoClass === "国别班") {
        platformCategory = {
            [`国别区域研究方法课程 (${platformCredits}学分)`]: {
                _flat: true,
                required_credits: platformCredits,
                required_courses: [
                    ["SRPP1002", "区域国别研究导论 (H)", 2],
                    ["SRPP1001", "全球文明史概论 (H)", 2],
                    ["SRPP2001", "区域国别研究理论与方法 (H)", 2],
                    ["SRPP2002", "区域与国际发展：理论与实践 (H)", 2],
                    [null, "国别区域研究经典案例分析 (H)", 2],
                    ["SRPP3002", "政策研究入门 (H)", 2],
                ],
            }
        };
    } else {
        const labelMap = { "高翻班": "高级翻译方向", "国组班": "国际组织方向", "外交班": "外交外事方向" };
        const label = labelMap[zhuoClass];
        platformCategory = {
            [`${label}课程 (${platformCredits}学分)`]: {
                _flat: true,
                required_credits: platformCredits,
                note: `平台课程，详见${zhuoClass}培养方案`,
            }
        };
    }

    const zhuoSection = {
        "卓越博雅课程 (14学分)": {
            "博雅必修": {
                required_credits: 6,
                required_courses: [
                    ["HON.C1001", "Python程序设计基础 (H)", 2],
                    ["HON.C1002", "全媒体讯息设计与传播 (H)", 2],
                    ["HON.C2001", "计算机数据统计与社会科学研究方法 (H)", 2],
                ],
            },
            "博雅选修": {
                required_credits: 8,
                note: "历史与哲思/表达与传播/数据与科学/治理与发展模块选修",
            },
        },
        "英语强化课程 (32学分)": {
            _flat: true,
            required_credits: 32,
            required_courses: [
                ["HON.E1001", "人文阅读I (H)", 4],
                ["HON.E1004", "英语叙事文写作 (H)", 2],
                ["HON.E1002", "人文阅读II (H)", 4],
                ["HON.E1003", "演讲的艺术 (H)", 2],
                ["HON.E1005", "英语议论文写作 (H)", 2],
                ["HON.E2002", "人文阅读III (H)", 2],
                ["HON.E2006", "经典文献阅读I (H)", 1],
                ["HON.E2005", "英语辩论 (H)", 2],
                ["HON.E2001", "英语多文体写作 (H)", 2],
                ["HON.E2003", "人文阅读IV (H)", 2],
                ["HON.E2007", "经典文献阅读II (H)", 1],
                ["HON.E2004", "创意写作 (H)", 2],
                ["HON.E3008", "经典文献阅读III (H)", 1],
                ["HON.E3010", "学术写作I (H)", 2],
                ["HON.E3009", "经典文献阅读IV (H)", 1],
                ["HON.E3011", "学术写作II (H)", 2],
            ],
        },
        ...platformCategory,
        "国际课程 (4学分)": {
            _flat: true,
            required_credits: 4,
            required_courses: [
                ["HON.C1003", "国际课程 (H)", 4],
            ],
        },
        "卓越实践 (2学分)": {
            _flat: true,
            required_credits: 2,
            note: "根据卓越实践学分认定管理办法认定",
        },
        "创新创业实践 (2学分)": {
            _flat: true,
            required_credits: 2,
            note: "根据创新创业实践学分认定管理办法认定",
        },
    };

    let proEdCredits, yingTotal, proEd;
    if (yingClass === "翻译+工管") {
        proEdCredits = 76;
        yingTotal = 93;
        proEd = {
            "工商管理核心课": { required_credits: 31, note: "必修" },
            "工商管理方向课": { required_credits: 6, note: "必修" },
            "商务数据分析": { required_credits: 3, note: "实践教育模块，必修" },
            "英院课程自由选择": { required_credits: 36, note: "大类基础+翻译+英语等课程" },
        };
    } else if (yingClass === "英语+国政") {
        proEdCredits = 76;
        yingTotal = 93;
        proEd = {
            "国际政治核心课": { required_credits: 30, note: "必修。与卓越学院有重叠课程，只需选一边修读" },
            "国际政治方向课": { required_credits: 8, note: "必修" },
            "国际谈判": { required_credits: 2, note: "实践教育模块，必修" },
            "英院课程自由选择": { required_credits: 36, note: "大类基础+英语等课程" },
        };
    } else {
        proEdCredits = 52;
        yingTotal = 69;
        proEd = {
            "专业教育课程": { required_credits: 52, note: "大类基础+专业核心+培养方向课程（含专业实习）" },
        };
    }

    const yingSection = {
        [`专业教育课程 (${proEdCredits}学分)`]: proEd,
        "第二外语 (12学分)": { _flat: true, required_credits: 12, note: "学期3-6" },
        "毕业论文 (5学分)": { _flat: true, required_credits: 5, note: "学期7-8" },
    };

    const grandTotal = zhuoTotal + yingTotal;
    const reqs = {
        "通识教育课程 (29学分)": {
            "公共基础课程 (27学分)": {
                "思想政治理论课（不含形势与政策）": { required_credits: 17 },
                "形势与政策": { required_credits: 2, note: "本学期待修" },
                "语文": { required_credits: 2, note: "语言学概论/现代汉语/中国现代文学/中国古代文学/阅读与写作 任选1门" },
                "体育": { required_credits: 4, note: "4学期体育课" },
                "理解艺术": { required_credits: 2, note: "理解艺术A+B" },
            },
            "通识选修课程 (2学分)": { _flat: true, required_credits: 2, note: "六大模块任选" },
        },
        [`卓越课程模块 (${zhuoTotal - 29}学分)`]: zhuoSection,
        [`英语学院 (${yingTotal}学分)`]: yingSection,
    };

    return { reqs, grandTotal };
}

function parseTranscript(text) {
    const courses = [];
    const lines = text.trim().split("\n");
    let i = 0;
    let currentSemester = "";

    while (i < lines.length) {
        const line = lines[i].trim();

        const semesterMatch = line.match(/(\d{4}-\d{4}学年.*学期)/);
        if (semesterMatch) {
            currentSemester = semesterMatch[1];
            i++;
            if (i < lines.length && lines[i].includes("课程名称")) i++;
            continue;
        }

        if (!line || line.startsWith("GPA") || line.startsWith("选择学期") || line.startsWith("学生成绩") || line.startsWith("课程名称") || line === "...") {
            i++;
            continue;
        }

        const courseName = line;

        if (i + 1 < lines.length) {
            const metaLine = lines[i + 1].trim();
            if (metaLine.includes("|") || /^[A-Z0-9._]+/.test(metaLine)) {
                let code = "", courseType = "", category = "", reqType = "";
                const parts = metaLine.split("|").map(p => p.trim());
                if (parts.length > 0) code = parts[0];
                if (parts.length >= 2) courseType = parts[1];
                if (parts.length >= 3) category = parts[2];
                if (parts.length >= 4) reqType = parts[3];
                if (parts.length === 2) category = parts[1];

                let credits = 0, gradePoint = 0, score = "";
                if (i + 2 < lines.length) {
                    const scoreLine = lines[i + 2].trim();
                    const scoreMatch = scoreLine.match(/^(\d+)\s+([\d.]+)\s+(\S+)/);
                    if (scoreMatch) {
                        credits = parseInt(scoreMatch[1]);
                        gradePoint = parseFloat(scoreMatch[2]);
                        score = scoreMatch[3];
                        i += 3;
                    } else {
                        i += 2;
                    }
                } else {
                    i += 2;
                }

                courses.push({
                    name: courseName, code, course_type: courseType, category,
                    req_type: reqType, credits, grade_point: gradePoint,
                    score, semester: currentSemester,
                });
                continue;
            }
        }
        i++;
    }
    return courses;
}

function categorizeCourse(course, yingClass, zhuoClass) {
    const { code, name, category } = course;
    const isGaofan = zhuoClass === "高翻班";
    const zhuoModCredits = isGaofan ? 72 : 66;
    const yingCredits = (yingClass === "翻译+工管" || yingClass === "英语+国政") ? 93 : 69;

    const zhuoLabel = `卓越课程模块 (${zhuoModCredits}学分)`;
    const yingLabel = `英语学院 (${yingCredits}学分)`;
    const proEdLabel = (yingClass === "翻译+工管" || yingClass === "英语+国政") ? "专业教育课程 (76学分)" : "专业教育课程 (52学分)";

    const platformCredits = isGaofan ? 18 : 12;
    let platformLabel;
    if (zhuoClass === "国别班") {
        platformLabel = `国别区域研究方法课程 (${platformCredits}学分)`;
    } else {
        const platName = { "高翻班": "高级翻译方向", "国组班": "国际组织方向", "外交班": "外交外事方向" }[zhuoClass];
        platformLabel = `${platName}课程 (${platformCredits}学分)`;
    }

    // === 通识教育课程 ===
    if (code.startsWith("MAR.")) {
        if (name.includes("形势与政策")) return ["通识教育课程 (29学分)", "公共基础课程 (27学分)", "形势与政策"];
        return ["通识教育课程 (29学分)", "公共基础课程 (27学分)", "思想政治理论课（不含形势与政策）"];
    }
    if (code.startsWith("PED.")) return ["通识教育课程 (29学分)", "公共基础课程 (27学分)", "体育"];
    if (code.startsWith("ART.") || name.includes("理解艺术")) return ["通识教育课程 (29学分)", "公共基础课程 (27学分)", "理解艺术"];
    if (code.startsWith("CSE.") || code.startsWith("1.030")) return ["通识教育课程 (29学分)", "公共基础课程 (27学分)", "语文"];
    if (code.startsWith("1.010") || category.includes("通识选修")) return ["通识教育课程 (29学分)", "通识选修课程 (2学分)", null];

    // === 卓越课程模块 ===
    if (code === "HON.C1003" || name.includes("国际课程")) return [zhuoLabel, "国际课程 (4学分)", null];
    if (["HON.C1001", "HON.C1002", "HON.C2001"].includes(code)) return [zhuoLabel, "卓越博雅课程 (14学分)", "博雅必修"];
    if (code.startsWith("HON.G") || code.startsWith("HOG.G")) return [zhuoLabel, "卓越博雅课程 (14学分)", "博雅选修"];
    if (code.startsWith("HON.E")) return [zhuoLabel, "英语强化课程 (32学分)", null];
    // SRPP2113 希腊神话与西方文化 is 博雅选修, not platform
    if (code === "SRPP2113") return [zhuoLabel, "卓越博雅课程 (14学分)", "博雅选修"];
    if (code.startsWith("SRPP") || code.startsWith("IOPP")) return [zhuoLabel, platformLabel, null];
    if (name.includes("卓越实践")) return [zhuoLabel, "卓越实践 (2学分)", null];
    if (name.includes("创新创业")) return [zhuoLabel, "创新创业实践 (2学分)", null];

    // === 英语学院 ===
    if (code.startsWith("FFS.") || code.startsWith("ELS.")) return [yingLabel, "第二外语 (12学分)", null];
    if (name.includes("毕业论文") || name.includes("毕业设计")) return [yingLabel, "毕业论文 (5学分)", null];

    if (yingClass === "翻译+工管") {
        if (name.includes("商务数据分析")) return [yingLabel, proEdLabel, "商务数据分析"];
        const OVERRIDE_TO_DIRECTION = new Set(["TIBA4203"]);
        if (code.startsWith("TIBA")) {
            if (category.includes("专业方向") || OVERRIDE_TO_DIRECTION.has(code))
                return [yingLabel, proEdLabel, "工商管理方向课"];
            return [yingLabel, proEdLabel, "工商管理核心课"];
        }
        if (code.startsWith("ENGL") || code.startsWith("TRIN") || code.startsWith("ENIP") || code.startsWith("HSPP"))
            return [yingLabel, proEdLabel, "英院课程自由选择"];
    } else if (yingClass === "英语+国政") {
        if (name.includes("国际谈判")) return [yingLabel, proEdLabel, "国际谈判"];
        if (code.startsWith("TIBA") || code.startsWith("POLI")) {
            if (category.includes("专业方向")) return [yingLabel, proEdLabel, "国际政治方向课"];
            return [yingLabel, proEdLabel, "国际政治核心课"];
        }
        if (code.startsWith("ENGL") || code.startsWith("TRIN") || code.startsWith("ENIP") || code.startsWith("HSPP"))
            return [yingLabel, proEdLabel, "英院课程自由选择"];
    } else {
        if (code.startsWith("ENGL") || code.startsWith("TRIN") || code.startsWith("ENIP") || code.startsWith("HSPP") || code.startsWith("TIBA"))
            return [yingLabel, proEdLabel, "专业教育课程"];
    }

    if (code.startsWith("HOG.")) return [zhuoLabel, "卓越博雅课程 (14学分)", "博雅选修"];
    return ["未分类", "未分类", null];
}

function checkCreditsLogic(courses, requirements, grandTotal, yingClass, zhuoClass) {
    const creditMap = {};
    const uncategorized = [];

    for (const c of courses) {
        const [section, cat, subcat] = categorizeCourse(c, yingClass, zhuoClass);
        if (section === "未分类") { uncategorized.push(c); continue; }
        const key = `${section}|||${cat}|||${subcat}`;
        if (!creditMap[key]) creditMap[key] = [];
        creditMap[key].push(c);
    }

    const results = [];
    const missingItems = [];
    const overflowItems = [];

    for (const [sectionName, sectionData] of Object.entries(requirements)) {
        const sectionTarget = parseInt(sectionName.match(/(\d+)学分/)[1]);
        const sectionResult = { name: sectionName, categories: [], section_target: sectionTarget, section_earned: 0 };

        for (const [catName, catData] of Object.entries(sectionData)) {
            const isFlat = catData._flat || false;

            if (isFlat) {
                const key = `${sectionName}|||${catName}|||null`;
                const matched = creditMap[key] || [];
                const earned = matched.reduce((s, c) => s + c.credits, 0);
                const target = catData.required_credits;
                const capped = Math.min(earned, target);

                const catResult = {
                    name: catName, target, earned, capped,
                    complete: earned >= target, courses: matched,
                    note: catData.note || "", subcategories: null,
                };

                if (catData.required_courses) {
                    const reqStatus = [];
                    const matchedCodes = new Set(matched.map(c => c.code));
                    const matchedNames = matched.map(c => c.name);
                    for (const [reqCode, reqName, reqCredits] of catData.required_courses) {
                        let found = false;
                        if (reqCode && matchedCodes.has(reqCode)) found = true;
                        else {
                            const baseName = reqName.split("(")[0].trim().split("（")[0].trim();
                            if (matchedNames.some(mn => mn.includes(baseName))) found = true;
                        }
                        reqStatus.push({ code: reqCode || "—", name: reqName, credits: reqCredits, done: found });
                        if (!found) missingItems.push({ section: sectionName, category: catName, course: reqName, credits: reqCredits });
                    }
                    catResult.required_courses = reqStatus;
                }

                if (!catResult.complete) {
                    const gap = target - earned;
                    if (gap > 0 && !catData.required_courses)
                        missingItems.push({ section: sectionName, category: catName, course: `还需 ${gap} 学分`, credits: gap });
                } else if (earned > target) {
                    overflowItems.push({ section: sectionName, category: catName, excess: earned - target, earned, target });
                }

                sectionResult.section_earned += capped;
                sectionResult.categories.push(catResult);

            } else {
                const catTarget = parseInt(catName.match(/(\d+)学分/)[1]);
                let catEarned = 0;
                const subcats = [];

                for (const [subName, subData] of Object.entries(catData)) {
                    if (subName.startsWith("_")) continue;
                    const key = `${sectionName}|||${catName}|||${subName}`;
                    const matched = creditMap[key] || [];
                    const earned = matched.reduce((s, c) => s + c.credits, 0);
                    const target = subData.required_credits;
                    const capped = Math.min(earned, target);

                    const subResult = {
                        name: subName, target, earned, capped,
                        complete: earned >= target, courses: matched,
                        note: subData.note || "",
                    };

                    if (subData.required_courses) {
                        const reqStatus = [];
                        const matchedCodes = new Set(matched.map(c => c.code));
                        for (const [reqCode, reqName, reqCredits] of subData.required_courses) {
                            const found = reqCode ? matchedCodes.has(reqCode) : false;
                            reqStatus.push({ code: reqCode || "—", name: reqName, credits: reqCredits, done: found });
                            if (!found) missingItems.push({ section: sectionName, category: `${catName} > ${subName}`, course: reqName, credits: reqCredits });
                        }
                        subResult.required_courses = reqStatus;
                    }

                    if (!subResult.complete) {
                        const gap = target - earned;
                        if (gap > 0 && !subData.required_courses)
                            missingItems.push({ section: sectionName, category: `${catName} > ${subName}`, course: `还需 ${gap} 学分`, credits: gap });
                    } else if (earned > target) {
                        overflowItems.push({ section: sectionName, category: `${catName} > ${subName}`, excess: earned - target, earned, target });
                    }

                    catEarned += capped;
                    subcats.push(subResult);
                }

                const catResult = {
                    name: catName, target: catTarget, earned: catEarned,
                    capped: Math.min(catEarned, catTarget),
                    complete: catEarned >= catTarget, subcategories: subcats, courses: null,
                };

                sectionResult.section_earned += Math.min(catEarned, catTarget);
                sectionResult.categories.push(catResult);
            }
        }
        results.push(sectionResult);
    }

    const totalEarned = results.reduce((s, r) => s + r.section_earned, 0);

    return {
        results, total_target: grandTotal, total_earned: totalEarned,
        total_complete: totalEarned >= grandTotal,
        uncategorized, missing: missingItems, overflow: overflowItems,
        course_count: courses.length,
    };
}

// ============================================================
// UI Logic
// ============================================================

function getSelections() {
    const zhuo = document.querySelector('input[name="zhuo"]:checked').value;
    const ying = document.querySelector('input[name="ying"]:checked').value;
    return { zhuo, ying };
}

function updateTotalPreview() {
    const { zhuo, ying } = getSelections();
    const zhuoCredits = zhuo === "高翻班" ? 101 : 95;
    const yingCredits = (ying === "翻译+工管" || ying === "英语+国政") ? 93 : 69;
    const total = zhuoCredits + yingCredits;
    document.getElementById("total-preview").textContent =
        `${zhuo} (${zhuoCredits}) + ${ying} (${yingCredits}) = ${total} 学分`;
}

document.querySelectorAll('input[name="zhuo"], input[name="ying"]').forEach(el => {
    el.addEventListener("change", updateTotalPreview);
});

function toggleScores() {
    document.body.classList.toggle("hide-scores", document.getElementById("hide-scores").checked);
}

function checkCredits() {
    const text = document.getElementById("transcript").value.trim();
    if (!text) return;

    const { zhuo, ying } = getSelections();
    const btn = document.getElementById("check-btn");
    btn.textContent = "检查中...";
    btn.disabled = true;

    try {
        const { reqs, grandTotal } = buildRequirements(zhuo, ying);
        const courses = parseTranscript(text);
        const data = checkCreditsLogic(courses, reqs, grandTotal, ying, zhuo);
        renderResults(data);
    } catch (e) {
        alert("Error: " + e.message);
    } finally {
        btn.textContent = "检查学分";
        btn.disabled = false;
    }
}

function renderResults(data) {
    document.getElementById("results-section").style.display = "block";

    const totalEl = document.getElementById("summary-total");
    const statusEl = document.getElementById("summary-status");
    const cls = data.total_complete ? "complete" : "incomplete";

    totalEl.innerHTML = `
        <div class="label">已修 / 总计</div>
        <div class="value ${cls}">${data.total_earned} / ${data.total_target}</div>
    `;
    statusEl.innerHTML = `
        <div class="label">状态</div>
        <div class="value ${cls}">${data.total_complete ? "已完成全部学分" : "未完成 (差 " + (data.total_target - data.total_earned) + " 学分)"}</div>
    `;

    const missingEl = document.getElementById("missing-summary");
    if (data.missing && data.missing.length > 0) {
        document.getElementById("missing-section").style.display = "block";
        missingEl.innerHTML = "";
        for (const m of data.missing) {
            const div = document.createElement("div");
            div.className = "missing-item";
            div.innerHTML = `
                <span class="missing-dot"></span>
                <span class="missing-course">${m.course}</span>
                <span class="missing-cat">${m.category}</span>
                <span class="missing-credits">${m.credits}学分</span>
            `;
            missingEl.appendChild(div);
        }
    } else {
        document.getElementById("missing-section").style.display = "none";
    }

    const overflowEl = document.getElementById("overflow-summary");
    if (data.overflow && data.overflow.length > 0) {
        document.getElementById("overflow-section").style.display = "block";
        overflowEl.innerHTML = "";
        for (const o of data.overflow) {
            const div = document.createElement("div");
            div.className = "overflow-item";
            div.innerHTML = `
                <span class="overflow-dot"></span>
                <span class="overflow-cat">${o.category}</span>
                <span class="overflow-detail">${o.earned} / ${o.target}</span>
                <span class="overflow-excess">+${o.excess}学分</span>
            `;
            overflowEl.appendChild(div);
        }
    } else {
        document.getElementById("overflow-section").style.display = "none";
    }

    const container = document.getElementById("results");
    container.innerHTML = "";

    for (const section of data.results) {
        const sDiv = document.createElement("div");
        sDiv.className = "section";

        const sCls = section.section_earned >= section.section_target ? "complete" : "incomplete";
        sDiv.innerHTML = `
            <div class="section-header">
                <h2>${section.name}</h2>
                <span class="credits-badge" style="color: ${sCls === 'complete' ? '#34c759' : '#ff3b30'}">${section.section_earned} / ${section.section_target}</span>
            </div>
        `;

        for (const cat of section.categories) {
            sDiv.appendChild(renderCategory(cat));
        }

        container.appendChild(sDiv);
    }

    if (data.uncategorized && data.uncategorized.length > 0) {
        document.getElementById("uncategorized-section").style.display = "block";
        const ucDiv = document.getElementById("uncategorized");
        ucDiv.innerHTML = "";
        for (const c of data.uncategorized) {
            ucDiv.innerHTML += `<div class="course-item">
                <span><span class="name">${c.name}</span><span class="code">${c.code}</span></span>
                <span class="meta"><span class="credits">${c.credits}学分</span><span class="score">${c.score}</span></span>
            </div>`;
        }
    } else {
        document.getElementById("uncategorized-section").style.display = "none";
    }

    document.getElementById("missing-section").scrollIntoView({ behavior: "smooth" });
}

function renderCategory(cat) {
    const div = document.createElement("div");
    div.className = "category";

    const pct = cat.target > 0 ? Math.min(100, Math.round((cat.earned / cat.target) * 100)) : 100;
    const status = cat.complete ? "done" : (cat.earned > 0 ? "partial" : "missing");
    const displayEarned = cat.earned !== undefined ? cat.earned : cat.capped;

    div.innerHTML = `
        <div class="category-header" onclick="this.parentElement.classList.toggle('open')">
            <div class="left">
                <span class="status-dot ${status}"></span>
                <span class="cat-name">${cat.name}</span>
            </div>
            <div class="right">
                <span class="progress-text">${displayEarned} / ${cat.target}</span>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill ${status}" style="width: ${pct}%"></div>
                </div>
                <span class="chevron">&#9654;</span>
            </div>
        </div>
    `;

    const body = document.createElement("div");
    body.className = "category-body";

    if (cat.subcategories) {
        for (const sub of cat.subcategories) {
            body.appendChild(renderSubcategory(sub));
        }
    } else {
        if (cat.required_courses) {
            for (const rc of cat.required_courses) {
                body.appendChild(renderReqCourse(rc));
            }
        }
        if (cat.courses) {
            for (const c of cat.courses) {
                body.appendChild(renderCourseItem(c));
            }
        }
        if (cat.note) {
            const note = document.createElement("div");
            note.className = "note";
            note.textContent = cat.note;
            body.appendChild(note);
        }
    }

    div.appendChild(body);
    return div;
}

function renderSubcategory(sub) {
    const div = document.createElement("div");
    div.className = "subcategory";

    const status = sub.complete ? "done" : (sub.earned > 0 ? "partial" : "missing");

    div.innerHTML = `
        <div class="subcat-header">
            <span class="name"><span class="status-dot ${status}" style="display:inline-block;margin-right:6px;"></span>${sub.name}</span>
            <span class="credits">${sub.earned} / ${sub.target}</span>
        </div>
    `;

    if (sub.required_courses) {
        for (const rc of sub.required_courses) {
            div.appendChild(renderReqCourse(rc));
        }
    }

    if (sub.courses) {
        for (const c of sub.courses) {
            div.appendChild(renderCourseItem(c));
        }
    }

    if (sub.note) {
        const note = document.createElement("div");
        note.className = "note";
        note.textContent = sub.note;
        div.appendChild(note);
    }

    return div;
}

function renderReqCourse(rc) {
    const div = document.createElement("div");
    div.className = "req-course" + (rc.done ? "" : " is-missing");
    div.innerHTML = `
        <span class="check ${rc.done ? 'done' : 'missing'}">${rc.done ? '✓' : ''}</span>
        <span class="name">${rc.name}</span>
        <span class="credits" style="color:#86868b;margin-left:auto;">${rc.credits}学分</span>
    `;
    return div;
}

function renderCourseItem(c) {
    const div = document.createElement("div");
    div.className = "course-item";
    div.innerHTML = `
        <span><span class="name">${c.name}</span><span class="code">${c.code}</span></span>
        <span class="meta"><span class="credits">${c.credits}学分</span><span class="score">${c.score}</span></span>
    `;
    return div;
}
